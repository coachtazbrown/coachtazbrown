import Link from "next/link";
import { AGENTS } from "@/lib/agents";

export const metadata = { title: "Agents — Retail Agent Co." };

export default function AgentsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-slate2">The roster</div>
      <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
        Eight agents. One unified back-office.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate2">
        Each agent is productized, priced, and shipped with a single integration in under 5 days.
        Pick one. Pick three. Pick all eight on Scale.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {AGENTS.map((a) => (
          <Link
            key={a.slug}
            href={`/agents/${a.slug}`}
            className="group rounded-3xl border border-ink/10 bg-white p-7 transition hover:border-ink"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className={`mb-3 inline-flex rounded-full px-2 py-0.5 text-[11px] ${a.color}`}>
                  {a.status === "live" ? "Live" : a.status === "beta" ? "Beta" : "Waitlist"}
                </div>
                <div className="font-display text-3xl">{a.name}</div>
                <div className="text-sm text-slate2">{a.role}</div>
              </div>
              <div className="text-right text-sm">
                <div className="text-slate2">From</div>
                <div className="font-display text-2xl">${a.startsAt}</div>
                <div className="text-xs text-slate2">/mo</div>
              </div>
            </div>
            <p className="mt-4 text-ink/85">{a.tagline}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-bone p-3">
                <div className="text-slate2">Replaces</div>
                <div className="mt-1 text-ink/85">{a.replaces}</div>
              </div>
              <div className="rounded-lg bg-bone p-3">
                <div className="text-slate2">Wedge metric</div>
                <div className="mt-1 text-ink/85">{a.wedgeMetric}</div>
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
            <div className="mt-5 text-sm font-medium text-accent group-hover:underline">
              Meet {a.name} →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
