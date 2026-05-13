"use client";

import { useState } from "react";
import type { Review } from "@/lib/echo-data";
import type { EchoDraft } from "@/lib/echo-agent";

type DraftState = { loading: boolean; draft?: EchoDraft; error?: string };

const URGENCY_STYLE: Record<EchoDraft["urgency"], string> = {
  low: "bg-sage/15 text-sage",
  normal: "bg-bone text-slate2",
  high: "bg-red-100 text-red-700"
};

const ACTION_LABEL: Record<EchoDraft["suggestedAction"], string> = {
  post_reply: "Safe to post",
  operator_review: "Needs your review",
  escalate_to_human: "Escalate — do not post"
};

const ACTION_STYLE: Record<EchoDraft["suggestedAction"], string> = {
  post_reply: "bg-accent/10 text-accent",
  operator_review: "bg-accent2/40 text-ink",
  escalate_to_human: "bg-red-100 text-red-700"
};

function Stars({ n }: { n: number }) {
  return (
    <span className="text-sm" aria-label={`${n} of 5 stars`}>
      {"★".repeat(n)}
      <span className="text-ink/20">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default function EchoReviewList({ reviews }: { reviews: Review[] }) {
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({});
  const [bulkRunning, setBulkRunning] = useState(false);

  async function draft(id: string) {
    setDrafts((d) => ({ ...d, [id]: { loading: true } }));
    try {
      const res = await fetch("/api/echo/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reviewId: id })
      });
      const data = await res.json();
      if (data.draft) {
        setDrafts((d) => ({ ...d, [id]: { loading: false, draft: data.draft } }));
      } else {
        setDrafts((d) => ({ ...d, [id]: { loading: false, error: "Couldn't draft." } }));
      }
    } catch {
      setDrafts((d) => ({ ...d, [id]: { loading: false, error: "Network error." } }));
    }
  }

  async function bulkDraft() {
    setBulkRunning(true);
    for (const r of reviews) {
      if (!drafts[r.id]?.draft) await draft(r.id);
    }
    setBulkRunning(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate2">{reviews.length} unhandled reviews</div>
        <button
          onClick={bulkDraft}
          disabled={bulkRunning}
          className="rounded-full bg-ink px-4 py-2 text-xs text-bone hover:bg-accent disabled:opacity-40"
        >
          {bulkRunning ? "Drafting all…" : "Bulk draft all"}
        </button>
      </div>

      {reviews.map((r) => {
        const state = drafts[r.id];
        return (
          <article key={r.id} className="rounded-2xl border border-ink/10 bg-white p-5">
            <header className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Stars n={r.stars} />
                  <span className="text-sm font-semibold">{r.customer}</span>
                  <span className="text-xs text-slate2">· {r.channel} · {r.postedAt}</span>
                </div>
                <div className="mt-0.5 text-xs text-slate2">on {r.product}</div>
              </div>
              <div className="flex gap-1">
                {r.flags.map((f) => (
                  <span
                    key={f}
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      f === "urgent" || f === "defective"
                        ? "bg-red-100 text-red-700"
                        : "bg-bone text-slate2"
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </header>

            <h3 className="mt-3 font-display text-lg">"{r.title}"</h3>
            <p className="mt-1 text-sm text-ink/80">{r.body}</p>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => draft(r.id)}
                disabled={state?.loading}
                className="rounded-full border border-ink/20 px-3 py-1.5 text-xs hover:border-ink disabled:opacity-40"
              >
                {state?.loading
                  ? "Drafting…"
                  : state?.draft
                    ? "Re-draft"
                    : "Draft a reply"}
              </button>
              {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
            </div>

            {state?.draft && (
              <div className="mt-4 space-y-3 rounded-xl bg-bone p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${ACTION_STYLE[state.draft.suggestedAction]}`}>
                    {ACTION_LABEL[state.draft.suggestedAction]}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${URGENCY_STYLE[state.draft.urgency]}`}>
                    urgency: {state.draft.urgency}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-slate2">
                    sentiment: {state.draft.sentiment}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-ink">{state.draft.reply}</p>
                <p className="text-xs text-slate2">Why: {state.draft.reasoning}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
