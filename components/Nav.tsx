import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-bone/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink" />
          Retail Agent <span className="text-slate2">Co.</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link href="/agents" className="hover:text-accent">
            Agents
          </Link>
          <Link href="/pricing" className="hover:text-accent">
            Pricing
          </Link>
          <Link href="/demo" className="hover:text-accent">
            Live demo
          </Link>
          <Link href="/dashboard" className="hover:text-accent">
            Dashboard
          </Link>
        </nav>
        <Link href="/demo" className="btn-primary">
          Try Maya →
        </Link>
      </div>
    </header>
  );
}
