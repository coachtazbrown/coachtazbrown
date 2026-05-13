import { DEMO_MODE, MODEL, anthropic, extractText } from "@/lib/anthropic";
import { getProduct } from "@/lib/store-catalog";
import type { ListingDraft } from "@/lib/sage-data";

export type SageRewrite = {
  title: string;
  description: string;
  altText: string;
  seoMetaDescription: string;
  jsonLdSchema: string;
  notes: string;
};

const SYSTEM = `You are Sage, the AI Listings & SEO agent for Marlow & Hart — a small-batch jewelry brand in Providence, RI.
Your job: rewrite a weak product listing into one that converts and ranks, in the brand's voice.

Brand voice for Marlow & Hart: warm, confident, a little poetic — never gushing, never salesy. Speak as "we." Specific details over adjectives. No emojis. No exclamation marks.

Rules:
- Title: 5–9 words. Include the piece name + one differentiating spec (metal, stone, carat).
- Description: 60–100 words, two paragraphs. First paragraph the story; second the specs (metal, stone, dimensions, lead time). Never invent specs you weren't given — pull from product_facts only.
- Alt text: 8–14 words, descriptive for accessibility AND keyword-relevant.
- SEO meta description: 140–155 characters, ends with a soft CTA fragment.
- JSON-LD: a valid Product schema as a single-line JSON string (no markdown fences). Include name, description, brand, sku, offers.price, offers.priceCurrency=USD, offers.availability.
- Notes: one short sentence telling the operator what changed and why.

Return STRICT JSON only, no markdown fences:
{
  "title": "string",
  "description": "string",
  "altText": "string",
  "seoMetaDescription": "string",
  "jsonLdSchema": "string (single-line JSON)",
  "notes": "string"
}`;

