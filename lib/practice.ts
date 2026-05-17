// Taz Brown Strategies' book of business. Each client sits on a rung of the
// red-teaming value ladder (see lib/redteam-knowledge.ts). In production this
// is a CRM/Postgres pull; here it's seeded so the practice dashboard tells a
// real story.

import { VALUE_LADDER } from "@/lib/redteam-knowledge";

export type LadderRung = 1 | 2 | 3 | 4;

export type Client = {
  id: string;
  name: string;
  sector: string;
  rung: LadderRung; // 1 Land · 2 Diagnose · 3 Cadence · 4 Install & Partner
  lastEngagement: string;
  monthly: number; // recurring fee; one-off Land work shows as 0 recurring
  health: "green" | "yellow" | "red";
  nextMove: string;
};

export const CLIENTS: Client[] = [
  {
    id: "c_northwind",
    name: "Northwind Robotics",
    sector: "Industrial automation · Series B",
    rung: 4,
    lastEngagement: "Standing red cell — chartered, CEO air cover, quarterly re-charter",
    monthly: 14000,
    health: "green",
    nextMove: "Two case studies cleared by legal — turn into referral intros at their investor's CEO summit."
  },
  {
    id: "c_meridian",
    name: "Meridian Health Group",
    sector: "Multi-site healthcare · PE-backed",
    rung: 3,
    lastEngagement: "Quarterly war-game on the roll-up thesis — Red cell played the regulator",
    monthly: 9000,
    health: "green",
    nextMove: "Roll-up integration is the irreversible bet — propose installing an internal red cell before the next acquisition closes."
  },
  {
    id: "c_atlas",
    name: "Atlas Freight",
    sector: "Logistics SaaS · bootstrapped",
    rung: 3,
    lastEngagement: "Quarterly Team B on the pricing-model change",
    monthly: 6500,
    health: "yellow",
    nextMove: "Founder skipped last quarter's session — re-anchor on the churn miss the red team called and they ignored."
  },
  {
    id: "c_solene",
    name: "Solène Beauty",
    sector: "DTC beauty · founder-led",
    rung: 2,
    lastEngagement: "Decision-quality audit — Groupthink scorecard + assumption table on last 3 bets",
    monthly: 4000,
    health: "green",
    nextMove: "The audit exposed a pattern of one-voice decisions — propose a quarterly cadence tied to their product calendar."
  },
  {
    id: "c_kvarn",
    name: "Kvarn Capital",
    sector: "Lower-middle-market PE",
    rung: 2,
    lastEngagement: "Premortem-as-diligence on a live acquisition",
    monthly: 3500,
    health: "green",
    nextMove: "They want this on every deal — package as a per-deal diligence red-team retainer (cadence rung)."
  },
  {
    id: "c_borealis",
    name: "Borealis Energy",
    sector: "Climate hardware · Series A",
    rung: 1,
    lastEngagement: "90-minute Key Assumptions Check on the go-to-market plan",
    monthly: 0,
    health: "green",
    nextMove: "Assumptions check found a fatal channel assumption — pitch the decision-quality audit on their last 3 bets."
  },
  {
    id: "c_harrow",
    name: "Harrow & Co.",
    sector: "Professional services · partnership",
    rung: 1,
    lastEngagement: "Live premortem on the new-office expansion",
    monthly: 0,
    health: "yellow",
    nextMove: "Managing partner loved the room but is price-sensitive — convert with the audit, not a war-game."
  }
];

const RUNG_LABEL: Record<LadderRung, string> = {
  1: VALUE_LADDER[0].rung,
  2: VALUE_LADDER[1].rung,
  3: VALUE_LADDER[2].rung,
  4: VALUE_LADDER[3].rung
};

export function rungLabel(r: LadderRung) {
  return RUNG_LABEL[r];
}

export function recurringARR() {
  return CLIENTS.reduce((s, c) => s + c.monthly * 12, 0);
}

export function clientsByRung() {
  return ([1, 2, 3, 4] as LadderRung[]).map((r) => ({
    rung: r,
    label: RUNG_LABEL[r],
    count: CLIENTS.filter((c) => c.rung === r).length
  }));
}

// Clients on a paid recurring relationship (Cadence + Install & Partner).
export function retainedCount() {
  return CLIENTS.filter((c) => c.rung >= 3).length;
}
