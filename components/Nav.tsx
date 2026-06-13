import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-bone/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-tight">
          <span className="text-accent">✦</span>
          Galactic Studio <span className="text-slate2">by Taz</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link href="/studio" className="hover:text-accent">
            The Studio
          </Link>
          <Link href="/training" className="hover:text-accent">
            Training &amp; Coaching
          </Link>
          <Link href="/#how" className="hover:text-accent">
            How it works
          </Link>
        </nav>
        <Link href="/studio" className="btn-primary">
          Open the Studio →
        </Link>
      </div>
    </header>
  );
}
