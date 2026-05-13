"use client";

import { useEffect, useRef, useState } from "react";
import { MAYA_DEFAULT_CONFIG } from "@/lib/maya-config";

type Msg = { role: "user" | "assistant"; content: string };

export default function MayaChat({ embedded = false }: { embedded?: boolean }) {
  const [open, setOpen] = useState(embedded);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: MAYA_DEFAULT_CONFIG.greeting }
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
      const res = await fetch("/api/chat/maya", {
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
        {
          role: "assistant",
          content: "Sorry — I lost connection for a second. Try that again?"
        }
      ]);
    } finally {
      setPending(false);
    }
  }

  const Bubble = (
    <div
      className={`flex w-full flex-col rounded-3xl border border-ink/10 bg-white shadow-sm ${
        embedded ? "h-[640px]" : "h-[560px] max-w-sm"
      }`}
    >
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-ink text-bone">M</div>
          <div>
            <div className="font-semibold">Maya</div>
            <div className="text-xs text-slate2">Marlow & Hart — online</div>
          </div>
        </div>
        {!embedded && (
          <button onClick={() => setOpen(false)} className="text-slate2 hover:text-ink">
            ✕
          </button>
        )}
      </div>

      <div ref={scrollerRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 ${
              m.role === "user"
                ? "ml-auto bg-ink text-bone"
                : "bg-bone text-ink/85"
            }`}
          >
            {m.content}
          </div>
        ))}
        {pending && (
          <div className="max-w-[85%] rounded-2xl bg-bone px-3 py-2 text-ink/60">
            <span className="inline-block animate-pulse">Maya is typing…</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-ink/10 px-3 py-2">
        {MAYA_DEFAULT_CONFIG.suggestedReplies.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={pending}
            className="rounded-full border border-ink/15 bg-bone px-2.5 py-1 text-[11px] text-slate2 hover:border-ink hover:text-ink disabled:opacity-40"
          >
            {s}
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
          placeholder="Ask about a piece, an order, or a policy…"
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

      {embedded && toolLog.length > 0 && (
        <div className="border-t border-ink/10 bg-bone px-4 py-2 text-[11px] text-slate2">
          <div className="mb-1 font-mono uppercase">tool calls</div>
          <div className="space-y-1 font-mono">
            {toolLog.slice(-4).map((t, i) => (
              <div key={i} className="truncate">
                ▸ {t.name}(
                {JSON.stringify(t.input).slice(0, 80)}
                {JSON.stringify(t.input).length > 80 ? "…" : ""})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) return Bubble;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open ? (
        Bubble
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-bone shadow-lg hover:bg-accent"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-accent2 text-ink">M</span>
          Chat with Maya
        </button>
      )}
    </div>
  );
}
