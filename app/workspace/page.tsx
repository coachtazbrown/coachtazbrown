import Link from "next/link";
import RedTeamChat from "@/components/RedTeamChat";
import { REDTEAM_DEFAULT_CONFIG } from "@/lib/redteam-config";
import { RED_TEAM_LINEAGE, VALUE_LADDER } from "@/lib/redteam-knowledge";

export const metadata = { title: "Red Teaming Partner — Taz Brown Strategies" };

export default function RedTeamPage() {
  const cfg = REDTEAM_DEFAULT_CONFIG;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate2">
        <Link href="/" className="hover:text-ink">
          Taz Brown Strategies
        </Link>
        <span>/</span>
        <span>The Red Teaming Partner</span>
      </div>
      <h1 className="mt-2 font-display text-4xl tracking-tight">The Red Teaming Partner</h1>
      <p className="mt-2 max-w-2xl text-slate2">{cfg.positioning}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Techniques in the canon" value={`${RED_TEAM_LINEAGE.length}`} sub="1587 → today" />
        <Stat label="Lowest-friction move" value="90 min" sub="Key Assumptions Check" />
        <Stat label="Doomed bets killed early" value="1 in 3" sub="before launch, across practice" accent />
        <Stat label="Value ladder rungs" value={`${VALUE_LADDER.length}`} sub="land → install & partner" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="text-xs uppercase tracking-widest text-slate2">
              The lineage — earliest → latest
            </div>
            <ol className="mt-3 space-y-3 text-sm">
              {RED_TEAM_LINEAGE.map((t, i) => (
                <li key={t.id} className="flex gap-3">
                  <span className="font-mono text-slate2">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="font-semibold">
                      {t.name} <span className="text-slate2">· {t.era}</span>
                    </div>
                    <div className="mt-0.5 text-ink/75">{t.premise}</div>
                    <div className="mt-1 text-xs text-slate2">
                      Unlocking question: <span className="italic">“{t.unlockingQuestion}”</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="text-xs uppercase tracking-widest text-slate2">
              How a red-team turns into more clients
            </div>
            <ol className="mt-3 space-y-2 text-sm">
              {VALUE_LADDER.map((r) => (
                <li key={r.rung} className="border-t border-ink/10 pt-2 first:border-0 first:pt-0">
                  <span className="font-semibold">{r.rung}</span> — {r.offer}
                  <div className="text-xs text-slate2">
                    {r.why} <span className="text-accent">{r.converts}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="text-xs uppercase tracking-widest text-slate2">Operating principles</div>
            <ol className="mt-3 space-y-2 text-sm">
              {cfg.principles.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-mono text-slate2">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <div className="mb-3 text-sm font-semibold">Work the room with your partner</div>
            <RedTeamChat />
            <div className="mt-3 text-xs text-slate2">
              Runs in demo mode with no API key — set ANTHROPIC_API_KEY for the full
              tool-using partner.
            </div>
          </div>
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
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-ink bg-ink text-bone" : "border-ink/10 bg-white"
      }`}
    >
      <div className={`text-xs uppercase tracking-widest ${accent ? "text-bone/60" : "text-slate2"}`}>
        {label}
      </div>
      <div className="mt-2 font-display text-3xl">{value}</div>
      <div className={`mt-1 text-xs ${accent ? "text-bone/60" : "text-slate2"}`}>{sub}</div>
    </div>
  );
}
