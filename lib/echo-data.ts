// Seeded customer reviews for the Echo agent demo. Mirrors what a real Shopify
// Product Reviews feed would look like. The 1-star and 2-star entries are
// engineered to demonstrate Echo's escalation and sentiment-flag behaviors.

export type Review = {
  id: string;
  product: string;
  productHandle: string;
  customer: string;
  stars: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  postedAt: string;
  channel: "shopify" | "google" | "yotpo";
  status: "unhandled" | "responded";
  flags: ("urgent" | "defective" | "shipping" | "sizing" | "praise" | "service")[];
};

export const REVIEWS: Review[] = [
  {
    id: "r_001",
    product: "June Pearl Studs",
    productHandle: "june-pearl-studs",
    customer: "Priya M.",
    stars: 5,
    title: "Mom cried when she opened them",
    body:
      "Got these for Mother's Day. The pearls are creamier than the photos and the gold has a gentle warmth. Shipping was three days. Will absolutely shop again.",
    postedAt: "2026-05-11",
    channel: "shopify",
    status: "unhandled",
    flags: ["praise"]
  },
  {
    id: "r_002",
    product: "Lila Solitaire",
    productHandle: "lila-solitaire",
    customer: "Jordan W.",
    stars: 5,
    title: "She said yes",
    body:
      "I read every review on the internet before I ordered. The Lila is even better in person — the band is delicate without feeling fragile. Marlow & Hart, thank you.",
    postedAt: "2026-05-10",
    channel: "shopify",
    status: "unhandled",
    flags: ["praise"]
  },
  {
    id: "r_003",
    product: "Hart Signet Ring",
    productHandle: "hart-signet",
    customer: "Marco D.",
    stars: 4,
    title: "Beautiful but engraving is a touch off-center",
    body:
      "The signet itself is gorgeous and the gold is heavy in a good way. The engraving (three initials) came out slightly off-center. Not a dealbreaker but I noticed.",
    postedAt: "2026-05-09",
    channel: "shopify",
    status: "unhandled",
    flags: ["defective"]
  },
  {
    id: "r_004",
    product: "June Pearl Studs — Silver",
    productHandle: "june-pearl-studs-silver",
    customer: "Tasha K.",
    stars: 3,
    title: "Cute but smaller than I expected",
    body:
      "Pearls are tiny — 4mm maybe? Photos make them look 6-7mm. Quality is fine for the price but I'm exchanging for the gold pair.",
    postedAt: "2026-05-08",
    channel: "yotpo",
    status: "unhandled",
    flags: ["sizing"]
  },
  {
    id: "r_005",
    product: "Hart Signet Ring",
    productHandle: "hart-signet",
    customer: "Anonymous",
    stars: 1,
    title: "Three weeks, no shipping update, no response",
    body:
      "Ordered April 18th. It's May 9th. No tracking, no shipping notice, no reply to my last two emails. This is unacceptable.",
    postedAt: "2026-05-09",
    channel: "google",
    status: "unhandled",
    flags: ["urgent", "shipping"]
  },
  {
    id: "r_006",
    product: "Ember Ruby Huggies",
    productHandle: "ruby-huggies",
    customer: "Lena R.",
    stars: 5,
    title: "Haven't taken them off",
    body:
      "Sleeping in them, showering in them, working out in them. Three weeks of daily wear and they look new.",
    postedAt: "2026-05-07",
    channel: "shopify",
    status: "unhandled",
    flags: ["praise"]
  },
  {
    id: "r_007",
    product: "Cobalt Eternity Band",
    productHandle: "sapphire-eternity",
    customer: "Hugh S.",
    stars: 2,
    title: "Tarnished within a month",
    body:
      "I was told these were 14k. After ~30 days of wear the band looks dull and the sapphires have a film on them. Either I got a bad piece or the metal isn't what's advertised.",
    postedAt: "2026-05-06",
    channel: "google",
    status: "unhandled",
    flags: ["urgent", "defective"]
  },
  {
    id: "r_008",
    product: "Drift Cable Bracelet",
    productHandle: "drift-bracelet",
    customer: "Aria F.",
    stars: 4,
    title: "Gorgeous, wish the toggle was sturdier",
    body:
      "The bracelet itself is everything I wanted. My only note: the toggle clasp pops open if I'm not careful. I added a small jump ring as a safety.",
    postedAt: "2026-05-05",
    channel: "shopify",
    status: "unhandled",
    flags: ["defective"]
  },
  {
    id: "r_009",
    product: "Lila Solitaire",
    productHandle: "lila-solitaire",
    customer: "Eve N.",
    stars: 5,
    title: "Customer service was outrageously good",
    body:
      "Needed a resize within the 60-day window. Email went out at 11pm, response by 8am, return label included. Got the resized ring back in 9 days.",
    postedAt: "2026-05-03",
    channel: "shopify",
    status: "unhandled",
    flags: ["praise", "service"]
  },
  {
    id: "r_010",
    product: "Field Emerald Necklace",
    productHandle: "field-emerald-necklace",
    customer: "Sage P.",
    stars: 5,
    title: "Worth the wait",
    body:
      "Was on backorder three weeks. The emerald is a deeper green than the photos suggest. The wait was worth it — but maybe set expectations on the product page?",
    postedAt: "2026-05-02",
    channel: "shopify",
    status: "unhandled",
    flags: ["praise"]
  }
];

export function sentimentBreakdown() {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  REVIEWS.forEach((r) => (counts[r.stars] += 1));
  return counts;
}

export function flaggedReviews() {
  return REVIEWS.filter((r) => r.flags.includes("urgent") || r.stars <= 2);
}
