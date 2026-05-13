import Link from "next/link";
import { notFound } from "next/navigation";
import { AGENTS, getAgent } from "@/lib/agents";

export function generateStaticParams() {
  return AGENTS.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const a = getAgent(params.slug);
  if (!a) return {};
  return { title: `${a.name} — ${a.role} | Retail Agent Co.` };
}

export default function AgentPage({ params }: { params: { slug: string } }) {
  const a = getAgent(params.slug);
  if (!a) notFound();

  return (
    <div>
      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className={`mb-3 inline-flex rounded-full px-2 py-0.5 text-[11px] ${a.color}`}>
              {a.status === "live" ? "Live now" : a.status === "beta" ? "Private beta" : "Join waitlist"}
            </div>
            <h1 className="font-display text-5xl tracking-tight md:text-6xl">{a.name}</h1>
            <div className="mt-1 text-xl text-slate2">{a.role}</div>
            <p className="mt-6 max-w-xl text-lg">{a.tagline}</p>
            <p className="mt-4 max-w-xl text-slate2">{a.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {a.slug === "maya" ? (
                <Link href="/demo" className="btn-primary">
                  Try Maya on the demo store →
                </Link>
              ) : (
                <Link href="/demo" className="btn-primary">
                  Book a live demo →
                </Link>
              )}
              <Link href="/pricing" className="btn-ghost">
                See pricing
              </Link>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="card">
              <div className="text-xs uppercase tracking-widest text-slate2">From</div>
              <div className="font-display text-5xl">
                ${a.startsAt.toLocaleString()}
                <span className="text-base text-slate2">/mo</span>
              </div>
              <div className="mt-1 text-xs text-slate2">
                Foundation tier — any 2 agents. <Link href="/pricing" className="underline">See tiers</Link>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between border-t border-ink/10 pt-2">
                  <span className="text-slate2">Replaces</span>
                  <span className="text-right">{a.replaces}</span>
                </div>
                <div className="flex justify-between border-t border-ink/10 pt-2">
                  <span className="text-slate2">Wedge metric</span>
                  <span className="text-right">{a.wedgeMetric}</span>
                </div>
                <div className="flex justify-between border-t border-ink/10 pt-2">
                  <span className="text-slate2">Setup time</span>
                  <span className="text-right">5 days</span>
                </div>
                <div className="flex justify-between border-t border-ink/10 pt-2">
                  <span className="text-slate2">Guarantee</span>
                  <span className="text-right">30-day ROI or refund</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {a.integrations.map((i) => (
                  <span
                    key={i}
                    className="rounded-full border border-ink/15 bg-bone px-2 py-0.5 text-[11px] text-slate2"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">What {a.name} ships with</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {a.bullets.map((b) => (
              <li key={b} className="rounded-2xl border border-ink/10 p-5">
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">The other seven</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {AGENTS.filter((x) => x.slug !== a.slug).map((x) => (
              <Link
                key={x.slug}
                href={`/agents/${x.slug}`}
                className="rounded-2xl border border-ink/10 bg-white p-4 hover:border-ink"
              >
                <div className="font-display text-xl">{x.name}</div>
                <div className="text-xs text-slate2">{x.role}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
