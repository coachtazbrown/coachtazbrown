"use client";

import { useState } from "react";
import type { ListingDraft } from "@/lib/sage-data";
import type { SageRewrite } from "@/lib/sage-agent";

type RewriteState = { loading: boolean; rewrite?: SageRewrite; error?: string };

export default function SageListingDiff({ listings }: { listings: ListingDraft[] }) {
  const [state, setState] = useState<Record<string, RewriteState>>({});
  const [bulk, setBulk] = useState(false);

  async function run(handle: string) {
    setState((s) => ({ ...s, [handle]: { loading: true } }));
    try {
      const res = await fetch("/api/sage/rewrite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ handle })
      });
      const data = await res.json();
      if (data.rewrite) {
        setState((s) => ({ ...s, [handle]: { loading: false, rewrite: data.rewrite } }));
      } else {
        setState((s) => ({ ...s, [handle]: { loading: false, error: "No rewrite returned." } }));
      }
    } catch {
      setState((s) => ({ ...s, [handle]: { loading: false, error: "Network error." } }));
    }
  }

  async function bulkRun() {
    setBulk(true);
    for (const l of listings) {
      if (!state[l.handle]?.rewrite) await run(l.handle);
    }
    setBulk(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate2">{listings.length} listings need work</div>
        <button
          onClick={bulkRun}
          disabled={bulk}
          className="rounded-full bg-ink px-4 py-2 text-xs text-bone hover:bg-accent disabled:opacity-40"
        >
          {bulk ? "Rewriting all…" : "Bulk rewrite all"}
        </button>
      </div>

      {listings.map((l) => {
        const s = state[l.handle];
        return (
          <article key={l.handle} className="rounded-2xl border border-ink/10 bg-white p-5">
            <header className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-mono text-xs text-slate2">/products/{l.handle}</div>
                <div className="mt-0.5 text-xs text-slate2">
                  {l.category} · {l.tags.join(", ")}
                </div>
              </div>
              <button
                onClick={() => run(l.handle)}
                disabled={s?.loading}
                className="rounded-full border border-ink/20 px-3 py-1.5 text-xs hover:border-ink disabled:opacity-40"
              >
                {s?.loading ? "Rewriting…" : s?.rewrite ? "Re-run" : "Rewrite with Sage"}
              </button>
            </header>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-ink/10 bg-bone p-4">
                <div className="text-[11px] uppercase tracking-widest text-slate2">Before</div>
                <div className="mt-2 font-display text-lg">{l.before.title}</div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-ink/80">
                  {l.before.description}
                </p>
                <div className="mt-3 grid gap-1 text-xs text-slate2">
                  <div>alt: <span className="text-red-700">missing</span></div>
                  <div>meta: <span className="text-red-700">missing</span></div>
                  <div>schema: <span className="text-red-700">missing</span></div>
                </div>
              </div>

              <div
                className={`rounded-xl border p-4 ${
                  s?.rewrite ? "border-accent/40 bg-accent/5" : "border-ink/10 bg-white"
                }`}
              >
                <div className="text-[11px] uppercase tracking-widest text-slate2">After</div>
                {!s?.rewrite && !s?.loading && (
                  <p className="mt-2 text-sm text-slate2">Click "Rewrite with Sage" to see the diff.</p>
                )}
                {s?.loading && <p className="mt-2 text-sm text-slate2">Drafting…</p>}
                {s?.rewrite && (
                  <>
                    <div className="mt-2 font-display text-lg">{s.rewrite.title}</div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-ink/85">
                      {s.rewrite.description}
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-slate2">
                      <div>
                        <span className="text-ink/60">alt:</span> {s.rewrite.altText}
                      </div>
                      <div>
                        <span className="text-ink/60">meta:</span> {s.rewrite.seoMetaDescription}
                        <span className="ml-1 font-mono text-[10px]">
                          ({s.rewrite.seoMetaDescription.length}c)
                        </span>
                      </div>
                      <details>
                        <summary className="cursor-pointer text-ink/60">schema JSON-LD</summary>
                        <pre className="mt-1 overflow-x-auto rounded bg-ink/90 p-2 text-[10px] text-bone">
                          {s.rewrite.jsonLdSchema}
                        </pre>
                      </details>
                    </div>
                    <p className="mt-3 rounded bg-white px-2 py-1 text-[11px] text-slate2">
                      Sage: {s.rewrite.notes}
                    </p>
                  </>
                )}
                {s?.error && <p className="mt-2 text-xs text-red-600">{s.error}</p>}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
