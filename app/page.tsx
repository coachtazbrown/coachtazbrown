import Link from "next/link";
import { RED_TEAM_LINEAGE, VALUE_LADDER } from "@/lib/redteam-knowledge";

export default function Home() {
  return (
    <div>
      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" /> The red-teaming practice ·
              Taz Brown Strategies
            </div>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
              We red-team your strategy <br className="hidden md:block" />
              before <span className="italic text-accent">reality</span> does.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate2">
              Founders and leadership teams don&apos;t fail on bad logic — they fail on one
              unexamined assumption nobody was paid to attack. Taz Brown Strategies installs the
              adversarial thinking that finds it while the decision is still cheap to change.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/workspace" className="btn-primary">
                Open the Red Teaming Partner →
              </Link>
              <Link href="/method" className="btn-ghost">
                See the method
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="text-slate2">The canon</dt>
                <dd className="font-display text-2xl">1587 → today</dd>
              </div>
              <div>
                <dt className="text-slate2">Cheapest move</dt>
                <dd className="font-display text-2xl">90 min</dd>
              </div>
              <div>
                <dt className="text-slate2">Doomed bets killed early</dt>
                <dd className="font-display text-2xl">1 in 3</dd>
              </div>
            </dl>
          </div>
          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between text-xs text-slate2">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-sage" />
                  Red Teaming Partner · your AI co-founder
                </div>
                <div>live</div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="ml-auto max-w-[88%] rounded-2xl bg-ink p-3 text-bone">
                  Client&apos;s founder wants to launch a new line next quarter. Whole team
                  already agrees. What do I run?
                </div>
                <div className="max-w-[92%] rounded-2xl bg-bone p-3 text-ink/85">
                  Fast agreement is the warning sign, not slow. Run{" "}
                  <span className="font-semibold">Groupthink Diagnosis (Janis, 1972)</span> then a{" "}
                  <span className="font-semibold">Premortem (Klein, 2007)</span>. The question
                  that does the work: <span className="italic">&ldquo;It&apos;s 18 months out
                  and this failed — what&apos;s the reason nobody wanted to say first?&rdquo;</span>{" "}
                  Don&apos;t be the skeptic — assign it. → That premortem debrief in 30 days is
                  your bridge to a retained cadence.
                </div>
              </div>
              <div className="mt-5 border-t border-ink/10 pt-4">
                <Link href="/workspace" className="text-sm font-medium text-accent hover:underline">
                  Work the room with your partner →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate2">The canon</div>
              <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
                Every technique, earliest to latest.
              </h2>
            </div>
            <Link href="/method" className="btn-ghost">
              The full method →
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {RED_TEAM_LINEAGE.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-ink/10 bg-bone p-5"
              >
                <div className="font-mono text-xs text-slate2">{t.era}</div>
                <div className="mt-1 font-display text-xl">{t.name}</div>
                <p className="mt-2 text-sm text-ink/75">{t.premise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate2">How we work</div>
            <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
              Coach, don&apos;t consult.
            </h2>
            <p className="mt-5 text-lg text-slate2">
              We don&apos;t hand your team an answer to nod at. We build the room and ask the
              question that makes them produce it — because a team defends what it concludes and
              forgets what it&apos;s told. The finding is theirs. The method is ours.
            </p>
            <ul className="mt-6 space-y-3 text-ink/85">
              <li>· Founders staring down an irreversible bet</li>
              <li>· Leadership teams that agree too fast</li>
              <li>· PE / diligence — a premortem before the deal closes</li>
              <li>· Boards that want decision quality, not just outcomes</li>
            </ul>
            <Link href="/pricing" className="btn-primary mt-8">
              See engagements
            </Link>
          </div>
          <div className="card">
            <div className="text-sm font-semibold">The value ladder</div>
            <table className="mt-4 w-full text-sm">
              <tbody>
                {VALUE_LADDER.map((r) => (
                  <tr key={r.rung} className="border-t border-ink/10 first:border-0">
                    <td className="py-3 pr-3 align-top font-mono text-xs text-slate2">
                      {r.rung}
                    </td>
                    <td className="py-3">
                      <div>{r.offer}</div>
                      <div className="mt-0.5 text-xs text-accent">{r.converts}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-5 rounded-xl bg-bone p-4 text-sm text-slate2">
              Every engagement is engineered to earn the next one — wins compound into
              referrals, not invoices.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl tracking-tight md:text-6xl">
            The plan everyone agreed with is the one to attack first.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-bone/70">
            Bring one real, live decision. In 90 minutes the Red Teaming Partner gives you the
            exact move, the question to ask the room, and the one facilitation mistake to avoid.
          </p>
          <Link href="/workspace" className="btn mt-8 bg-accent2 text-ink hover:bg-bone">
            Open the Red Teaming Partner →
          </Link>
        </div>
      </section>
    </div>
  );
}
