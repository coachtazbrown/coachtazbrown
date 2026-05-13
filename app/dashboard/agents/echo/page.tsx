import Link from "next/link";
import { REVIEWS, sentimentBreakdown, flaggedReviews } from "@/lib/echo-data";
import EchoReviewList from "@/components/EchoReviewList";

export const metadata = { title: "Echo — reviews inbox" };

export default function EchoPage() {
  const sentiment = sentimentBreakdown();
  const flagged = flaggedReviews();
  const total = REVIEWS.length;
  const avg = REVIEWS.reduce((s, r) => s + r.stars, 0) / total;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate2">
        <Link href="/dashboard" className="hover:text-ink">
          Dashboard
        </Link>
        <span>/</span>
        <span>Echo — Reviews & Reputation</span>
      </div>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Echo — reviews inbox</h1>
      <p className="mt-2 max-w-2xl text-slate2">
        Echo drafts on-brand replies, scores sentiment, and flags reviews that need a human. Click
        "Draft a reply" on any review — Echo posts safe 5-star replies on its own, sends
        anything else for your review, and refuses to post on flagged reviews.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Average stars" value={avg.toFixed(2)} sub={`${total} reviews loaded`} />
        <Stat label="5★ ready to post" value={`${sentiment[5]}`} sub="auto-postable" />
        <Stat label="Needs your review" value={`${sentiment[4] + sentiment[3]}`} sub="3–4★" />
        <Stat
          label="Escalate"
          value={`${flagged.length}`}
          sub="urgent / defective / 1–2★"
          alert
        />
      </div>

      <div className="mt-10">
        <EchoReviewList reviews={REVIEWS} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  alert = false
}: {
  label: string;
  value: string;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        alert ? "border-red-200 bg-red-50" : "border-ink/10 bg-white"
      }`}
    >
      <div className="text-xs uppercase tracking-widest text-slate2">{label}</div>
      <div className="mt-2 font-display text-3xl">{value}</div>
      <div className="mt-1 text-xs text-slate2">{sub}</div>
    </div>
  );
}
