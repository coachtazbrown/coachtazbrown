// A fake "specialty retailer" used for the public Maya demo. The store is a
// premium-but-attainable jewelry brand — typical of the $1M–$5M Shopify
// merchants that are Retail Agent Co.'s ICP.

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  category: "rings" | "necklaces" | "earrings" | "bracelets" | "gift-cards";
  metal: "14k yellow gold" | "14k white gold" | "sterling silver" | "platinum" | null;
  stone: "diamond" | "sapphire" | "emerald" | "pearl" | "ruby" | "none";
  price: number;
  compareAtPrice: number | null;
  inStock: boolean;
  stockOnHand: number;
  description: string;
  tags: string[];
  occasions: string[];
};

export const STORE = {
  name: "Marlow & Hart",
  tagline: "Heirloom jewelry, made in small batches in Providence, RI.",
  hours: "Tues–Sat 11am–6pm ET, closed Sun & Mon",
  phone: "(401) 555-0142",
  returnPolicy:
    "30-day returns on unworn pieces in original packaging. Engraved or custom pieces are final sale. Free return shipping in the US.",
  shippingPolicy:
    "Free insured shipping on orders over $250 in the US. International ships via FedEx; duties calculated at checkout.",
  warranty:
    "Free resizing within 60 days. Lifetime cleaning and prong-tightening at our Providence atelier or by mail."
};

