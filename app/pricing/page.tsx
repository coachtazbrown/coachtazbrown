import Link from "next/link";

export const metadata = { title: "Pricing — Retail Agent Co." };

const TIERS = [
  {
    name: "Foundation",
    price: 1500,
    setup: 2500,
    blurb: "Any 2 agents. One storefront. The wedge.",
    cta: "Start with Maya + Echo",
    features: [
      "Any 2 agents from the catalog",
      "1 Shopify / Square / Lightspeed storefront",
      "Monthly performance report",
      "Slack handoff channel",
      "Cancel any time"
    ],
    note: "Replaces ~$3–4K/mo of tools + part-time roles.",
    popular: false,
    badge: null
  },
  {
    name: "Growth",
    price: 3500,
    setup: 5000,
    blurb: "Any 5 agents. Up to 3 storefronts. The standard.",
    cta: "Book a Growth call",
    features: [
      "Any 5 agents from the catalog",
      "Up to 3 storefronts",
      "Monthly tuning call with a strategist",
      "Custom brand voice locked from your style guide",
      "Quarterly business review",
      "30-day ROI guarantee"
    ],
    note: "Replaces ~$8–12K/mo of tools, agencies, and headcount.",
    popular: true,
    badge: "Most retailers"
  },
  {
    name: "Command",
    price: 8500,
    setup: 10000,
    blurb: "All 8 agents. Unlimited storefronts. Shared Slack.",
    cta: "Book a Command demo",
    features: [
      "All 8 agents — unlimited use",
      "Unlimited storefronts under one brand",
      "Dedicated strategist + shared Slack channel",
      "Custom workflows + private cross-store benchmarks",
      "Bi-weekly tuning, quarterly QBR",
      "Priority integration requests"
    ],
    note: "Replaces ~$18–25K/mo across vendors and headcount.",
    popular: false,
    badge: null
  }
];

const ENTERPRISE = {
  range: "$15,000–$25,000",
  features: [
    "Multi-location independents, regional chains, franchise networks",
    "Dedicated pod: strategist + ML engineer + CSM",
    "5% performance kicker on incremental revenue attributed to Nova + Maya, measured against a 30-day pre-launch baseline",
    "White-glove implementation, on-site training, named contacts",
    "99.9% SLA, dedicated infra, custom data residency",
    "SOC 2 evidence package and BAA on request"
  ]
};

function dollars(n: number) {
  return n.toLocaleString("en-US");
}

export default function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-slate2">Pricing</div>
      <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
        Priced like a team. Performs like one.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate2">
        Each tier replaces real headcount and vendor spend on your P&L. Month-to-month. Setup
        waived on annual prepay. ROI guaranteed in 30 days or your money back.
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
            <div className="mt-3 font-display text-5xl">
              ${dollars(t.price)}
              <span className={`text-base ${t.popular ? "text-bone/60" : "text-slate2"}`}>/mo</span>
            </div>
            <div className={`mt-1 text-xs ${t.popular ? "text-bone/60" : "text-slate2"}`}>
              + ${dollars(t.setup)} setup (waived on annual)
            </div>
            <p className={`mt-3 text-sm ${t.popular ? "text-bone/80" : "text-ink/80"}`}>{t.blurb}</p>
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
              {t.note}
            </div>
            <Link
              href="/demo"
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
            <div className="text-xs uppercase tracking-widest text-slate2">Enterprise</div>
            <div className="mt-1 font-display text-3xl">
              {ENTERPRISE.range}
              <span className="text-base text-slate2">/mo · annual</span>
            </div>
            <div className="mt-1 text-sm text-slate2">
              + 5% of incremental revenue attributed to Nova + Maya
            </div>
          </div>
          <Link href="/demo" className="btn-primary">
            Talk to founders →
          </Link>
        </div>
        <ul className="mt-6 grid gap-2 text-sm md:grid-cols-2">
          {ENTERPRISE.features.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-accent">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-ink/10 bg-white p-8">
          <div className="font-display text-2xl">Why we charge like a firm, not a tool</div>
          <p className="mt-3 text-slate2">
            Each agent replaces a real line item — a media buyer, a copywriter, an inventory
            analyst, a support rep. The math we underwrite isn't "is this cheaper than a SaaS
            tool" — it's "is this cheaper than the salary, the freelancer, or the agency I'd
            otherwise hire." Across our book, the answer is 3–5× cheaper for the same output.
          </p>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-white p-8">
          <div className="font-display text-2xl">The 30-day ROI guarantee</div>
          <p className="mt-3 text-slate2">
            Before we turn an agent on, we baseline the metric it owns (conversion, CAC,
            stockouts, ticket volume). If 30 days in it hasn't moved the needle in your favor we
            refund the month and help you offboard. We've refunded twice in two years.
          </p>
        </div>
      </div>
    </div>
  );
}
