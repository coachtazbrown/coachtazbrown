import { PRODUCTS, STORE } from "@/lib/store-catalog";
import MayaChat from "@/components/MayaChat";

export const metadata = { title: "Live demo — Marlow & Hart × Maya" };

export default function DemoPage() {
  return (
    <div className="bg-bone">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="rounded-2xl border border-ink/15 bg-white p-4 text-sm">
          <strong>This is a sales demo.</strong> Marlow & Hart is a fictional Shopify jewelry brand
          we built so you can talk to Maya without us touching your live store. Try one of these
          prompts:
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate2">
            <li>"Engagement ring under $2,000, she likes yellow gold"</li>
            <li>"Where is order #1001? Email is <span className="font-mono">demo@retail-agent.co</span>"</li>
            <li>"What's your return policy on engraved pieces?"</li>
            <li>"Gift idea under $250 for a mother-in-law"</li>
          </ul>
        </div>
      </div>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <div className="text-xs uppercase tracking-widest text-slate2">{STORE.name}</div>
          <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">{STORE.tagline}</h1>
          <p className="mt-3 text-slate2">{STORE.hours} · {STORE.phone}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">New & loved</h2>
              <span className="text-xs text-slate2">{PRODUCTS.length} pieces</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {PRODUCTS.filter((p) => p.category !== "gift-cards").map((p) => (
                <div key={p.id} className="rounded-2xl border border-ink/10 bg-white p-4">
                  <div className="flex h-32 items-center justify-center rounded-xl bg-bone">
                    <div className="font-display text-4xl text-ink/30">
                      {p.category === "rings" ? "○" : p.category === "earrings" ? "◌◌" : p.category === "necklaces" ? "◡" : "—"}
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-semibold">{p.title}</div>
                  <div className="mt-0.5 text-xs text-slate2">
                    {p.metal} · {p.stone !== "none" ? p.stone : "no stone"}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <div className="font-display text-lg">${p.price.toLocaleString()}</div>
                    <div className={p.inStock ? "text-sage" : "text-slate2"}>
                      {p.inStock ? `${p.stockOnHand} in stock` : "Backorder"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="mb-3 text-sm font-semibold">Maya — Storefront Concierge</div>
              <MayaChat embedded />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