export const PRODUCTS: Product[] = [
  {
    id: "p_001",
    handle: "lila-solitaire",
    title: "Lila Solitaire — 0.5ct lab diamond",
    vendor: "Marlow & Hart",
    category: "rings",
    metal: "14k yellow gold",
    stone: "diamond",
    price: 1480,
    compareAtPrice: null,
    inStock: true,
    stockOnHand: 6,
    description:
      "A clean six-prong solitaire on a 1.8mm band. Lab-grown 0.5ct round, F color, VS1 clarity. Ships in 7–10 days.",
    tags: ["engagement", "everyday", "minimalist"],
    occasions: ["engagement", "anniversary"]
  },
  {
    id: "p_002",
    handle: "lila-solitaire-platinum",
    title: "Lila Solitaire — Platinum, 0.75ct",
    vendor: "Marlow & Hart",
    category: "rings",
    metal: "platinum",
    stone: "diamond",
    price: 2640,
    compareAtPrice: null,
    inStock: true,
    stockOnHand: 3,
    description:
      "The Lila in platinum with a 0.75ct lab diamond, E color, VVS2 clarity. Made to order in 2–3 weeks.",
    tags: ["engagement", "platinum", "made-to-order"],
    occasions: ["engagement"]
  },
  {
    id: "p_003",
    handle: "june-pearl-studs",
    title: "June Pearl Studs",
    vendor: "Marlow & Hart",
    category: "earrings",
    metal: "14k yellow gold",
    stone: "pearl",
    price: 220,
    compareAtPrice: 280,
    inStock: true,
    stockOnHand: 22,
    description: "6mm Akoya pearls on 14k yellow gold posts. The June stud is our most-gifted piece.",
    tags: ["gift", "bestseller", "under-250"],
    occasions: ["birthday", "graduation", "mothers-day"]
  },
  {
    id: "p_004",
    handle: "june-pearl-studs-silver",
    title: "June Pearl Studs — Silver",
    vendor: "Marlow & Hart",
    category: "earrings",
    metal: "sterling silver",
    stone: "pearl",
    price: 120,
    compareAtPrice: null,
    inStock: true,
    stockOnHand: 35,
    description: "The June studs in sterling silver — the same Akoya pearls, an entry-level price.",
    tags: ["gift", "under-150"],
    occasions: ["birthday", "graduation"]
  },
  {
    id: "p_005",
    handle: "hart-signet",
    title: "Hart Signet Ring",
    vendor: "Marlow & Hart",
    category: "rings",
    metal: "14k yellow gold",
    stone: "none",
    price: 640,
    compareAtPrice: null,
    inStock: true,
    stockOnHand: 11,
    description: "Cushion-top signet in 14k. Free engraving up to 3 characters. Ships in 7–10 days.",
    tags: ["engravable", "signature", "men"],
    occasions: ["graduation", "anniversary", "groomsmen"]
  },
  {
    id: "p_006",
    handle: "field-emerald-necklace",
    title: "Field Emerald Necklace",
    vendor: "Marlow & Hart",
    category: "necklaces",
    metal: "14k yellow gold",
    stone: "emerald",
    price: 980,
    compareAtPrice: null,
    inStock: false,
    stockOnHand: 0,
    description:
      "A single bezel-set 0.3ct Colombian emerald on a 16in cable chain. Restock expected in 3 weeks.",
    tags: ["everyday", "birthstone-may"],
    occasions: ["birthday", "anniversary"]
  },
  {
    id: "p_007",
    handle: "sapphire-eternity",
    title: "Cobalt Eternity Band",
    vendor: "Marlow & Hart",
    category: "rings",
    metal: "14k white gold",
    stone: "sapphire",
    price: 1980,
    compareAtPrice: null,
    inStock: true,
    stockOnHand: 4,
    description: "A full eternity of 1.4mm round Ceylon sapphires. Sizes 4 to 8.5 in stock.",
    tags: ["wedding-band", "stack", "birthstone-september"],
    occasions: ["wedding", "anniversary"]
  },
  {
    id: "p_008",
    handle: "drift-bracelet",
    title: "Drift Cable Bracelet",
    vendor: "Marlow & Hart",
    category: "bracelets",
    metal: "14k yellow gold",
    stone: "none",
    price: 410,
    compareAtPrice: null,
    inStock: true,
    stockOnHand: 18,
    description: "A 2.1mm cable bracelet with a hand-soldered toggle. 6.5in or 7.25in.",
    tags: ["everyday", "stack", "gift"],
    occasions: ["birthday", "anniversary"]
  },
  {
    id: "p_009",
    handle: "ruby-huggies",
    title: "Ember Ruby Huggies",
    vendor: "Marlow & Hart",
    category: "earrings",
    metal: "14k yellow gold",
    stone: "ruby",
    price: 380,
    compareAtPrice: null,
    inStock: true,
    stockOnHand: 14,
    description: "Pavé ruby huggies, 9mm. Sleep-in safe. The piece your mom won't take off.",
    tags: ["everyday", "gift", "birthstone-july"],
    occasions: ["mothers-day", "birthday"]
  },
  {
    id: "p_010",
    handle: "gift-card",
    title: "Marlow & Hart Gift Card",
    vendor: "Marlow & Hart",
    category: "gift-cards",
    metal: null,
    stone: "none",
    price: 100,
    compareAtPrice: null,
    inStock: true,
    stockOnHand: 9999,
    description:
      "Digital gift card delivered by email. Values from $50 to $2,500. Never expires.",
    tags: ["gift"],
    occasions: ["any"]
  }
];

export function searchProducts(opts: {
  query?: string;
  category?: Product["category"];
  maxPrice?: number;
  minPrice?: number;
  occasion?: string;
  inStockOnly?: boolean;
}): Product[] {
  const q = (opts.query || "").toLowerCase().trim();
  return PRODUCTS.filter((p) => {
    if (opts.category && p.category !== opts.category) return false;
    if (opts.maxPrice != null && p.price > opts.maxPrice) return false;
    if (opts.minPrice != null && p.price < opts.minPrice) return false;
    if (opts.inStockOnly && !p.inStock) return false;
    if (opts.occasion && !p.occasions.includes(opts.occasion)) return false;
    if (q) {
      const blob = [
        p.title,
        p.description,
        p.category,
        p.metal || "",
        p.stone,
        ...p.tags,
        ...p.occasions
      ]
        .join(" ")
        .toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  }).slice(0, 6);
}

export function getProduct(handle: string) {
  return PRODUCTS.find((p) => p.handle === handle || p.id === handle);
}
