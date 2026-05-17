import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-bone/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink" />
          Taz Brown <span className="text-slate2">Strategies</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link href="/method" className="hover:text-accent">
            The method
          </Link>
          <Link href="/pricing" className="hover:text-accent">
            Engagements
          </Link>
          <Link href="/dashboard" className="hover:text-accent">
            The practice
          </Link>
        </nav>
        <Link href="/workspace" className="btn-primary">
          Open the Partner →
        </Link>
      </div>
    </header>
  );
}
