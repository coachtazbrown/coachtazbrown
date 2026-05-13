"use client";

import { useState } from "react";
import type { Ticket } from "@/lib/pip-data";
import type { PipTriage } from "@/lib/pip-agent";

type TriageState = { loading: boolean; triage?: PipTriage; error?: string };

const ACTION_STYLE: Record<PipTriage["action"], string> = {
  auto_resolve: "bg-sage/15 text-sage",
  draft_reply: "bg-accent2/40 text-ink",
  escalate_to_human: "bg-red-100 text-red-700"
};

const ACTION_LABEL: Record<PipTriage["action"], string> = {
  auto_resolve: "Auto-resolved",
  draft_reply: "Drafted — needs approval",
  escalate_to_human: "Escalated to human"
};

const URGENCY_STYLE: Record<PipTriage["urgency"], string> = {
  low: "text-slate2",
  normal: "text-ink",
  high: "text-red-700 font-semibold"
};

export default function PipTicketInbox({ tickets }: { tickets: Ticket[] }) {
  const [state, setState] = useState<Record<string, TriageState>>({});
  const [bulk, setBulk] = useState(false);

  async function run(id: string) {
    setState((s) => ({ ...s, [id]: { loading: true } }));
    try {
      const res = await fetch("/api/pip/triage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ticketId: id })
      });
      const data = await res.json();
      if (data.triage) {
        setState((s) => ({ ...s, [id]: { loading: false, triage: data.triage } }));
      } else {
        setState((s) => ({ ...s, [id]: { loading: false, error: "Couldn't triage." } }));
      }
    } catch {
      setState((s) => ({ ...s, [id]: { loading: false, error: "Network error." } }));
    }
  }

  async function bulkRun() {
    setBulk(true);
    for (const t of tickets) {
      if (!state[t.id]?.triage) await run(t.id);
    }
    setBulk(false);
  }

  const triagedCount = Object.values(state).filter((s) => s.triage).length;
  const autoresolved = Object.values(state).filter((s) => s.triage?.action === "auto_resolve").length;
  const oneTouch = triagedCount > 0 ? Math.round((autoresolved / triagedCount) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-slate2">
          {tickets.length} tickets in queue ·{" "}
          {triagedCount > 0
            ? `${autoresolved}/${triagedCount} auto-resolved (${oneTouch}% one-touch)`
            : "Not triaged yet"}
        </div>
        <button
          onClick={bulkRun}
          disabled={bulk}
          className="rounded-full bg-ink px-4 py-2 text-xs text-bone hover:bg-accent disabled:opacity-40"
        >
          {bulk ? "Triaging…" : "Triage all"}
        </button>
      </div>

      {tickets.map((t) => {
        const s = state[t.id];
        return (
          <article key={t.id} className="rounded-2xl border border-ink/10 bg-white p-5">
            <header className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{t.subject}</div>
                <div className="text-xs text-slate2">
                  {t.customerName} · {t.customerEmail} · {t.channel} · {t.receivedAt}
                  {t.orderNumber && ` · order #${t.orderNumber}`}
                </div>
              </div>
              <button
                onClick={() => run(t.id)}
                disabled={s?.loading}
                className="rounded-full border border-ink/20 px-3 py-1.5 text-xs hover:border-ink disabled:opacity-40"
              >
                {s?.loading ? "Triaging…" : s?.triage ? "Re-triage" : "Triage with Pip"}
              </button>
            </header>

            <p className="mt-3 whitespace-pre-wrap text-sm text-ink/85">{t.body}</p>

            {s?.triage && (
              <div className="mt-4 space-y-3 rounded-xl bg-bone p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${ACTION_STYLE[s.triage.action]}`}
                  >
                    {ACTION_LABEL[s.triage.action]}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-slate2">
                    category: {s.triage.category}
                  </span>
                  <span className={`text-[11px] ${URGENCY_STYLE[s.triage.urgency]}`}>
                    urgency: {s.triage.urgency}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-slate2">
                    confidence: {(s.triage.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-ink">{s.triage.draftReply}</p>
                <p className="text-xs text-slate2">Why: {s.triage.reasoning}</p>
              </div>
            )}
            {s?.error && <p className="mt-2 text-xs text-red-600">{s.error}</p>}
          </article>
        );
      })}
    </div>
  );
}
