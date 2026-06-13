import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Training & Coaching — Galactic Studio by Taz",
  description:
    "Learn the faceless video system from Taz: self-paced training, group coaching, and 1:1 coaching. Pick topics that travel, write hooks that hold, and turn a channel into an offer."
};

const TIERS = [
  {
    name: "Self-paced training",
    price: "Foundations",
    tag: "Start here",
    blurb: "The complete faceless video system, on demand.",
    points: [
      "Topic selection: how to find ideas that actually travel",
      "Hook craft: the first three seconds, drilled",
      "Retention mechanics: open loops, value density, pacing",
      "Packaging: titles + thumbnails as one unit",
      "Using Galactic Studio end-to-end to publish weekly"
    ],
    cta: "Get the training",
    href: "/studio",
    featured: false
  },
  {
    name: "Group coaching",
    price: "Cohort",
    tag: "Most popular",
    blurb: "Weekly working sessions — leave each one with a video.",
    points: [
      "Live topic-to-publish workshops",
      "Hook and script review on your real videos",
      "Accountability: a publishing cadence that sticks",
      "Private community of faceless creators",
      "Everything in self-paced training"
    ],
    cta: "Join a cohort",
    href: "/studio",
    featured: true
  },
  {
    name: "1:1 coaching",
    price: "Private",
    tag: "For serious builders",
    blurb: "Taz on your channel — strategy, review, and a 90-day plan.",
    points: [
      "Channel audit and positioning",
      "A custom content engine for your niche",
      "Direct script + thumbnail review",
      "A concrete 90-day growth plan",
      "Priority access and direct line to Taz"
    ],
    cta: "Apply for 1:1",
    href: "/studio",
    featured: false
  }
];

export default function TrainingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-sage" /> Learn with Taz
        </div>
        <h1 className="mt-4 font-display text-5xl tracking-tight md:text-6xl">
          The studio makes the videos. <span className="italic text-accent">Taz</span> makes you good.
        </h1>
        <p className="mt-5 text-lg text-slate2">
          Automation handles the production. Coaching handles the judgment automation can&apos;t —
          which topics travel, which hooks hold, and how a faceless channel becomes an audience and
          an offer.
        </p>
      </div>

      <div id="coaching" className="mt-12 grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-3xl border p-6 ${
              tier.featured ? "border-accent bg-white shadow-lg" : "border-ink/10 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">{tier.tag}</span>
            </div>
            <div className="mt-3 font-display text-2xl">{tier.name}</div>
            <div className="text-sm text-slate2">{tier.price}</div>
            <p className="mt-3 text-sm text-ink/80">{tier.blurb}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-ink/80">
              {tier.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-sage">✓</span> {p}
                </li>
              ))}
            </ul>
            <Link href={tier.href} className={`mt-6 ${tier.featured ? "btn-primary" : "btn-ghost"}`}>
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-3xl bg-ink p-10 text-center text-bone">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          Try the studio first — it&apos;s the best sales pitch I&apos;ve got.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-bone/70">
          Make a video on a topic you care about. If you see what it does in five minutes, the
          training is just teaching you to drive it like a pro.
        </p>
        <Link href="/studio" className="btn mt-7 bg-accent2 text-ink hover:bg-bone">
          Make a video now →
        </Link>
      </div>
    </div>
  );
}
