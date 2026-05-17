import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-bone">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-xl">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink" />
            Taz Brown Strategies
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate2">
            We red-team your strategy before reality does — so the plan survives contact
            with the market, the competitor, and the room.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">The work</div>
          <ul className="space-y-2 text-slate2">
            <li>
              <Link href="/method">The method — 1587 to today</Link>
            </li>
            <li>
              <Link href="/workspace">The Red Teaming Partner</Link>
            </li>
            <li>
              <Link href="/pricing">Engagements</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">The practice</div>
          <ul className="space-y-2 text-slate2">
            <li>
              <Link href="/dashboard">Book of business</Link>
            </li>
            <li>
              <Link href="/pricing">The value ladder</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">Principle</div>
          <ul className="space-y-2 text-slate2">
            <li>Coach, don&apos;t consult</li>
            <li>Diagnose structure, never people</li>
            <li>A finding with no owner was theatre</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10 px-6 py-5 text-center text-xs text-slate2">
        © {new Date().getFullYear()} Taz Brown Strategies — adversarial thinking, installed.
      </div>
    </footer>
  );
}
