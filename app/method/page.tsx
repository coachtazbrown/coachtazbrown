import Link from "next/link";
import {
  RED_TEAM_LINEAGE,
  COACHING_LINEAGE,
  THINKING_MODELS,
  VALUE_LADDER
} from "@/lib/redteam-knowledge";

export const metadata = { title: "The method — Taz Brown Strategies" };

export default function MethodPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-slate2">The method</div>
      <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
        The whole canon, earliest to latest.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate2">
        Red teaming isn&apos;t one trick — it&apos;s 400 years of people building structures so a
        claim has to survive an opponent. Taz Brown Strategies works the whole lineage. The Red
        Teaming Partner reasons over every entry below.
      </p>

      <section className="mt-14">
        <h2 className="font-display text-3xl tracking-tight">Red teaming — 1587 to today</h2>
        <ol className="mt-6 space-y-5">
          {RED_TEAM_LINEAGE.map((t, i) => (
            <li
              key={t.id}
              className="rounded-3xl border border-ink/10 bg-white p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-display text-2xl">
                  <span className="font-mono text-sm text-slate2">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  {t.name}
                </div>
                <div className="font-mono text-xs text-slate2">{t.era}</div>
              </div>
              <div className="mt-1 text-xs text-slate2">{t.lineage}</div>
              <p className="mt-3 text-ink/85">{t.premise}</p>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-xl bg-bone p-4">
                  <div className="text-xs uppercase tracking-widest text-slate2">
                    Run it when
                  </div>
                  <div className="mt-1 text-ink/80">{t.whenToUse}</div>
                </div>
                <div className="rounded-xl bg-bone p-4">
                  <div className="text-xs uppercase tracking-widest text-slate2">
                    The question that does the work
                  </div>
                  <div className="mt-1 italic text-ink/80">&ldquo;{t.unlockingQuestion}&rdquo;</div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Coaching lineage</h2>
          <p className="mt-2 text-sm text-slate2">
            How we draw the answer out instead of handing it over.
          </p>
          <ul className="mt-5 space-y-3">
            {COACHING_LINEAGE.map((c) => (
              <li key={c.id} className="rounded-2xl border border-ink/10 bg-white p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-semibold">{c.name}</div>
                  <div className="font-mono text-xs text-slate2">{c.era}</div>
                </div>
                <p className="mt-2 text-sm text-ink/80">{c.move}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-3xl tracking-tight">Thinking models</h2>
          <p className="mt-2 text-sm text-slate2">
            The cognitive scaffolding underneath the techniques.
          </p>
          <ul className="mt-5 space-y-3">
            {THINKING_MODELS.map((m) => (
              <li key={m.id} className="rounded-2xl border border-ink/10 bg-white p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-semibold">{m.name}</div>
                  <div className="font-mono text-xs text-slate2">{m.era}</div>
                </div>
                <p className="mt-2 text-sm text-ink/80">{m.idea}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl tracking-tight">
          How a red-team becomes a partnership
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {VALUE_LADDER.map((r) => (
            <div key={r.rung} className="rounded-2xl border border-ink/10 bg-white p-5">
              <div className="font-display text-lg">{r.rung}</div>
              <p className="mt-2 text-sm text-ink/80">{r.offer}</p>
              <div className="mt-2 text-xs text-accent">{r.converts}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 rounded-3xl bg-ink p-10 text-center text-bone">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          Bring one real decision.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-bone/70">
          The Red Teaming Partner will tell you exactly which of these to run, how to facilitate
          it, and the one mistake to avoid.
        </p>
        <Link href="/workspace" className="btn mt-7 bg-accent2 text-ink hover:bg-bone">
          Open the Partner →
        </Link>
      </div>
    </div>
  );
}
