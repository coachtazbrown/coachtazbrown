import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-bone">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-xl">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink" />
            Retail Agent Co.
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate2">
            Eight named AI agents that work the floor, the inbox, and the phone for specialty
            retailers.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">Agents</div>
          <ul className="space-y-2 text-slate2">
            <li>
              <Link href="/agents/maya">Maya — Storefront Concierge</Link>
            </li>
            <li>
              <Link href="/agents/rex">Rex — Re-order & Demand</Link>
            </li>
            <li>
              <Link href="/agents/nova">Nova — Ad Spend</Link>
            </li>
            <li>
              <Link href="/agents">See all eight →</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">For retailers</div>
          <ul className="space-y-2 text-slate2">
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/demo">Live demo</Link>
            </li>
            <li>
              <Link href="/agents">ROI calculator</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">Company</div>
          <ul className="space-y-2 text-slate2">
            <li>30-day ROI guarantee</li>
            <li>Cancel anytime</li>
            <li>SOC 2 (in progress)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10 px-6 py-5 text-center text-xs text-slate2">
        © {new Date().getFullYear()} Retail Agent Co. — Built for Shopify specialty retailers.
      </div>
    </footer>
  );
}
