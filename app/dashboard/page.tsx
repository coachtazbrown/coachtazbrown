import Link from "next/link";
import { TENANTS, totalARR, totalAttributedRevenue30d, GROWTH_TIER_ACV } from "@/lib/tenants";

export const metadata = { title: "Operator dashboard — Retail Agent Co." };

function dollars(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function Dashboard() {
  const arr = totalARR();
  const goal = 1_000_000;
  const pct = Math.min(100, Math.round((arr / goal) * 100));
  const attributed = totalAttributedRevenue30d();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate2">Operator dashboard</div>
          <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
            Retail Agent Co. — book of business
          </h1>
        </div>
        <Link href="/dashboard/agents/maya" className="btn-primary">
          Open Maya →
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Tenants" value={TENANTS.length.toString()} sub="active stores" />
        <Stat label="ARR" value={dollars(arr)} sub={`${pct}% of $1M goal`} accent />
        <Stat label="Revenue attributed (30d)" value={dollars(attributed)} sub="across all agents" />
        <Stat
          label="Net new logos (90d)"
          value="4"
          sub="2 from referral, 2 from Shopify App Store"
        />
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
          aria-label={`Progress toward $1M ARR: ${pct}%`}
        />
      </div>
      <div className="mt-1 text-xs text-slate2">
        $1M ARR goal — need {Math.max(0, Math.ceil((goal - arr) / GROWTH_TIER_ACV))} more
        Growth-tier customers at ${(GROWTH_TIER_ACV / 1000).toFixed(0)}K/yr ACV.
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl">Agent workspaces</h2>
        <p className="mt-1 text-sm text-slate2">
          Five agents are wired up end-to-end. Open any one to demo it to a prospect.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              slug: "maya",
              name: "Maya",
              role: "Storefront Concierge",
              note: "Chat preview + config",
              metric: "+12% CVR"
            },
            {
              slug: "echo",
              name: "Echo",
              role: "Reviews & Reputation",
              note: "Live reviews inbox",
              metric: "+40 reviews/mo"
            },
            {
              slug: "sage",
              name: "Sage",
              role: "Listings & SEO",
              note: "Before/after rewrite diff",
              metric: "+22% organic clicks"
            },
            {
              slug: "pip",
              name: "Pip",
              role: "Customer Service",
              note: "Live ticket inbox",
              metric: "70% one-touch"
            },
            {
              slug: "redteam",
              name: "Red Teaming Partner",
              role: "Strategy Red-Team Coach",
              note: "Live partner chat + lineage",
              metric: "1 in 3 bets killed early"
            }
          ].map((a) => (
            <Link
              key={a.slug}
              href={`/dashboard/agents/${a.slug}`}
              className="group rounded-2xl border border-ink/10 bg-white p-5 hover:border-ink"
            >
              <div className="flex items-center justify-between">
                <div className="font-display text-2xl">{a.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-sage">Live</div>
              </div>
              <div className="text-xs text-slate2">{a.role}</div>
              <div className="mt-4 text-xs text-ink/70">{a.note}</div>
              <div className="mt-1 text-xs font-mono text-accent">{a.metric}</div>
              <div className="mt-3 text-xs text-accent group-hover:underline">Open →</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl">Tenants</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-bone text-left text-xs uppercase tracking-wider text-slate2">
              <tr>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Vertical</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Agents</th>
                <th className="px-4 py-3 text-right">CVR lift</th>
                <th className="px-4 py-3 text-right">Rev attrib (30d)</th>
                <th className="px-4 py-3 text-right">MRR</th>
                <th className="px-4 py-3">Health</th>
              </tr>
            </thead>
            <tbody>
              {TENANTS.map((t) => (
                <tr key={t.id} className="border-t border-ink/10">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{t.store}</div>
                    <div className="text-xs text-slate2">{t.domain} · {t.gmvBand} GMV</div>
                  </td>
                  <td className="px-4 py-3">{t.vertical}</td>
                  <td className="px-4 py-3">{t.plan}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {t.agents.map((a) => (
                        <span
                          key={a}
                          className="rounded-full border border-ink/15 bg-bone px-2 py-0.5 text-[11px]"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">+{t.metrics.cvrLift}%</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {dollars(t.metrics.revenueAttributed)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {dollars(t.metrics.monthlyFee)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        t.health === "green"
                          ? "rounded-full bg-sage/15 px-2 py-0.5 text-xs text-sage"
                          : t.health === "yellow"
                            ? "rounded-full bg-accent2/40 px-2 py-0.5 text-xs text-ink"
                            : "rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700"
                      }
                    >
                      {t.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent = false
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-ink bg-ink text-bone" : "border-ink/10 bg-white"}`}>
      <div className={`text-xs uppercase tracking-widest ${accent ? "text-bone/60" : "text-slate2"}`}>
        {label}
      </div>
      <div className="mt-2 font-display text-3xl">{value}</div>
      <div className={`mt-1 text-xs ${accent ? "text-bone/60" : "text-slate2"}`}>{sub}</div>
    </div>
  );
}
