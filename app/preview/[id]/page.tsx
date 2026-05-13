import Link from "next/link";
import { notFound } from "next/navigation";
import MayaChat from "@/components/MayaChat";
import PreviewShareBar from "@/components/PreviewShareBar";
import { loadPreview } from "@/lib/preview-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const catalog = await loadPreview(params.id);
  if (!catalog) return { title: "Preview not found" };
  return {
    title: `Maya on ${catalog.storeName} — preview`,
    description: `A live preview of Maya, our AI Storefront Concierge, running on ${catalog.storeName}'s public catalog. Built by Retail Agent Co.`
  };
}

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const catalog = await loadPreview(params.id);
  if (!catalog) notFound();

  const greeting = `Hi — I'm Maya, a preview built by Retail Agent Co. for ${catalog.storeName}. I'm running on your live catalog (${catalog.productCount} products). Ask me anything a customer would.`;
  const suggested = buildSuggestedReplies(catalog);

  return (
    <div className="bg-bone">
      <div className="border-b border-accent2/40 bg-accent2/30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm">
          <div>
            <strong>Preview</strong> · Maya is running on {catalog.storeName}'s public catalog
            <span className="ml-2 text-xs text-ink/60">
              ({catalog.productCount} products · scraped {new Date(catalog.fetchedAt).toLocaleString()})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PreviewShareBar previewUrl={`/preview/${catalog.id}`} />
            <Link
              href="/pricing"
              className="rounded-full bg-ink px-3 py-1.5 text-xs text-bone hover:bg-accent"
            >
              Install Maya on your store →
            </Link>
          </div>
        </div>
      </div>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <div className="text-xs uppercase tracking-widest text-slate2">{catalog.storeDomain}</div>
          <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
            {catalog.storeName}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">From your catalog</h2>
              <span className="text-xs text-slate2">showing {Math.min(catalog.products.length, 12)} of {catalog.productCount}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {catalog.products.slice(0, 12).map((p) => (
                <div key={p.id} className="rounded-2xl border border-ink/10 bg-white p-4">
                  <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl bg-bone">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="font-display text-3xl text-ink/30">—</div>
                    )}
                  </div>
                  <div className="mt-3 line-clamp-2 text-sm font-semibold">{p.title}</div>
                  <div className="mt-0.5 text-xs text-slate2">
                    {[p.category, ...p.tags.slice(0, 2)].filter(Boolean).join(" · ")}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <div className="font-display text-lg">
                      {p.price > 0 ? `$${p.price.toLocaleString()}` : "—"}
                    </div>
                    <div className={p.inStock ? "text-sage" : "text-slate2"}>
                      {p.inStock ? "in stock" : "sold out"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">Maya — Storefront Concierge</div>
                <span className="text-[10px] uppercase tracking-widest text-accent">Preview</span>
              </div>
              <MayaChat
                embedded
                previewId={catalog.id}
                storeName={catalog.storeName}
                greeting={greeting}
                suggestedReplies={suggested}
              />
              <p className="mt-3 text-xs text-slate2">
                Preview chats hit /api/chat/maya with your scraped catalog. Order lookup and
                live policy are disabled — those plug in on the production install.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Like what Maya does here?
          </h2>
          <p className="mt-3 text-slate2">
            On a real install we plug into Shopify (orders, policy, customer history), Klaviyo,
            and Gorgias — and Maya picks up sizing, abandoned carts, and brand-voice quirks. We
            install in a week, guarantee ROI in 30 days, and you can cancel anytime.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/pricing" className="btn-primary">
              See pricing →
            </Link>
            <Link href="/agents" className="btn-ghost">
              Meet the other 7 agents
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function buildSuggestedReplies(catalog: { products: { price: number; inStock: boolean }[] }): string[] {
  const prices = catalog.products.filter((p) => p.inStock && p.price > 0).map((p) => p.price);
  if (!prices.length) {
    return [
      "What's new this week?",
      "Help me find a gift",
      "What's your return policy?",
      "Anything under $100?"
    ];
  }
  const sorted = [...prices].sort((a, b) => a - b);
  const cheap = Math.ceil(sorted[Math.floor(sorted.length / 4)]);
  const mid = Math.ceil(sorted[Math.floor(sorted.length / 2)]);
  const high = Math.ceil(sorted[Math.floor((sorted.length * 3) / 4)]);
  return [
    `Gift idea under $${cheap}`,
    `What's a popular ${"piece"} under $${mid}?`,
    "What's your return policy?",
    `Anything new around $${high}?`
  ];
}
