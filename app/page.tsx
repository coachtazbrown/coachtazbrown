import Link from "next/link";
import { AGENTS } from "@/lib/agents";

export default function Home() {
  return (
    <div>
      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" /> Live with 14 Shopify specialty
              retailers
            </div>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
              An eight-person AI team, <br className="hidden md:block" />
              for the price of <span className="italic text-accent">one</span> mid-level hire.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate2">
              Retail Agent Co. builds productized AI agents for Shopify specialty retailers doing
              $1M–$5M GMV. Each agent replaces a real line item on your P&L. We install in a
              week and guarantee ROI in 30 days.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo" className="btn-primary">
                Talk to Maya, our concierge →
              </Link>
              <Link href="/agents" className="btn-ghost">
                Meet the team
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="text-slate2">Avg. revenue lift</dt>
                <dd className="font-display text-2xl">+11.4%</dd>
              </div>
              <div>
                <dt className="text-slate2">Setup time</dt>
                <dd className="font-display text-2xl">5 days</dd>
              </div>
              <div>
                <dt className="text-slate2">Churn (90d)</dt>
                <dd className="font-display text-2xl">3%</dd>
              </div>
            </dl>
          </div>
          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between text-xs text-slate2">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-sage" />
                  marlowhart.com · Maya is live
                </div>
                <div>online · 24/7</div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="max-w-[85%] rounded-2xl bg-bone p-3 text-ink/80">
                  Hi — I'm Maya at Marlow & Hart. Looking for something specific?
                </div>
                <div className="ml-auto max-w-[85%] rounded-2xl bg-ink p-3 text-bone">
                  Engagement ring under $2,000. She loves yellow gold.
                </div>
                <div className="max-w-[90%] rounded-2xl bg-bone p-3 text-ink/80">
                  Two I'd start with: the <span className="font-semibold">Lila Solitaire</span> in
                  14k yellow gold ($1,480, 6 in stock) or the
                  <span className="font-semibold"> Hart Signet</span> if she'd prefer a band she can
                  wear every day. Want me to set aside the Lila in her size?
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-ink/10 pt-4 text-xs">
                <div className="rounded-lg bg-bone p-2">
                  <div className="text-slate2">Sessions</div>
                  <div className="font-display text-lg">1,284</div>
                </div>
                <div className="rounded-lg bg-bone p-2">
                  <div className="text-slate2">CVR lift</div>
                  <div className="font-display text-lg">+13.1%</div>
                </div>
                <div className="rounded-lg bg-bone p-2">
                  <div className="text-slate2">Saved tickets</div>
                  <div className="font-display text-lg">421</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate2">The roster</div>
              <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
                Eight named agents. Each replaces a real line item.
              </h2>
            </div>
            <Link href="/agents" className="btn-ghost">
              See all →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {AGENTS.map((a) => (
              <Link
                key={a.slug}
                href={`/agents/${a.slug}`}
                className="group rounded-2xl border border-ink/10 bg-bone p-5 transition hover:border-ink"
              >
                <div className={`mb-3 inline-flex rounded-full px-2 py-0.5 text-[11px] ${a.color}`}>
                  {a.status === "live" ? "Live" : a.status === "beta" ? "Beta" : "Waitlist"}
                </div>
                <div className="font-display text-2xl">{a.name}</div>
                <div className="text-sm text-slate2">{a.role}</div>
                <p className="mt-3 text-sm text-ink/80">{a.tagline}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate2">
                  <span>From ${a.startsAt.toLocaleString()}/mo</span>
                  <span className="group-hover:text-accent">Meet {a.name} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate2">Built for</div>
            <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
              Specialty retailers, not enterprise.
            </h2>
            <p className="mt-5 text-lg text-slate2">
              If you're doing <strong>$1M–$5M GMV on Shopify</strong> — running 1 to 8 locations,
              a small team, and you've already maxed out what Klaviyo and Gorgias can do — you're
              the reason we exist.
            </p>
            <ul className="mt-6 space-y-3 text-ink/85">
              <li>· Jewelers, opticians, furniture, pet, home, kids, gift, outdoor</li>
              <li>· DTC brands that fired their agency last quarter</li>
              <li>· Multi-location independents on Square or Lightspeed</li>
              <li>· Cannabis dispensaries (regulated stack included)</li>
            </ul>
            <Link href="/pricing" className="btn-primary mt-8">
              See pricing
            </Link>
          </div>
          <div className="card">
            <div className="text-sm font-semibold">A typical 12-month with us</div>
            <table className="mt-4 w-full text-sm">
              <tbody>
                {[
                  ["Month 1", "Maya + Echo installed, baseline measured", "$1,500/mo + $2.5K setup"],
                  ["Month 2", "First ROI report. CVR up 8%.", "$1,500/mo"],
                  ["Month 3", "Move to Growth. Add Sage + Nova.", "$3,500/mo"],
                  ["Month 6", "Pip live. 70% of tickets self-serve.", "$3,500/mo"],
                  ["Month 12", "Move to Command. All 8 agents.", "$8,500/mo"]
                ].map(([m, what, cost]) => (
                  <tr key={m} className="border-t border-ink/10">
                    <td className="py-3 pr-2 font-mono text-xs text-slate2">{m}</td>
                    <td className="py-3 pr-2">{what}</td>
                    <td className="py-3 text-right font-mono text-xs">{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-5 rounded-xl bg-bone p-4 text-sm text-slate2">
              What you'd otherwise spend on the same output:
              <span className="ml-2 font-display text-xl text-ink">~$165,000</span>
              <span className="ml-1">/ Retail Agent Co. year 1: ~$54,000.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl tracking-tight md:text-6xl">
            Five days from "let's see" to "Maya saved us a sale at 2am."
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-bone/70">
            Book a 20-minute call. We'll demo Maya on your actual storefront before the call ends.
            If she doesn't pay for herself in 30 days, you don't.
          </p>
          <Link
            href="/demo"
            className="btn mt-8 bg-accent2 text-ink hover:bg-bone"
          >
            Try Maya on our demo store →
          </Link>
        </div>
      </section>
    </div>
  );
}
