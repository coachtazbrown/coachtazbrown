"use client";

import { useEffect, useRef, useState } from "react";
import type { Cut, FactCheckItem, Production } from "@/lib/studio/types";
import VideoPlayer from "./VideoPlayer";
import { addToLibrary, loadLibrary, removeFromLibrary, type LibItem } from "./library";

const STAGES = [
  { key: "research", label: "Researching the topic", sub: "live web search · gathering reputable sources" },
  { key: "ground", label: "Grounding on clean data", sub: "RAG retrieval over the craft corpus" },
  { key: "script", label: "Writing both 16:9 cuts", sub: "YouTube long-form + LinkedIn short" },
  { key: "factcheck", label: "Fact-checking every claim", sub: "no specific ships without a source" },
  { key: "render", label: "Assembling the faceless videos", sub: "scenes · captions · voiceover" }
];

const SUGGESTIONS = [
  "compound interest",
  "prompt engineering",
  "reading a balance sheet",
  "building better habits"
];

function download(name: string, text: string, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function fmtSrtTime(s: number): string {
  const ms = Math.floor((s % 1) * 1000);
  const sec = Math.floor(s) % 60;
  const min = Math.floor(s / 60) % 60;
  const hr = Math.floor(s / 3600);
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(hr)}:${p(min)}:${p(sec)},${p(ms, 3)}`;
}

function toSRT(cut: Cut): string {
  let acc = 0;
  return cut.scenes
    .map((s, i) => {
      const start = acc;
      acc += s.seconds;
      return `${i + 1}\n${fmtSrtTime(start)} --> ${fmtSrtTime(acc)}\n${s.voiceover}\n`;
    })
    .join("\n");
}

function toScript(cut: Cut): string {
  return [
    cut.title,
    `(${cut.label} · ~${cut.targetSeconds}s)`,
    "",
    ...cut.scenes.map(
      (s) =>
        `[${String(s.id).padStart(2, "0")}] ${s.role.toUpperCase()} · ${s.seconds}s · on-screen: "${s.onScreen}"\nVISUAL: ${s.visual}\nVO: ${s.voiceover}\n`
    )
  ].join("\n");
}

const VERDICT: Record<FactCheckItem["verdict"], { label: string; cls: string }> = {
  verified: { label: "Verified", cls: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  "needs-review": { label: "Needs review", cls: "bg-amber-100 text-amber-800 border-amber-300" },
  corrected: { label: "Corrected", cls: "bg-blue-100 text-blue-800 border-blue-300" },
  opinion: { label: "Guidance", cls: "bg-slate-100 text-slate-700 border-slate-300" }
};

export default function StudioConsole() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [prod, setProd] = useState<Production | null>(null);
  const [activeCut, setActiveCut] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [library, setLibrary] = useState<LibItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);
  useEffect(() => { setLibrary(loadLibrary()); }, []);

  function openSaved(item: LibItem) {
    setProd(item.production);
    setActiveCut(0);
    setError(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteSaved(id: string) {
    setLibrary(removeFromLibrary(id));
  }

  async function generate(t: string) {
    const topicToUse = t.trim();
    if (!topicToUse || loading) return;
    setLoading(true);
    setError(null);
    setProd(null);
    setStage(0);
    timerRef.current = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 1600);

    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: topicToUse })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Generation failed");
      const production = data.production as Production;
      setProd(production);
      setActiveCut(0);
      setLibrary(addToLibrary(production));
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Try the topic again.");
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setLoading(false);
    }
  }

  const cut = prod?.cuts[activeCut];

  return (
    <div>
      {/* ── Topic console ── */}
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm md:p-8">
        <label className="text-xs font-semibold uppercase tracking-widest text-slate2">
          Give me the topic — I&apos;ll make the videos
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate(topic)}
            placeholder="e.g. compound interest, prompt engineering, cold email…"
            className="flex-1 rounded-full border border-ink/15 bg-bone px-5 py-3 text-base outline-none focus:border-accent"
          />
          <button
            onClick={() => generate(topic)}
            disabled={loading || !topic.trim()}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Working…" : "Create my videos →"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setTopic(s); generate(s); }}
              disabled={loading}
              className="rounded-full border border-ink/15 bg-bone px-3 py-1 text-xs text-slate2 hover:border-ink disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Studio library ── */}
      {library.length > 0 && (
        <div className="mt-6 rounded-3xl border border-ink/10 bg-white p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate2">
              Your studio library
            </div>
            <div className="text-xs text-slate2">{library.length} saved · stored on this device</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {library.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-2 rounded-full border border-ink/15 bg-bone py-1 pl-3 pr-1.5 text-sm"
              >
                <button onClick={() => openSaved(item)} className="max-w-[16rem] truncate hover:text-accent" title={item.topic}>
                  {item.topic}
                </button>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${item.demo ? "bg-ink/10 text-slate2" : "bg-sage/20 text-sage"}`}>
                  {item.demo ? "offline" : "live"}
                </span>
                <button
                  onClick={() => deleteSaved(item.id)}
                  className="rounded-full px-1.5 text-slate2 hover:text-red-600"
                  title="Remove from library"
                  aria-label="Remove from library"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Pipeline progress ── */}
      {loading && (
        <div className="mt-6 grid gap-3 rounded-3xl border border-ink/10 bg-white p-6 sm:grid-cols-5">
          {STAGES.map((st, i) => (
            <div
              key={st.key}
              className={`rounded-2xl border p-4 transition ${
                i < stage
                  ? "border-sage/40 bg-sage/5"
                  : i === stage
                  ? "border-accent/40 bg-accent/5"
                  : "border-ink/10 bg-bone"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    i < stage ? "bg-sage" : i === stage ? "animate-pulse bg-accent" : "bg-ink/20"
                  }`}
                />
                {st.label}
              </div>
              <div className="mt-1 text-xs text-slate2">{st.sub}</div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* ── Results ── */}
      {prod && cut && (
        <div className="mt-8">
          {/* meta strip */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-bone">
              {prod.demo ? "Offline engine" : `Live · ${prod.model}`}
            </span>
            <span className="rounded-full border border-ink/15 px-3 py-1 text-xs">
              Fact-check score <b>{prod.factCheck.score}/100</b>
            </span>
            <span className="rounded-full border border-ink/15 px-3 py-1 text-xs">
              {prod.cuts.length} cuts · both 16:9
            </span>
            <span className="rounded-full border border-ink/15 px-3 py-1 text-xs">
              {prod.grounding.sources.length} grounded sources
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* left: video + script */}
            <div className="lg:col-span-7">
              <div className="mb-3 flex gap-2">
                {prod.cuts.map((c, i) => (
                  <button
                    key={c.platform}
                    onClick={() => setActiveCut(i)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      i === activeCut ? "bg-ink text-bone" : "border border-ink/15 text-ink hover:border-ink"
                    }`}
                  >
                    {c.platform === "youtube" ? "▶ YouTube — long-form" : "✦ LinkedIn — short"}
                  </button>
                ))}
              </div>

              <VideoPlayer cut={cut} />

              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => download(`${cut.platform}-script.txt`, toScript(cut))} className="btn-ghost text-xs">
                  ⬇ Script (.txt)
                </button>
                <button onClick={() => download(`${cut.platform}-captions.srt`, toSRT(cut))} className="btn-ghost text-xs">
                  ⬇ Captions (.srt)
                </button>
                <button onClick={() => download(`${cut.platform}-postcopy.txt`, cut.postCopy)} className="btn-ghost text-xs">
                  ⬇ Post copy
                </button>
                <button
                  onClick={() => navigator.clipboard?.writeText(cut.postCopy)}
                  className="btn-ghost text-xs"
                >
                  ⧉ Copy caption
                </button>
                <button
                  onClick={() =>
                    download(`${prod.topic.replace(/\s+/g, "-")}-production.json`, JSON.stringify(prod, null, 2), "application/json")
                  }
                  className="btn-ghost text-xs"
                >
                  ⬇ Full production (.json)
                </button>
              </div>

              {/* storyboard / script */}
              <div className="card mt-4">
                <div className="text-sm font-semibold">{cut.title}</div>
                <div className="mt-0.5 text-xs text-slate2">{cut.label} · ~{cut.targetSeconds}s · {cut.scenes.length} scenes</div>
                <ol className="mt-4 space-y-3">
                  {cut.scenes.map((s) => (
                    <li key={s.id} className="border-l-2 border-accent/30 pl-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-slate2">{String(s.id).padStart(2, "0")}</span>
                        <span className="rounded bg-bone px-1.5 py-0.5 font-semibold">{s.role}</span>
                        <span className="text-slate2">{s.seconds}s · {s.motif}</span>
                      </div>
                      <div className="mt-1 font-display text-lg">&ldquo;{s.onScreen}&rdquo;</div>
                      <div className="mt-0.5 text-sm text-ink/80">{s.voiceover}</div>
                      <div className="mt-0.5 text-xs italic text-slate2">visual: {s.visual}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* right: grounding, fact-check, packaging */}
            <div className="space-y-6 lg:col-span-5">
              <div className="card">
                <div className="text-xs uppercase tracking-widest text-slate2">The angle</div>
                <p className="mt-2 text-sm">{prod.thesis}</p>
                <div className="mt-3 text-xs text-slate2"><b>Audience:</b> {prod.audience}</div>
              </div>

              {/* fact-check */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-widest text-slate2">Fact-check</div>
                  <div className="text-sm font-semibold">{prod.factCheck.score}/100</div>
                </div>
                <p className="mt-2 text-sm text-ink/80">{prod.factCheck.summary}</p>
                <ul className="mt-3 space-y-2">
                  {prod.factCheck.items.slice(0, 8).map((it, i) => (
                    <li key={i} className="rounded-xl border border-ink/10 bg-bone p-3 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-ink/85">&ldquo;{it.claim}&rdquo;</span>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${VERDICT[it.verdict].cls}`}>
                          {VERDICT[it.verdict].label}
                        </span>
                      </div>
                      <div className="mt-1 text-slate2">{it.evidence}</div>
                      {it.correction && <div className="mt-1 text-blue-700">→ {it.correction}</div>}
                      {it.citations.length > 0 && (
                        <div className="mt-1 font-mono text-[10px] text-accent">{it.citations.join(", ")}</div>
                      )}
                    </li>
                  ))}
                  {prod.factCheck.items.length > 8 && (
                    <li className="text-xs text-slate2">+ {prod.factCheck.items.length - 8} more reviewed</li>
                  )}
                  {prod.factCheck.items.length === 0 && (
                    <li className="text-xs text-slate2">No hard factual claims asserted — nothing to mis-state.</li>
                  )}
                </ul>
              </div>

              {/* grounding / RAG */}
              <div className="card">
                <div className="text-xs uppercase tracking-widest text-slate2">Grounding · RAG</div>
                <p className="mt-2 text-sm text-ink/80">{prod.grounding.brief}</p>
                {prod.grounding.sources.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-xs">
                    {prod.grounding.sources.map((s) => (
                      <li key={s.id} className="flex gap-2">
                        <span className="font-mono text-accent">{s.id}</span>
                        <span>
                          {s.url ? (
                            <a href={s.url} target="_blank" rel="noreferrer" className="underline hover:text-accent">
                              {s.title}
                            </a>
                          ) : (
                            s.title
                          )}
                          <span className="text-slate2"> — {s.source}</span>
                          {s.kind === "corpus" && <span className="ml-1 rounded bg-bone px-1 text-[10px] text-slate2">corpus</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* thumbnail */}
              <div className="card">
                <div className="text-xs uppercase tracking-widest text-slate2">Thumbnail concept</div>
                <div className="mt-3 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#141034] to-[#06060F] p-4 text-center">
                  <div>
                    <div className="font-display text-2xl font-black text-[#E8FF5B]">{prod.thumbnail.headline}</div>
                    <div className="mt-1 text-sm text-[#EDEBFF]">{prod.thumbnail.subtext}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate2">{prod.thumbnail.art}</div>
              </div>

              {/* tags */}
              <div className="card">
                <div className="text-xs uppercase tracking-widest text-slate2">Tags &amp; hashtags</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[...cut.tags, ...cut.hashtags].map((tg) => (
                    <span key={tg} className="rounded-full bg-bone px-2 py-0.5 text-xs text-slate2">{tg}</span>
                  ))}
                </div>
              </div>

              {/* checklist */}
              <div className="card">
                <div className="text-xs uppercase tracking-widest text-slate2">Publish checklist</div>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {prod.publishChecklist.map((c, i) => (
                    <li key={i} className="flex gap-2 text-ink/80">
                      <span className="text-sage">✓</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
