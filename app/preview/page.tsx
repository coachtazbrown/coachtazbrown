import PreviewForm from "@/components/PreviewForm";

export const metadata = {
  title: "See Maya on your store — Retail Agent Co.",
  description:
    "Paste your Shopify URL. We'll scrape your public catalog and put Maya — our concierge AI — on your products in 20 seconds."
};

export default function PreviewLanding() {
  return (
    <div>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" /> No signup. No OAuth. ~20
            seconds.
          </div>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
            See Maya on <em className="italic text-accent">your</em> store.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate2">
            Paste any Shopify URL. We'll read your public catalog, put Maya on your products, and
            give you a shareable link you can poke at — or send to your team to play with.
          </p>
          <div className="mx-auto mt-8 max-w-xl text-left">
            <PreviewForm />
          </div>
          <p className="mx-auto mt-6 max-w-xl text-xs text-slate2">
            Preview is read-only: we never touch your live store, never collect customer data, and
            never need OAuth. The preview link is private — only people you send it to can see it.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-display text-3xl tracking-tight">What you'll see</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Your real catalog",
                body:
                  "We pull up to 60 products from your public /products.json — titles, prices, stock, images, descriptions."
              },
              {
                title: "Maya actually working",
                body:
                  "Ask for a gift under $200, ask about a return, ask what's new — Maya answers from your catalog with the right products and prices."
              },
              {
                title: "A link to share",
                body:
                  "Every preview gets a unique URL. Send it to your team or to a teammate. Record a Loom over it. Expires in 7 days."
              }
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-ink/10 bg-bone p-5">
                <div className="font-display text-xl">{s.title}</div>
                <p className="mt-2 text-sm text-slate2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
