import Link from "next/link";

export const metadata = { title: "Pricing — Retail Agent Co." };

const TIERS = [
  {
    name: "Starter",
    price: 497,
    blurb: "Pick any 2 agents. Self-serve config.",
    cta: "Start with Maya",
    features: [
      "Any 2 agents from the catalog",
      "1 Shopify store connection",
      "Email support, 24h response",
      "Slack handoff channel",
      "Cancel anytime"
    ],
    popular: false
  },
  {
    name: "Growth",
    price: 997,
    blurb: "5 agents. Monthly 30-min tuning call.",
    cta: "Book Growth call",
    features: [
      "Any 5 agents",
      "Up to 3 Shopify / Square / Lightspeed stores",
      "Monthly tuning + ROI report",
      "Custom brand voice locked from your style guide",
      "30-day ROI guarantee"
    ],
    popular: true
  },
  {
    name: "Scale",
    price: 2497,
    blurb: "All 8 agents. Shared Slack channel.",
    cta: "Book Scale demo",
    features: [
      "All 8 agents",
      "Unlimited storefronts under one brand",
      "Shared Slack channel with our team",
      "Custom workflows + private benchmarks",
      "Quarterly business review"
    ],
    popular: false
  }
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-slate2">Pricing</div>
      <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
        Less than the part-time clerk you can't find.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate2">
        Month-to-month. $2,500 setup waived on annual. Cancel from your dashboard.
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
              {t.popular && (
                <div className="rounded-full bg-accent2 px-2 py-0.5 text-[11px] text-ink">
                  Most retailers
                </div>
              )}
            </div>
            <div className="mt-3 font-display text-5xl">
              ${t.price}
              <span className={`text-base ${t.popular ? "text-bone/60" : "text-slate2"}`}>/mo</span>
            </div>
            <p className={`mt-2 text-sm ${t.popular ? "text-bone/70" : "text-slate2"}`}>{t.blurb}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className={t.popular ? "text-accent2" : "text-accent"}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/demo"
              className={`mt-8 ${
                t.popular ? "btn bg-accent2 text-ink hover:bg-bone" : "btn-primary"
              }`}
            >
              {t.cta} →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-ink/10 bg-white p-8">
        <div className="font-display text-2xl">The 30-day ROI guarantee, in plain English</div>
        <p className="mt-3 max-w-3xl text-slate2">
          Before we turn on an agent we baseline the metric it owns (conversion, CAC, stockouts,
          ticket volume). If 30 days in the agent hasn't moved the needle in your favor, we refund
          the month and help you offboard. We've refunded twice in two years.
        </p>
      </div>
    </div>
  );
}
