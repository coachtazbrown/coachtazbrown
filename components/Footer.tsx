import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-bone">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-xl">
            <span className="text-accent">✦</span>
            Galactic Studio by Taz
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate2">
            One topic in, two finished videos out — faceless, fact-checked, and grounded in clean
            data. The automated video studio for creators, coaches, and teams.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">The studio</div>
          <ul className="space-y-2 text-slate2">
            <li>
              <Link href="/studio">Make a video</Link>
            </li>
            <li>
              <Link href="/#how">How it works</Link>
            </li>
            <li>
              <Link href="/#engine">The fact-check engine</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">Learn with Taz</div>
          <ul className="space-y-2 text-slate2">
            <li>
              <Link href="/training">Training</Link>
            </li>
            <li>
              <Link href="/training#coaching">1:1 Coaching</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">Principles</div>
          <ul className="space-y-2 text-slate2">
            <li>Always operate from clean data</li>
            <li>Fact-check every output</li>
            <li>No specific ships without a source</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10 px-6 py-5 text-center text-xs text-slate2">
        © {new Date().getFullYear()} Galactic Studio by Taz — faceless video, fully automated.
      </div>
    </footer>
  );
}
