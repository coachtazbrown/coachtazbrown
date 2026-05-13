// Deliberately-weak product listings used by the Sage demo. Represents what
// you'd find on a $1M–$5M Shopify store before a copywriter has gotten to it:
// short titles, dropshipper-style descriptions, missing alt text, no schema.

export type ListingDraft = {
  handle: string;
  category: string;
  tags: string[];
  before: {
    title: string;
    description: string;
    altText: string | null;
    seoMetaDescription: string | null;
  };
};

export const LISTINGS: ListingDraft[] = [
  {
    handle: "lila-solitaire",
    category: "rings",
    tags: ["engagement", "minimalist", "lab-diamond"],
    before: {
      title: "Solitaire Ring 0.5ct",
      description: "Pretty 14k yellow gold ring with a 0.5ct lab diamond. Six prong setting. Beautiful piece.",
      altText: null,
      seoMetaDescription: null
    }
  },
  {
    handle: "june-pearl-studs",
    category: "earrings",
    tags: ["gift", "bestseller", "pearl"],
    before: {
      title: "Pearl Studs Gold",
      description: "Pearl earrings 14k gold. 6mm. Gift idea.",
      altText: null,
      seoMetaDescription: null
    }
  },
  {
    handle: "hart-signet",
    category: "rings",
    tags: ["engravable", "signature", "men"],
    before: {
      title: "Signet Ring (Engravable)",
      description: "Yellow gold signet ring. Cushion top. You can engrave up to 3 letters. Ships in 7-10 days.",
      altText: null,
      seoMetaDescription: null
    }
  },
  {
    handle: "sapphire-eternity",
    category: "rings",
    tags: ["wedding-band", "stack", "sapphire"],
    before: {
      title: "Eternity Band Blue",
      description: "Full eternity of small blue sapphires. White gold. Sizes 4-8.5.",
      altText: null,
      seoMetaDescription: null
    }
  },
  {
    handle: "ruby-huggies",
    category: "earrings",
    tags: ["everyday", "gift", "ruby"],
    before: {
      title: "Ruby Huggie Earrings",
      description: "Small ruby huggie hoops, 9mm. Pavé. Yellow gold. Sleep-safe.",
      altText: null,
      seoMetaDescription: null
    }
  },
  {
    handle: "drift-bracelet",
    category: "bracelets",
    tags: ["everyday", "stack", "gift"],
    before: {
      title: "Gold Cable Bracelet",
      description: "Cable chain bracelet. Toggle clasp. 14k yellow gold. Two sizes.",
      altText: null,
      seoMetaDescription: null
    }
  }
];

export function getListing(handle: string) {
  return LISTINGS.find((l) => l.handle === handle);
}
