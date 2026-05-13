import Link from "next/link";
import { LISTINGS } from "@/lib/sage-data";
import SageListingDiff from "@/components/SageListingDiff";

export const metadata = { title: "Sage — listings & SEO" };

export default function SagePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate2">
        <Link href="/dashboard" className="hover:text-ink">
          Dashboard
        </Link>
        <span>/</span>
        <span>Sage — Listings & SEO</span>
      </div>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Sage — listings & SEO</h1>
      <p className="mt-2 max-w-2xl text-slate2">
        Sage rewrites titles, descriptions, alt text, meta descriptions, and JSON-LD schema in the
        merchant's brand voice — pulling product specs from the connected catalog so it can't
        invent metals, carats, or sizes. Click "Rewrite with Sage" on any product to see the
        before/after diff.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Listings to rewrite" value={`${LISTINGS.length}`} sub="loaded for demo" />
        <Stat label="Avg. words / before" value="14" sub="dropshipper-grade" />
        <Stat label="Avg. words / after" value="92" sub="storyteller-grade" />
        <Stat
          label="Search Console lift"
          value="+22%"
          sub="across pilot stores in 90 days"
          accent
        />
      </div>

      <div className="mt-10">
        <SageListingDiff listings={LISTINGS} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent = false
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-ink bg-ink text-bone" : "border-ink/10 bg-white"
      }`}
    >
      <div className={`text-xs uppercase tracking-widest ${accent ? "text-bone/60" : "text-slate2"}`}>
        {label}
      </div>
      <div className="mt-2 font-display text-3xl">{value}</div>
      <div className={`mt-1 text-xs ${accent ? "text-bone/60" : "text-slate2"}`}>{sub}</div>
    </div>
  );
}
