import Link from "next/link";
import {
  CLIENTS,
  recurringARR,
  retainedCount,
  clientsByRung,
  rungLabel
} from "@/lib/practice";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  titleAbsolute: "The practice — Taz Brown Strategies",
  path: "/dashboard",
  noindex: true
});

function dollars(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function Dashboard() {
  const arr = recurringARR();
  const goal = 1_000_000;
  const pct = Math.min(100, Math.round((arr / goal) * 100));
  const ladder = clientsByRung();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate2">The practice</div>
          <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
            Taz Brown Strategies — book of business
          </h1>
        </div>
        <Link href="/workspace" className="btn-primary">
          Open the Partner →
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Clients" value={CLIENTS.length.toString()} sub="active relationships" />
        <Stat label="Recurring ARR" value={dollars(arr)} sub={`${pct}% of $1M goal`} accent />
        <Stat label="Retained" value={retainedCount().toString()} sub="on Cadence or Partner" />
        <Stat label="In the pipeline" value="2" sub="Land clients ready to convert" />
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
          aria-label={`Progress toward $1M recurring ARR: ${pct}%`}
        />
      </div>
      <div className="mt-1 text-xs text-slate2">
        $1M recurring goal — the math is fewer clients up the ladder, not more clients at Land.
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl">The value ladder, right now</h2>
        <p className="mt-1 text-sm text-slate2">
          Every client is engineered to ask for the next rung. This is where the book sits today.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {ladder.map((r) => (
            <div key={r.rung} className="rounded-2xl border border-ink/10 bg-white p-5">
              <div className="text-xs uppercase tracking-widest text-slate2">{r.label}</div>
              <div className="mt-2 font-display text-3xl">{r.count}</div>
              <div className="mt-1 text-xs text-slate2">
                {r.count === 1 ? "client" : "clients"} on this rung
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl">Clients</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-bone text-left text-xs uppercase tracking-wider text-slate2">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Rung</th>
                <th className="px-4 py-3">Last engagement</th>
                <th className="px-4 py-3 text-right">Monthly</th>
                <th className="px-4 py-3">Health</th>
                <th className="px-4 py-3">Next move</th>
              </tr>
            </thead>
            <tbody>
              {CLIENTS.map((c) => (
                <tr key={c.id} className="border-t border-ink/10 align-top">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-slate2">{c.sector}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-ink/15 bg-bone px-2 py-0.5 text-[11px]">
                      {rungLabel(c.rung)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/80">{c.lastEngagement}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {c.monthly ? dollars(c.monthly) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        c.health === "green"
                          ? "rounded-full bg-sage/15 px-2 py-0.5 text-xs text-sage"
                          : c.health === "yellow"
                            ? "rounded-full bg-accent2/40 px-2 py-0.5 text-xs text-ink"
                            : "rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700"
                      }
                    >
                      {c.health}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate2">{c.nextMove}</td>
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