function demoRewrite(listing: ListingDraft): SageRewrite {
  const fact = getProduct(listing.handle);
  const price = fact?.price ?? 0;
  switch (listing.handle) {
    case "lila-solitaire":
      return {
        title: "Lila Solitaire — 14k Yellow Gold, 0.5ct Lab Diamond",
        description:
          "The Lila is our quietest engagement ring — a six-prong solitaire on a 1.8mm band that wears like an everyday piece and reads, across a room, as something more.\n\nMade in 14k yellow gold with a lab-grown 0.5ct round diamond (F color, VS1 clarity). Ships in 7–10 days. Free resizing within 60 days and lifetime cleaning at our Providence atelier.",
        altText: "Lila Solitaire engagement ring in 14k yellow gold with 0.5ct lab diamond",
        seoMetaDescription:
          "The Lila Solitaire — a six-prong 14k yellow gold engagement ring with a 0.5ct lab diamond. Hand-finished in Providence, RI.",
        jsonLdSchema: `{"@context":"https://schema.org","@type":"Product","name":"Lila Solitaire — 0.5ct Lab Diamond","brand":{"@type":"Brand","name":"Marlow & Hart"},"sku":"lila-solitaire","description":"Six-prong solitaire engagement ring in 14k yellow gold with a 0.5ct lab diamond.","offers":{"@type":"Offer","price":"${price}","priceCurrency":"USD","availability":"https://schema.org/InStock"}}`,
        notes:
          "Tightened title with metal + carat; rewrote description in brand voice; added schema and alt text."
      };
    case "june-pearl-studs":
      return {
        title: "June Pearl Studs — 6mm Akoya, 14k Yellow Gold",
        description:
          "Our most-gifted piece for a reason. The June stud pairs a single 6mm Akoya pearl with a 14k yellow gold post — the kind of earring that quietly outlasts the rest of the jewelry box.\n\nMade in 14k yellow gold with cultured Akoya pearls. Ships in 2–3 days, gift-wrapped on request, with a handwritten note if you'd like.",
        altText: "June pearl stud earrings, 6mm Akoya pearl on 14k yellow gold post",
        seoMetaDescription:
          "June Pearl Studs — 6mm Akoya pearls on 14k yellow gold posts. The most-gifted piece from Marlow & Hart.",
        jsonLdSchema: `{"@context":"https://schema.org","@type":"Product","name":"June Pearl Studs","brand":{"@type":"Brand","name":"Marlow & Hart"},"sku":"june-pearl-studs","description":"6mm Akoya pearl studs on 14k yellow gold posts.","offers":{"@type":"Offer","price":"${price}","priceCurrency":"USD","availability":"https://schema.org/InStock"}}`,
        notes: "Reframed as gift hero; led with the 6mm spec; added schema."
      };
    case "hart-signet":
      return {
        title: "Hart Signet Ring — 14k Yellow Gold, Engravable",
        description:
          "A signet shouldn't shout. The Hart is a cushion-top in solid 14k yellow gold, weighted enough to feel like an heirloom and small enough to wear next to the rest of your stack.\n\nUp to three characters engraved free in our Providence atelier. Available in sizes 5 to 13. Ships in 7–10 days; engraved pieces are final sale.",
        altText: "Hart Signet ring in 14k yellow gold, cushion top, engravable",
        seoMetaDescription:
          "Hart Signet — a 14k yellow gold cushion-top signet ring with free engraving up to 3 characters. From Marlow & Hart.",
        jsonLdSchema: `{"@context":"https://schema.org","@type":"Product","name":"Hart Signet Ring","brand":{"@type":"Brand","name":"Marlow & Hart"},"sku":"hart-signet","description":"Cushion-top signet ring in solid 14k yellow gold, free engraving up to 3 characters.","offers":{"@type":"Offer","price":"${price}","priceCurrency":"USD","availability":"https://schema.org/InStock"}}`,
        notes: "Added 'engravable' to title; called out lead time + final-sale rule."
      };
    case "sapphire-eternity":
      return {
        title: "Cobalt Eternity Band — 14k White Gold, Ceylon Sapphires",
        description:
          "An unbroken circle of 1.4mm round Ceylon sapphires set into 14k white gold — quiet enough for a wedding band, sturdy enough to wear every day.\n\nAvailable in sizes 4 to 8.5. Ships in 5–7 days. Free resizing within 60 days; lifetime prong-tightening at our Providence atelier.",
        altText: "Cobalt eternity band with 1.4mm Ceylon sapphires in 14k white gold",
        seoMetaDescription:
          "Cobalt Eternity Band — a full eternity of 1.4mm Ceylon sapphires in 14k white gold. Wedding-band weight, daily wear.",
        jsonLdSchema: `{"@context":"https://schema.org","@type":"Product","name":"Cobalt Eternity Band","brand":{"@type":"Brand","name":"Marlow & Hart"},"sku":"sapphire-eternity","description":"Full eternity band of 1.4mm Ceylon sapphires in 14k white gold.","offers":{"@type":"Offer","price":"${price}","priceCurrency":"USD","availability":"https://schema.org/InStock"}}`,
        notes: "Named the stone origin (Ceylon); pulled in resizing perk."
      };
    case "ruby-huggies":
      return {
        title: "Ember Ruby Huggies — 14k Yellow Gold, Pavé Set",
        description:
          "The earring you forget you're wearing. Nine-millimeter huggies pavé-set with rubies, in 14k yellow gold — sleep-safe, shower-safe, gym-safe.\n\nMade in our Providence atelier. Ships in 3–5 days. Free polishing for life.",
        altText: "Ember ruby huggie earrings, 9mm pavé-set rubies in 14k yellow gold",
        seoMetaDescription:
          "Ember Ruby Huggies — 9mm pavé ruby huggies in 14k yellow gold. Sleep-safe, daily-wear, from Marlow & Hart.",
        jsonLdSchema: `{"@context":"https://schema.org","@type":"Product","name":"Ember Ruby Huggies","brand":{"@type":"Brand","name":"Marlow & Hart"},"sku":"ruby-huggies","description":"Pavé ruby huggie earrings, 9mm, in 14k yellow gold.","offers":{"@type":"Offer","price":"${price}","priceCurrency":"USD","availability":"https://schema.org/InStock"}}`,
        notes: "Led with the 'forget you're wearing it' angle; added daily-wear positioning."
      };
    case "drift-bracelet":
      return {
        title: "Drift Cable Bracelet — 2.1mm, 14k Yellow Gold",
        description:
          "The bracelet you put on once and never take off. A 2.1mm cable chain in 14k yellow gold, finished with a hand-soldered toggle that holds its shape.\n\nAvailable in 6.5in and 7.25in. Ships in 3–5 days. Free lifetime polishing and prong-checks at our Providence atelier.",
        altText: "Drift cable chain bracelet, 2.1mm, 14k yellow gold with toggle clasp",
        seoMetaDescription:
          "Drift Cable Bracelet — a 2.1mm 14k yellow gold cable chain with a hand-soldered toggle clasp. Daily-wear from Marlow & Hart.",
        jsonLdSchema: `{"@context":"https://schema.org","@type":"Product","name":"Drift Cable Bracelet","brand":{"@type":"Brand","name":"Marlow & Hart"},"sku":"drift-bracelet","description":"2.1mm cable chain bracelet in 14k yellow gold with a hand-soldered toggle.","offers":{"@type":"Offer","price":"${price}","priceCurrency":"USD","availability":"https://schema.org/InStock"}}`,
        notes: "Surfaced the toggle detail; gave both lengths; added schema."
      };
    default:
      return {
        title: listing.before.title,
        description: listing.before.description,
        altText: listing.before.title,
        seoMetaDescription: listing.before.description.slice(0, 150),
        jsonLdSchema: `{"@type":"Product","name":"${listing.before.title}"}`,
        notes: "Demo fallback — no canned rewrite for this handle."
      };
  }
}

export async function rewriteListing(listing: ListingDraft): Promise<SageRewrite> {
  if (DEMO_MODE) return demoRewrite(listing);

  const fact = getProduct(listing.handle);
  const product_facts = {
    handle: listing.handle,
    category: listing.category,
    tags: listing.tags,
    metal: fact?.metal,
    stone: fact?.stone,
    price: fact?.price,
    stockOnHand: fact?.stockOnHand,
    inStock: fact?.inStock,
    short: fact?.description
  };

  const userBlock = `Current listing (weak):
- Title: ${listing.before.title}
- Description: ${listing.before.description}

product_facts (these are the only specs you may use — never invent):
${JSON.stringify(product_facts, null, 2)}

Rewrite the listing now. Return JSON only.`;

  const res = await anthropic().messages.create({
    model: MODEL,
    max_tokens: 1200,
    system: SYSTEM,
    messages: [{ role: "user", content: userBlock }]
  });
  const text = extractText(res);
  try {
    return JSON.parse(text) as SageRewrite;
  } catch {
    return demoRewrite(listing);
  }
}
