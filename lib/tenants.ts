// In production these rows live in Postgres / Supabase keyed by storefront
// domain. For the MVP they're seeded so the operator dashboard tells a real
// story to a prospect during a sales call.

export type Plan = "Foundation" | "Growth" | "Command" | "Enterprise";

export type Tenant = {
  id: string;
  store: string;
  domain: string;
  vertical: string;
  plan: Plan;
  gmvBand: string;
  agents: string[];
  health: "green" | "yellow" | "red";
  metrics: {
    sessions30d: number;
    cvrLift: number;
    ticketsAutoresolved: number;
    revenueAttributed: number;
    monthlyFee: number;
  };
  notes: string;
};

export const TENANTS: Tenant[] = [
  {
    id: "t_westside",
    store: "Westside Hardware Co-op",
    domain: "westsidehardware.coop",
    vertical: "Multi-location hardware (12 stores)",
    plan: "Enterprise",
    gmvBand: "$18.4M",
    agents: ["maya", "rex", "echo", "sage", "pip", "vox", "atlas", "nova"],
    health: "green",
    metrics: {
      sessions30d: 38200,
      cvrLift: 9.8,
      ticketsAutoresolved: 1840,
      revenueAttributed: 184000,
      monthlyFee: 18000
    },
    notes: "Co-op of 12 stores. Performance kicker live on Nova + Maya. Annual prepaid."
  },
  {
    id: "t_marlow",
    store: "Marlow & Hart",
    domain: "marlowhart.com",
    vertical: "Jewelry",
    plan: "Command",
    gmvBand: "$3.2M",
    agents: ["maya", "echo", "sage", "nova", "pip", "rex", "vox", "atlas"],
    health: "green",
    metrics: {
      sessions30d: 12840,
      cvrLift: 13.1,
      ticketsAutoresolved: 421,
      revenueAttributed: 81400,
      monthlyFee: 8500
    },
    notes: "Pilot since Jan. Highest CVR lift in cohort. Reference customer."
  },
  {
    id: "t_hudson",
    store: "Hudson Optical",
    domain: "hudsonoptical.co",
    vertical: "Optical",
    plan: "Growth",
    gmvBand: "$1.8M",
    agents: ["maya", "vox", "atlas"],
    health: "green",
    metrics: {
      sessions30d: 6210,
      cvrLift: 8.4,
      ticketsAutoresolved: 188,
      revenueAttributed: 22300,
      monthlyFee: 3500
    },
    notes: "Vox handles 60% of after-hours calls. Books appointments straight to Calendly."
  },
  {
    id: "t_orchard",
    store: "Orchard Pet Co.",
    domain: "orchardpet.com",
    vertical: "Pet",
    plan: "Growth",
    gmvBand: "$2.4M",
    agents: ["maya", "rex", "echo", "sage"],
    health: "yellow",
    metrics: {
      sessions30d: 9410,
      cvrLift: 5.2,
      ticketsAutoresolved: 311,
      revenueAttributed: 17800,
      monthlyFee: 3500
    },
    notes: "Rex flagging frequent stockouts on a top SKU — supplier issue, not the agent."
  },
  {
    id: "t_brick",
    store: "Brick House Coffee Roasters",
    domain: "brickhousecoffee.com",
    vertical: "Food & Bev",
    plan: "Growth",
    gmvBand: "$1.6M",
    agents: ["maya", "nova", "echo"],
    health: "green",
    metrics: {
      sessions30d: 7330,
      cvrLift: 11.3,
      ticketsAutoresolved: 142,
      revenueAttributed: 19100,
      monthlyFee: 3500
    },
    notes: "Nova cut Meta CAC from $34 to $24 in 6 weeks."
  },
  {
    id: "t_kestrel",
    store: "Kestrel Climbing",
    domain: "kestrelclimbing.co",
    vertical: "Outdoor",
    plan: "Foundation",
    gmvBand: "$1.1M",
    agents: ["maya", "sage"],
    health: "green",
    metrics: {
      sessions30d: 4120,
      cvrLift: 9.7,
      ticketsAutoresolved: 96,
      revenueAttributed: 9800,
      monthlyFee: 1500
    },
    notes: "Sage rewrote 240 product pages in week one. Search Console clicks +18%."
  },
  {
    id: "t_atelier",
    store: "Atelier Foglio Stationery",
    domain: "atelierfoglio.com",
    vertical: "Gift / Stationery",
    plan: "Foundation",
    gmvBand: "$0.9M",
    agents: ["maya", "echo"],
    health: "yellow",
    metrics: {
      sessions30d: 3050,
      cvrLift: 6.2,
      ticketsAutoresolved: 64,
      revenueAttributed: 5400,
      monthlyFee: 1500
    },
    notes: "Small catalog — ROI thin. Upsell Sage to widen lift."
  }
];

export function getTenant(id: string) {
  return TENANTS.find((t) => t.id === id);
}

export function totalARR() {
  return TENANTS.reduce((s, t) => s + t.metrics.monthlyFee * 12, 0);
}

export function totalAttributedRevenue30d() {
  return TENANTS.reduce((s, t) => s + t.metrics.revenueAttributed, 0);
}

// Average Growth-tier annual contract value. Used by the dashboard to estimate
// how many more Growth customers it takes to hit the $1M ARR goal.
export const GROWTH_TIER_ACV = 3500 * 12;
