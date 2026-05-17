export type Agent = {
  slug: string;
  name: string;
  role: string;
  tagline: string;
  description: string;
  replaces: string;
  wedgeMetric: string;
  startsAt: number;
  integrations: string[];
  bullets: string[];
  status: "live" | "beta" | "waitlist";
  color: string;
};

export const AGENTS: Agent[] = [
  {
    slug: "maya",
    name: "Maya",
    role: "Storefront Concierge",
    tagline: "The sales associate who never sleeps and reads every product card.",
    description:
      "Maya chats with every visitor on your store, asks the right questions, recommends the right product, handles WISMO, returns, and sizing — and quietly hands off to a human when she should.",
    replaces: "Live chat tool + a part-time sales associate ($2,400/mo)",
    wedgeMetric: "+12% conversion on chat sessions",
    startsAt: 1500,
    integrations: ["Shopify", "Klaviyo", "Gorgias", "Recharge"],
    bullets: [
      "Reads your catalog every 6 hours and learns new arrivals",
      "Answers in your brand voice with examples you control",
      "Books appointments for high-AOV stores (jewelers, furniture)",
      "Hands off to a human in Slack the moment confidence drops"
    ],
    status: "live",
    color: "bg-accent/10 text-accent"
  },
  {
    slug: "rex",
    name: "Rex",
    role: "Re-order & Demand Analyst",
    tagline: "Knows what's about to sell out before your supplier does.",
    description:
      "Rex watches velocity, lead times, and seasonality across your SKUs, drafts purchase orders, and pings you on Slack when a top mover is about to stock out.",
    replaces: "An inventory analyst ($5,500/mo) or a $400/mo planning tool",
    wedgeMetric: "−30% stockouts, −18% dead stock",
    startsAt: 1500,
    integrations: ["Shopify", "Square", "Lightspeed", "Cin7"],
    bullets: [
      "Daily forecast per SKU, per location",
      "Drafts POs you can approve in one click",
      "Flags new bestsellers within 7 days of launch",
      "Alerts on slow movers so you can mark down early"
    ],
    status: "beta",
    color: "bg-sage/15 text-sage"
  },
  {
    slug: "nova",
    name: "Nova",
    role: "Ad Spend Optimizer",
    tagline: "Fires the freelancer running your Meta and Google ads.",
    description:
      "Nova reads campaign performance every morning, kills losing ads, scales winners, and drafts new creative briefs based on what's actually converting on your store.",
    replaces: "A media buyer or agency retainer ($1,500–$4,000/mo)",
    wedgeMetric: "−25% CAC in 60 days or your money back",
    startsAt: 1500,
    integrations: ["Meta Ads", "Google Ads", "TikTok Ads", "GA4", "Shopify"],
    bullets: [
      "Reallocates budget across campaigns daily",
      "Drafts ad copy + image prompts from your bestsellers",
      "Flags ad fatigue before CTR collapses",
      "Weekly plain-English report you can forward to your bookkeeper"
    ],
    status: "beta",
    color: "bg-accent2/30 text-ink"
  },
  {
    slug: "echo",
    name: "Echo",
    role: "Reviews & Reputation",
    tagline: "Turns happy customers into 5-star reviews, automatically.",
    description:
      "Echo asks for reviews at the right moment, responds to every public review in your brand voice, and DMs you the moment a 1-star lands so you can fix it before it spreads.",
    replaces: "Yotpo + a VA in the Philippines ($800/mo)",
    wedgeMetric: "+40 reviews/month average across pilots",
    startsAt: 1500,
    integrations: ["Shopify", "Google Business", "Yelp", "Trustpilot"],
    bullets: [
      "Per-product review request flows",
      "Replies drafted in your voice, you approve in one tap",
      "Sentiment dashboard that finally tells you which SKU sucks",
      "Automatic dispute drafts for unfair 1-stars"
    ],
    status: "live",
    color: "bg-accent/10 text-accent"
  },
  {
    slug: "sage",
    name: "Sage",
    role: "Listings & SEO",
    tagline: "Writes 100 product pages a day in your brand voice.",
    description:
      "Sage rewrites titles, descriptions, alt text, JSON-LD, and metafields across your catalog. Plugs into your existing taxonomy and your brand guide.",
    replaces: "A copywriter + an SEO agency ($3,000/mo combined)",
    wedgeMetric: "+22% organic clicks in 90 days",
    startsAt: 1500,
    integrations: ["Shopify", "Webflow", "WooCommerce", "Search Console"],
    bullets: [
      "Bulk-rewrite by collection, category, or tag",
      "Brand voice locked from a style guide you upload",
      "Schema markup added automatically",
      "Diff view before any change goes live"
    ],
    status: "live",
    color: "bg-sage/15 text-sage"
  },
  {
    slug: "pip",
    name: "Pip",
    role: "Customer Service",
    tagline: "Closes 70% of tickets before a human reads them.",
    description:
      "Pip answers WISMO, processes returns, issues store credit within your policy, escalates the rest with a full summary and suggested reply.",
    replaces: "Gorgias auto-responder + the agent on top of it",
    wedgeMetric: "70% one-touch resolution rate",
    startsAt: 1500,
    integrations: ["Shopify", "Gorgias", "Zendesk", "Front", "Help Scout"],
    bullets: [
      "Refunds within policy — no human touch",
      "Address changes, order edits, exchanges",
      "Multi-language (EN, ES, FR, DE, PT)",
      "Confidence-based handoff with full context"
    ],
    status: "live",
    color: "bg-accent/10 text-accent"
  },
  {
    slug: "vox",
    name: "Vox",
    role: "Voice Receptionist",
    tagline: "Answers the phone at 9pm so you can eat dinner.",
    description:
      "Vox picks up your store line, answers hours/location/availability questions, books appointments, and texts you a transcript of every call.",
    replaces: "An answering service ($300–$800/mo) or missed calls",
    wedgeMetric: "94% of calls answered after-hours",
    startsAt: 1500,
    integrations: ["Twilio", "Google Business", "Calendly", "Square Appointments"],
    bullets: [
      "Custom phone number or port your existing one",
      "Real-time transcript and summary in your inbox",
      "Books appointments straight into your calendar",
      "Knows your hours, holidays, and return policy"
    ],
    status: "waitlist",
    color: "bg-accent2/30 text-ink"
  },
  {
    slug: "atlas",
    name: "Atlas",
    role: "Local SEO & Google Business",
    tagline: "Drags you into the top-3 map pack and keeps you there.",
    description:
      "Atlas posts to Google Business, answers questions on your listing, monitors competitors, and tells you exactly which keywords to chase next month.",
    replaces: "A local SEO agency ($1,200/mo)",
    wedgeMetric: "Top-3 map pack within 90 days for 4 of 5 pilots",
    startsAt: 1500,
    integrations: ["Google Business", "Apple Maps", "Bing Places", "Yelp"],
    bullets: [
      "Weekly Google posts with seasonal hooks",
      "Q&A answered within an hour",
      "Citation building across 40+ directories",
      "Competitor rank tracking by ZIP"
    ],
    status: "live",
    color: "bg-sage/15 text-sage"
  },
  {
    slug: "redteam",
    name: "Red Teaming Partner",
    role: "Strategy Red-Team Coach",
    tagline: "Stress-tests the plan before reality does — and turns every finding into your next engagement.",
    description:
      "Taz Brown's AI business partner for the red-teaming practice. It tells you exactly which adversarial move to run on a client's strategy, how to facilitate it without becoming the consultant who has all the answers, and how each exercise ladders into a retained Taz Brown Strategies relationship.",
    replaces: "An external strategy consultant on retainer ($8,000/mo)",
    wedgeMetric: "Kills ~1 in 3 doomed initiatives before launch",
    startsAt: 1500,
    integrations: ["Notion", "Slack", "Google Docs", "Miro"],
    bullets: [
      "The full red-teaming canon, 1587 → today, on call in the room",
      "Ready-to-run premortem and assumption-check facilitation scripts",
      "Coaches you to coach the client — never hands over the answer",
      "Every recommendation ends at the next paid step on the value ladder"
    ],
    status: "live",
    color: "bg-accent/10 text-accent"
  }
];

export function getAgent(slug: string) {
  return AGENTS.find((a) => a.slug === slug);
}
