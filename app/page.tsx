import Link from "next/link";
import { CORPUS_SIZE } from "@/lib/studio/demo";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({ path: "/" });

const STEPS = [
  { n: "01", t: "You give a topic", d: "One line. That's the whole input. No script, no storyboard, no editing timeline." },
  { n: "02", t: "It researches live", d: "Web search pulls current, reputable sources on your topic and captures every citation." },
  { n: "03", t: "It grounds on clean data", d: `RAG retrieval over a ${CORPUS_SIZE}-chunk craft corpus shapes structure, hook, and pacing — never guesswork.` },
  { n: "04", t: "It writes both cuts", d: "A faceless YouTube long-form and a 16:9 LinkedIn short, written for the ear, scene by scene." },
  { n: "05", t: "It fact-checks everything", d: "Every claim is graded with a verdict and a citation. No specific ships without a source." }
];

const EDGE = [
  {
    t: "Fact-checked by default",
    d: "Other tools generate confident, unsourced text. Galactic Studio runs a fact-check pass over the finished script and refuses to mark any number, date, or quote 'verified' without a citation."
  },
  {
    t: "RAG on clean data",
    d: "Structure and craft decisions are retrieved from a curated, source-tagged corpus — so the videos follow what actually holds attention, not whatever the model felt like."
  },
  {
    t: "Two platforms, one input",
    d: "YouTube long-form and a 16:9 LinkedIn short come out of a single topic — each paced and packaged for its platform, both ready to publish."
  },
  {
    t: "It actually renders",
    d: "Not just a script. A real faceless video plays in your browser — galaxy visuals, kinetic captions, voiceover — and exports to a downloadable file."
  },
  {
    t: "Everything is downloadable",
    d: "Script, SRT captions, post copy, tags, thumbnail concept, and the rendered video. Walk away with assets, not lock-in."
  },
  {
    t: "Honest offline mode",
    d: "No API key? It still produces a full, usable production from the corpus and flags every claim that needs live verification. It never fakes a source."
  }
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Faceless video, fully automated ·
              fact-checked
            </div>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
              Give me a topic. <br className="hidden md:block" />
              I&apos;ll build the <span className="italic text-accent">videos</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate2">
              Galactic Studio by Taz turns one line into a faceless YouTube video and a 16:9 LinkedIn
              short — researched, grounded on clean data with RAG, and fact-checked claim by claim.
              You bring the idea. The studio does the rest.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/studio" className="btn-primary">
                Open the Studio →
              </Link>
              <Link href="/training" className="btn-ghost">
                Training &amp; coaching
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="text-slate2">Your input</dt>
                <dd className="font-display text-2xl">1 topic</dd>
              </div>
              <div>
                <dt className="text-slate2">Out the door</dt>
                <dd className="font-display text-2xl">2 cuts</dd>
              </div>
              <div>
                <dt className="text-slate2">Unsourced claims shipped</dt>
                <dd className="font-display text-2xl">0</dd>
              </div>
            </dl>
          </div>

          {/* Hero card — a faceless frame mock */}
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-lg">
              <div className="relative flex aspect-video flex-col justify-between bg-gradient-to-br from-[#141034] to-[#06060F] p-6">
                <div className="flex items-center justify-between text-xs text-[#8C8AB8]">
                  <span>01 · HOOK</span>
                  <span>GALACTIC STUDIO ✦</span>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl font-black text-[#EDEBFF] md:text-4xl">
                    Three moves.
                  </div>
                  <div className="mt-2 inline-block rounded-md bg-black/40 px-3 py-1 text-sm text-[#E8FF5B]">
                    the one most people skip
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/3 rounded-full bg-[#E8FF5B]" />
                </div>
              </div>
              <div className="flex items-center justify-between bg-[#0B0A18] px-4 py-3 text-xs text-bone">
                <span className="rounded-full bg-[#E8FF5B] px-3 py-1 font-semibold text-[#06060F]">▶ Play</span>
                <span className="text-white/50">Fact-check 98/100 · 5 sources</span>
              </div>
            </div>
            <Link href="/studio" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
              See it render a real video →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-xs uppercase tracking-widest text-slate2">How it works</div>
          <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
            From a sentence to two finished videos.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-ink/10 bg-bone p-5">
                <div className="font-mono text-sm text-accent">{s.n}</div>
                <div className="mt-2 font-display text-lg">{s.t}</div>
                <p className="mt-1 text-sm text-ink/75">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The engine / why 3x better */}
      <section id="engine" className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-slate2">Why it&apos;s built different</div>
            <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
              Three times better, by refusing to guess.
            </h2>
            <p className="mt-4 text-lg text-slate2">
              Most AI video tools optimize for output speed and quietly hand you unverified claims.
              Galactic Studio optimizes for whether you can stand behind what you publish.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {EDGE.map((e) => (
              <div key={e.t} className="card">
                <div className="font-display text-xl">{e.t}</div>
                <p className="mt-2 text-sm text-ink/75">{e.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training & coaching teaser */}
      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate2">Learn with Taz</div>
            <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
              Training and coaching, built in.
            </h2>
            <p className="mt-5 text-lg text-slate2">
              The studio makes the videos. Taz teaches you the craft behind them — how to pick topics
              that travel, write hooks that hold, and turn a faceless channel into an audience and an
              offer.
            </p>
            <Link href="/training" className="btn-primary mt-8">
              See training &amp; coaching
            </Link>
          </div>
          <div className="card">
            <ul className="space-y-4 text-sm">
              <li className="border-b border-ink/10 pb-4">
                <div className="font-semibold">Self-paced training</div>
                <div className="text-slate2">The faceless video system — topics, hooks, retention, packaging.</div>
              </li>
              <li className="border-b border-ink/10 pb-4">
                <div className="font-semibold">Group coaching</div>
                <div className="text-slate2">Weekly working sessions — bring your topic, leave with a published video.</div>
              </li>
              <li>
                <div className="font-semibold">1:1 coaching</div>
                <div className="text-slate2">Taz on your channel — strategy, review, and the next 90 days.</div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl tracking-tight md:text-6xl">
            What&apos;s your next video about?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-bone/70">
            Type one topic. Watch the studio research it, fact-check it, and render a faceless
            YouTube video and a 16:9 LinkedIn short — in front of you.
          </p>
          <Link href="/studio" className="btn mt-8 bg-accent2 text-ink hover:bg-bone">
            Open the Studio →
          </Link>
        </div>
      </section>
    </div>
  );
}
