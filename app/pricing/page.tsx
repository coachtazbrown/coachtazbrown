import Link from "next/link";
import { VALUE_LADDER } from "@/lib/redteam-knowledge";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  titleAbsolute: "Engagements — Taz Brown Strategies",
  path: "/pricing",
  description:
    "Engagement tiers for Taz Brown Strategies: from a single facilitated Key Assumptions Check or premortem on a live decision, up to ongoing red-teaming retainers."
});

const TIERS = [
  {
    name: "Land",
    price: "$4,500",
    cadence: "one-off",
    blurb: "90-minute Key Assumptions Check or live Premortem on one real, live decision.",
    cta: "Bring a decision",
    features: [
      "One facilitated session on a live, irreversible bet",
      "The assumption table or premortem action list — owned, dated",
      "30-day debrief of the action owners",
      "A finding the client can't unsee"
    ],
    note: "The paid trial. It almost always exposes work worth a retainer.",
    popular: false,
    badge: null,
    converts: VALUE_LADDER[0].converts
  },
  {
    name: "Diagnose",
    price: "$4,000",
    cadence: "/mo · 3-month",
    blurb: "Decision-quality audit: Groupthink scorecard + assumption table on the last three big bets.",
    cta: "Scope the audit",
    features: [
      "Janis groupthink symptom scorecard",
      "Assumption autopsy of three recent decisions",
      "Structural fixes installed, then re-measured",
      "Artifacts leadership circulates internally"
    ],
    note: "Reframes a one-off win as a systemic gap worth fixing on a cadence.",
    popular: true,
    badge: "Where most clients land",
    converts: VALUE_LADDER[1].converts
  },
  {
    name: "Cadence",
    price: "$6,500–9,000",
    cadence: "/mo · retained",
    blurb: "Quarterly war-game or Team B on each roadmap milestone, facilitated by Taz Brown Strategies.",
    cta: "Talk cadence",
    features: [
      "War-game / Team B tied to the client's planning rhythm",
      "Red cell facilitation — you stay the White referee",
      "Decision-quality tracked separately from outcomes",
      "You become part of how they decide"
    ],
    note: "Recurring revenue anchored to the client's own roadmap.",
    popular: false,
    badge: null,
    converts: VALUE_LADDER[2].converts
  }
];

const PARTNER = {
  range: "$14,000–$22,000",
  features: [
    "Stand up the client's internal red cell — charter, training, air cover",
    "Taz as the standing external partner and the leader's coach",
    "Irreversible decisions gated behind a mandatory red-team pass",
    "Re-charter every two quarters so the cell can't ossify",
    "Multi-year, highest-margin, referral-generating",
    "Client wins become case studies and the next logos"
  ]
};

export default function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-slate2">Engagements</div>
      <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
        Priced like a partner. Compounds like one.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate2">
        Four rungs. Each one is engineered so the client asks for the next — we grow on wins,
        not sales pressure. Start at Land; most relationships are renewing within two quarters.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`flex flex-col rounded-3xl border p-7 ${
              t.popular ? "border-ink bg-ink text-bone" : "border-ink/10 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`text-sm ${t.popular ? "text-bone/70" : "text-slate2"}`}>
                {t.name}
              </div>
              {t.badge && (
                <div className="rounded-full bg-accent2 px-2 py-0.5 text-[11px] text-ink">
                  {t.badge}
                </div>
              )}
            </div>
            <div className="mt-3 font-display text-4xl">
              {t.price}
              <span className={`ml-1 text-base ${t.popular ? "text-bone/60" : "text-slate2"}`}>
                {t.cadence}
              </span>
            </div>
            <p className={`mt-3 text-sm ${t.popular ? "text-bone/80" : "text-ink/80"}`}>
              {t.blurb}
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className={t.popular ? "text-accent2" : "text-accent"}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div
              className={`mt-5 rounded-xl px-3 py-2 text-xs ${
                t.popular ? "bg-bone/10 text-bone/80" : "bg-bone text-slate2"
              }`}
            >
              {t.note} <span className="text-accent">{t.converts}</span>
            </div>
            <Link
              href="/workspace"
              className={`mt-6 ${
                t.popular ? "btn bg-accent2 text-ink hover:bg-bone" : "btn-primary"
              }`}
            >
              {t.cta} →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-ink/10 bg-bone p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate2">
              Install &amp; Partner
            </div>
            <div className="mt-1 font-display text-3xl">
              {PARTNER.range}
              <span className="text-base text-slate2">/mo · multi-year</span>
            </div>
            <div className="mt-1 text-sm text-slate2">
              The top rung — we install and run your red-teaming capability
            </div>
          </div>
          <Link href="/workspace" className="btn-primary">
            Talk to Taz →
          </Link>
        </div>
        <ul className="mt-6 grid gap-2 text-sm md:grid-cols-2">
          {PARTNER.features.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-accent">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-ink/10 bg-white p-8">
          <div className="font-display text-2xl">Why we don&apos;t oversell ceremony</div>
          <p className="mt-3 text-slate2">
            If a 90-minute assumptions check solves it, we say so — even though a war-game bills
            more. Credibility compounds into more clients than any single invoice. The cheapest
            move that works is always the one we recommend first.
          </p>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-white p-8">
          <div className="font-display text-2xl">A finding with no owner was theatre</div>
          <p className="mt-3 text-slate2">
            Every engagement ends with the dangerous items converted into owned actions with
            dates — and a debrief on the calendar. We measure decision quality, not luck. That
            debrief is also, by design, the bridge to the next rung.
          </p>
        </div>
      </div>
    </div>
  );
}
