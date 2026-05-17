"use client";

import { useEffect, useRef, useState } from "react";
import { REDTEAM_DEFAULT_CONFIG } from "@/lib/redteam-config";

type Msg = { role: "user" | "assistant"; content: string };

// Minimal markdown: **bold** only — the agent uses it for technique names.
function render(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith("**") && chunk.endsWith("**") ? (
      <strong key={i}>{chunk.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
}

export default function RedTeamChat() {
  const cfg = REDTEAM_DEFAULT_CONFIG;
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: cfg.greeting }
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [toolLog, setToolLog] = useState<{ name: string; input: unknown }[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    const next = [...messages, { role: "user", content: trimmed } as Msg];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/chat/redteam", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      if (Array.isArray(data.toolCalls) && data.toolCalls.length) {
        setToolLog((t) => [...t, ...data.toolCalls]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Lost connection for a second — try that again, Taz." }
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex h-[680px] w-full flex-col rounded-3xl border border-ink/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-ink text-bone">R</div>
          <div>
            <div className="font-semibold">{cfg.partnerName}</div>
            <div className="text-xs text-slate2">{cfg.practice} — your AI partner</div>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-sage">Live</div>
      </div>

      <div ref={scrollerRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 leading-relaxed ${
              m.role === "user" ? "ml-auto bg-ink text-bone" : "bg-bone text-ink/85"
            }`}
          >
            {m.role === "assistant" ? render(m.content) : m.content}
          </div>
        ))}
        {pending && (
          <div className="max-w-[88%] rounded-2xl bg-bone px-3 py-2 text-ink/60">
            <span className="inline-block animate-pulse">Thinking through the room…</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-ink/10 px-3 py-2">
        {cfg.suggestedPrompts.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            disabled={pending}
            className="rounded-full border border-ink/15 bg-bone px-2.5 py-1 text-[11px] text-slate2 hover:border-ink hover:text-ink disabled:opacity-40"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-ink/10 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="The client, the decision, the room…"
          className="flex-1 rounded-full border border-ink/15 bg-bone px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="rounded-full bg-ink px-4 py-2 text-sm text-bone disabled:opacity-40"
        >
          Send
        </button>
      </form>

      {toolLog.length > 0 && (
        <div className="border-t border-ink/10 bg-bone px-4 py-2 text-[11px] text-slate2">
          <div className="mb-1 font-mono uppercase">technique calls</div>
          <div className="space-y-1 font-mono">
            {toolLog.slice(-4).map((t, i) => (
              <div key={i} className="truncate">
                ▸ {t.name}({JSON.stringify(t.input).slice(0, 70)}
                {JSON.stringify(t.input).length > 70 ? "…" : ""})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
