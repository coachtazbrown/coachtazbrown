// The body of knowledge the Red Teaming Partner draws on, ordered earliest →
// latest exactly as Taz asked. This is the agent's spine: every recommendation,
// premortem, and stress test it gives Taz traces back to one of these entries.
//
// Three lineages, each chronological:
//   RED_TEAM_LINEAGE  — adversarial / structured-analytic thinking, 1587 → today
//   COACHING_LINEAGE  — how you draw the answer out of a client vs. hand it over
//   THINKING_MODELS   — the cognitive scaffolding underneath both
//
// In production this becomes a retrievable corpus (one row per technique with
// embeddings). For now it's a typed constant so the agent — and its demo-mode
// fallback — can reason over it without a vector store.

export type RedTeamTechnique = {
  id: string;
  name: string;
  era: string; // when it entered the canon
  lineage: string; // who/what it descends from
  premise: string; // the one idea it rests on
  whenToUse: string; // the client situation that calls for it
  howToRun: string[]; // the steps Taz walks the client through
  unlockingQuestion: string; // the question that does the real work
  failureModes: string[]; // how it gets faked or fumbled
  coachingMove: string; // how Taz facilitates rather than lectures
  engagementHook: string; // how this exercise becomes paid Taz Brown Strategies work
};

// ── RED TEAMING, earliest → latest ────────────────────────────────────────────
export const RED_TEAM_LINEAGE: RedTeamTechnique[] = [
  {
    id: "advocatus-diaboli",
    name: "Devil's Advocate",
    era: "1587",
    lineage:
      "Office of the Promotor Fidei, instituted by Sixtus V. The Church paid one canon lawyer to argue against every proposed sainthood so belief had to survive an opponent.",
    premise:
      "A claim nobody is paid to attack has not actually been tested — it has only been agreed with.",
    whenToUse:
      "A client's leadership team reaches consensus fast, or the founder is in love with the plan. Speed of agreement is the warning sign, not slowness.",
    howToRun: [
      "Name one person (rotate it) whose only job for this meeting is to make the strongest possible case against the plan.",
      "Give them the data and an hour before the room, not five minutes inside it.",
      "Require the rest of the room to steelman the objection back before anyone rebuts it.",
      "Record which objections were answered with evidence and which with status or volume."
    ],
    unlockingQuestion:
      "If you were a competitor being paid to kill this plan, what is the first thing you'd attack — and why is that not on our risk list?",
    failureModes: [
      "The advocate is junior and the plan's owner is in the room — dissent gets socially taxed.",
      "It becomes theatre: a 'devil' who already knows the verdict is rehearsed agreement.",
      "Run once at the end as a box-check instead of before the decision is reversible."
    ],
    coachingMove:
      "Don't be the devil yourself — assign it and protect the person in the role out loud. Your value to the client is making dissent safe and rotating, not being the smartest skeptic.",
    engagementHook:
      "Position the rotating-advocate ritual as a retained 'decision quality' practice — a quarterly cadence Taz Brown Strategies installs and facilitates, not a one-off workshop."
  },
  {
    id: "dialectical-inquiry",
    name: "Dialectical Inquiry",
    era: "early 1800s (Hegel) → 1970s (Mason & Mitroff bring it to strategy)",
    lineage:
      "Hegelian thesis–antithesis–synthesis, formalized for boardrooms by Mason and Mitroff's work on 'wicked' strategic problems.",
    premise:
      "Don't debate a plan against nothing. Build an explicit counter-plan from the opposite assumptions and force a synthesis.",
    whenToUse:
      "The client has exactly one strategy on the table and the debate is plan-vs-objections. Convert it to plan-vs-plan.",
    howToRun: [
      "Surface the assumptions under Plan A in plain language ('the market wants X', 'we can hire Y by Q3').",
      "Negate each one and build Plan B that is internally coherent under the negated assumptions.",
      "Have two sub-teams argue both, then force a third option that survives both assumption sets.",
      "The deliverable is the assumption table, not the winner."
    ],
    unlockingQuestion:
      "What would have to be true for the opposite strategy to be the obviously correct one?",
    failureModes: [
      "Plan B is built as a strawman so Plan A wins — the synthesis is then fake.",
      "The team debates conclusions instead of the assumptions underneath them."
    ],
    coachingMove:
      "Coach the client to fall in love with the assumption table, not with a plan. That table is the reusable asset; the chosen plan is disposable.",
    engagementHook:
      "The assumption table is a tangible artifact you can re-run every quarter — sell it as 'strategy under audit', a recurring scope rather than a slide."
  },
  {
    id: "kriegsspiel-wargaming",
    name: "War-Gaming (Kriegsspiel)",
    era: "1812 (Prussian Army) → 1950s (RAND brings it to policy & business)",
    lineage:
      "Von Reisswitz's Kriegsspiel: a live red cell playing the adversary on a map with a referee adjudicating moves. RAND adapted it for strategy.",
    premise:
      "Static plans assume a passive opponent. A live opponent who gets to move back exposes what the plan can't survive.",
    whenToUse:
      "Competitive launches, pricing moves, M&A, or anything where a rival, regulator, or activist customer will react to your client's move.",
    howToRun: [
      "Cast a Red cell (the competitor/regulator/market) and a Blue cell (the client).",
      "Blue makes a move; Red responds with their most rational counter, not their nicest one.",
      "A neutral 'White' referee adjudicates plausibility and time.",
      "Run 3 moves deep. The insight is almost always in move 2 or 3, never move 1."
    ],
    unlockingQuestion:
      "Our competitor wakes up the morning after our launch — what's the cheapest move that makes our plan irrelevant?",
    failureModes: [
      "Red plays to lose because they work for Blue in real life — rotate in outsiders or give Red a real incentive to win.",
      "Stopping at move 1, where the plan still looks fine."
    ],
    coachingMove:
      "Your job is the White referee: keep Red honest and keep Blue from arguing instead of adapting. Facilitation is the skill the client can't buy in-house.",
    engagementHook:
      "War-games are high-ceremony, high-margin. Sell them as quarterly competitive war-rooms tied to the client's actual roadmap milestones."
  },
  {
    id: "groupthink-remedies",
    name: "Groupthink Diagnosis & Remedies",
    era: "1972 (Janis)",
    lineage:
      "Irving Janis's autopsy of the Bay of Pigs: cohesive teams suppress dissent to preserve harmony and produce confidently wrong decisions.",
    premise:
      "The risk isn't a bad analyst — it's a good team that has quietly made disagreement socially expensive.",
    whenToUse:
      "Tight, long-tenured leadership teams; founder-led companies; any room where the most senior person speaks first.",
    howToRun: [
      "Score the room against Janis's symptoms: illusion of invulnerability, self-censorship, mindguards, pressure on dissenters.",
      "Install structural fixes: leader states views last, anonymous pre-reads, an assigned dissent role, a second-chance meeting.",
      "Re-measure after two decision cycles."
    ],
    unlockingQuestion:
      "When did someone in this room last change a major decision because of an objection — and what happened to the person who raised it?",
    failureModes: [
      "Treating it as a personality problem rather than a structure problem.",
      "Adding rituals without removing the social cost of dissent."
    ],
    coachingMove:
      "Diagnose the structure, never the people, out loud. Clients defend their team and fire their consultant if you make it about character.",
    engagementHook:
      "The Janis symptom scorecard is a clean diagnostic deliverable — the wedge that opens a retained decision-hygiene engagement."
  },
  {
    id: "team-b",
    name: "Team A / Team B",
    era: "1976 (CIA, the 'Team B' competitive estimate)",
    lineage:
      "An outside team given the same raw data and told to reach an independent estimate, surfacing how much of 'the analysis' was actually shared assumption.",
    premise:
      "Two teams on the same evidence reaching different conclusions reveals where the conclusion came from assumptions, not data.",
    whenToUse:
      "High-stakes, low-reversibility bets (a pivot, a raise, a category entry) where the client has one internal narrative.",
    howToRun: [
      "Team B gets the same data, isolated from Team A's reasoning, and produces its own forecast.",
      "Compare divergence points, not conclusions — every divergence is an untested assumption.",
      "Adjudicate which assumptions are checkable now and check them before deciding."
    ],
    unlockingQuestion:
      "If a sharp team with no stake in this saw only our data and not our story, where would they land — and why exactly there?",
    failureModes: [
      "Team B is staffed with people who already agree with Team A.",
      "Politicized: the exercise is used to ratify a conclusion leadership already wants (the historical critique of the original Team B)."
    ],
    coachingMove:
      "Coach the client on the original's failure too — it's more credible, and it teaches them red teaming is a method, not a verdict.",
    engagementHook:
      "Taz Brown Strategies is the credible external Team B. That's a recurring, premium role no internal team can fill for itself."
  },
  {
    id: "key-assumptions-check",
    name: "Key Assumptions Check",
    era: "1999 (Heuer, Psychology of Intelligence Analysis) → 2009 (Heuer & Pherson, Structured Analytic Techniques)",
    lineage:
      "Richards Heuer's structured analytic techniques: list every assumption the judgment rests on, then rate each for confidence and consequence-if-wrong.",
    premise:
      "Most strategy failures are not bad logic on good assumptions — they're sound logic on one unexamined assumption.",
    whenToUse:
      "Always, and first. It's the cheapest, fastest red-team move and the foundation the others build on.",
    howToRun: [
      "Write every assumption the plan depends on as a falsifiable sentence.",
      "For each: how confident are we (high/med/low) and how bad is it if it's wrong (high/med/low)?",
      "The low-confidence / high-consequence cell is the entire game. Everything else is noise.",
      "Convert each red-cell item into a cheap test runnable before the decision is locked."
    ],
    unlockingQuestion:
      "Which single assumption, if it turned out false, would take the whole plan down with it — and what would it cost us to check it this week?",
    failureModes: [
      "Listing risks instead of assumptions (risks are external; assumptions are beliefs you're choosing).",
      "Stopping at the list instead of converting the dangerous cell into a test."
    ],
    coachingMove:
      "Make the client write the assumptions in their own words. The moment they say one out loud and hear how thin it is — that's the coaching, not your commentary.",
    engagementHook:
      "This is your land-and-expand: a 90-minute Key Assumptions Check is a low-friction paid pilot that almost always exposes work worth a retainer."
  },
  {
    id: "ach",
    name: "Analysis of Competing Hypotheses",
    era: "1999 (Heuer)",
    lineage:
      "Heuer again: instead of building a case for the favored answer, list all hypotheses and seek evidence that disconfirms each.",
    premise:
      "We instinctively gather evidence for the answer we like. Disconfirmation is the only evidence that actually discriminates.",
    whenToUse:
      "Diagnosis-type questions: 'why is retention dropping', 'why did the launch miss' — where the client has already picked a favorite cause.",
    howToRun: [
      "List every plausible hypothesis, including the unflattering ones.",
      "Build a matrix: rows = evidence, columns = hypotheses; mark whether each piece is consistent or inconsistent with each.",
      "The surviving hypothesis is the one with the least disconfirming evidence — not the most supporting.",
      "Act on what would change your mind, not on what confirms you."
    ],
    unlockingQuestion:
      "What evidence would prove your preferred explanation wrong — and have we actually gone looking for it?",
    failureModes: [
      "Only listing hypotheses leadership can stomach.",
      "Counting confirming evidence (cheap and abundant) instead of weighing disconfirming evidence (rare and decisive)."
    ],
    coachingMove:
      "Resist supplying the answer even when you see it. Hand them the matrix and let the empty 'disconfirming' column do the teaching.",
    engagementHook:
      "ACH on a painful past miss is a powerful proof-of-value session — it earns the right to run it forward on the next big bet."
  },
  {
    id: "premortem",
    name: "The Premortem",
    era: "2007 (Gary Klein, Harvard Business Review)",
    lineage:
      "Klein's inversion of the postmortem and applied prospective hindsight: assume the failure has happened, then explain it.",
    premise:
      "People who can't voice doubt about a live plan become fluent the instant failure is treated as a fact.",
    whenToUse:
      "Right before a plan is committed and while it's still cheap to change — the single highest-ROI red-team move you can teach a client.",
    howToRun: [
      "'It's 18 months from now. This plan has failed completely. It's a disaster.' State it as fact, not risk.",
      "Every person writes, silently and alone, 2 minutes: every reason it failed.",
      "Round-robin one reason each, no debate, until the list is exhausted.",
      "Cluster, then pick the 2–3 the team can de-risk now, and assign owners before anyone leaves."
    ],
    unlockingQuestion:
      "It's failed. We all know it failed. Now — what's the most embarrassing reason, the one nobody wanted to say first?",
    failureModes: [
      "Framed as a risk workshop ('what could go wrong') — that reactivates the optimism it's meant to bypass.",
      "Generating the list and never converting the top items into owned actions with dates."
    ],
    coachingMove:
      "Enforce the silent solo write before any talking. The introverts and the junior people hold the kill-shot reason and the room's gravity will bury it otherwise.",
    engagementHook:
      "The premortem is your signature move — teachable, repeatable, and demoable in 30 minutes. It's the offer that turns a curious prospect into a client."
  },
  {
    id: "applied-critical-thinking",
    name: "Liberating Structures & the Applied Critical Thinking Handbook",
    era: "2011–2015 (US Army UFMCS, the 'Red Team University')",
    lineage:
      "The Army's University of Foreign Military and Cultural Studies codified facilitation structures (1-2-4-All, Fishbowl, 'What? So What? Now What?') so dissent doesn't depend on the bravest person in the room.",
    premise:
      "Most rooms don't lack smart objections — they lack a structure that makes the objection cheap to say out loud.",
    whenToUse:
      "Any session where seniority, politics, or volume would otherwise dominate the room. It's the operating system the other techniques run on.",
    howToRun: [
      "1-2-4-All: think alone → pair → four → whole-room, so every voice is committed to paper before the loudest one speaks.",
      "Fishbowl: decision-makers in the center, red team on the outside ring, then swap.",
      "'What? So What? Now What?': separate observation from interpretation from action so they stop contaminating each other."
    ],
    unlockingQuestion:
      "Whose objection in this room is currently too expensive to say — and what structure would make it free?",
    failureModes: [
      "Cargo-culting the structures without removing the underlying power dynamic.",
      "Over-facilitating: structure should be invisible, not performed."
    ],
    coachingMove:
      "This is the heart of coaching vs. consulting: you're not the expert with answers, you're the architect of a room where the client's own people surface the answers.",
    engagementHook:
      "Facilitation capability is sticky and hard to hire — 'we run your highest-stakes rooms' is a retained role, not a project."
  },
  {
    id: "calibrated-forecasting",
    name: "Calibrated Forecasting & Pre-Parade",
    era: "2015 (Tetlock, Superforecasting) + (Klein's 'pre-parade')",
    lineage:
      "Tetlock's superforecasters: probabilistic, scored, and updated forecasts beat confident narrative. The pre-parade red-teams runaway optimism the way the premortem red-teams failure.",
    premise:
      "An unscored prediction can't be wrong, so it never teaches anyone anything. Numbers with track records do.",
    whenToUse:
      "When the client argues in adjectives ('huge', 'certain', 'aggressive') and recurring planning that should compound learning across cycles.",
    howToRun: [
      "Force every key claim into a number with a date and a confidence ('70% we hit $4M ARR by Q4').",
      "Log it. Resolve it on the date. Score the gap. Feed the gap into the next cycle.",
      "Run a 'pre-parade': assume wild success — what did we recklessly underinvest in to get there?"
    ],
    unlockingQuestion:
      "Put a number and a date on it. Now: what odds would you take of the other side of that bet with your own money?",
    failureModes: [
      "Forecasts logged and never resolved — the scoring is the entire mechanism.",
      "Punishing low-confidence honesty, which trains the team to fake certainty."
    ],
    coachingMove:
      "Coach the client to reward calibration over confidence. The behavior change is the deliverable; the spreadsheet is just the instrument.",
    engagementHook:
      "A scored forecast ledger is a year-long relationship by construction — it only pays off across cycles, which means a renewing retainer."
  },
  {
    id: "business-red-teaming",
    name: "Business Red Teaming (the modern synthesis)",
    era: "2017 (Bryce Hoffman, Red Teaming) → present",
    lineage:
      "Hoffman took the Army's UFMCS curriculum into the boardroom: red teaming as an installed corporate capability, not a one-off devil's advocate.",
    premise:
      "Red teaming is not an event you run before a decision. It's a muscle the organization builds so good decisions survive contact with reality.",
    whenToUse:
      "When a client has done a workshop, liked it, and asks 'how do we make this part of how we operate' — that's the expansion conversation.",
    howToRun: [
      "Stand up a standing, rotating red cell with a charter, a cadence, and air cover from the CEO.",
      "Gate the few truly irreversible decisions behind a mandatory red-team pass.",
      "Track decision quality (was the reasoning sound?) separately from outcomes (luck is not a method).",
      "Review and re-charter the cell every two quarters so it doesn't ossify into a rubber stamp."
    ],
    unlockingQuestion:
      "Which of your decisions in the last year were irreversible — and which of those got a real adversarial pass before you committed?",
    failureModes: [
      "The red cell has no executive air cover and quietly becomes decoration.",
      "Judging the cell on whether it was 'right' instead of whether decisions got measurably better.",
      "Letting it calcify — yesterday's red team is today's groupthink."
    ],
    coachingMove:
      "This is where you stop being a facilitator and become a partner: you're installing an operating capability and coaching the leader who owns it. That's the relationship, not a deliverable.",
    engagementHook:
      "This is the top of your value ladder: 'we install and run your red-teaming capability' — the multi-year retained partnership every prior exercise was laddering toward."
  }
];

// ── COACHING, earliest → latest ───────────────────────────────────────────────
// Taz is hired to coach clients, not to do their thinking. These are the moves
// that keep the agent (and Taz) on the facilitation side of the line.
export const COACHING_LINEAGE = [
  {
    id: "socratic",
    name: "Socratic Questioning",
    era: "~400 BC (Socrates) → modern Socratic seminars",
    move: "Replace every assertion you're tempted to make with the question that would make the client discover it. The client defends what they conclude and resents what they're told.",
    tell: "If you've said three sentences in a row without a question, you've slipped from coaching into consulting."
  },
  {
    id: "grow",
    name: "The GROW Model",
    era: "1980s–1992 (Whitmore, Coaching for Performance)",
    move: "Structure the conversation Goal → Reality → Options → Will. Most clients jump straight to Options; your job is to drag them back to a sharp Goal and an honest Reality first.",
    tell: "If the client is debating solutions before they've stated the goal in one sentence, GROW is being skipped."
  },
  {
    id: "outside-view",
    name: "The Outside View (Reference-Class Coaching)",
    era: "1979 (Kahneman & Tversky) → 1993 (Kahneman & Lovallo, planning fallacy)",
    move: "Before any internal forecast, ask: 'How did this go for the last ten companies who tried it?' Anchor the client to the base rate, then let them argue why they're the exception.",
    tell: "If the plan's numbers reference only this company's ambition and never the reference class, the outside view is missing."
  },
  {
    id: "immunity-to-change",
    name: "Immunity to Change",
    era: "2009 (Kegan & Lahey)",
    move: "When a client keeps not doing the obviously right thing, there's a competing hidden commitment protecting them from a feared loss. Surface the hidden commitment before prescribing the action.",
    tell: "If you've given the same sound advice twice and it hasn't been acted on, the problem is an immunity, not information."
  },
  {
    id: "psychological-safety",
    name: "Engineering Psychological Safety",
    era: "1999 (Edmondson) → 2017 (Project Aristotle popularization)",
    move: "Red teaming only works in a room where being wrong out loud is survivable. Coach the leader to model fallibility first — their first public 'I was wrong' is worth more than any technique you teach.",
    tell: "If only senior people are talking in the red-team session, the safety work isn't done yet — fix the room before running the technique."
  }
];

// ── THINKING MODELS, earliest → latest ───────────────────────────────────────
// The cognitive scaffolding under the techniques. The agent names the bias by
// its proper name so Taz sounds like the most-prepared person in the room.
export const THINKING_MODELS = [
  {
    id: "falsification",
    name: "Falsification",
    era: "1934 (Popper, The Logic of Scientific Discovery)",
    idea: "A strategy that can't be proven wrong can't be trusted right. Always ask what observation would falsify the plan — if nothing would, it's faith, not strategy."
  },
  {
    id: "dialectic",
    name: "Thesis–Antithesis–Synthesis",
    era: "early 1800s (Hegel)",
    idea: "Truth advances by collision, not agreement. Engineer the collision deliberately instead of waiting for reality to provide it expensively."
  },
  {
    id: "biases",
    name: "Confirmation Bias, Anchoring & the Planning Fallacy",
    era: "1972–1979 (Tversky & Kahneman)",
    idea: "Default human reasoning seeks confirmation, over-weights the first number, and systematically underestimates time and cost. Every red-team technique is a structural workaround for one of these."
  },
  {
    id: "inversion",
    name: "Inversion",
    era: "1800s (Jacobi, 'invert, always invert') → popularized by Munger",
    idea: "Don't ask how to succeed; ask what guarantees failure, then avoid that. The premortem is inversion with a deadline."
  },
  {
    id: "black-swan-antifragility",
    name: "Black Swans & Antifragility",
    era: "2007–2012 (Taleb)",
    idea: "You cannot predict the rare decisive event; you can only build a plan that survives or gains from being wrong. Red-team for robustness to the unknown, not just accuracy about the known."
  },
  {
    id: "second-order",
    name: "Second-Order Thinking",
    era: "popularized 2010s (Howard Marks, et al.)",
    idea: "'And then what?' The first-order effect is obvious to everyone including your competitor. The decisive insight is always two moves downstream — which is why war-games go three moves deep."
  }
];

// How a red-team exercise becomes a renewing Taz Brown Strategies relationship.
// Every recommendation the agent makes should land here: not 'good idea' but
// 'here is the next paid step and why the client will want it'.
export const VALUE_LADDER = [
  {
    rung: "1 — Land",
    offer: "90-minute Key Assumptions Check or live Premortem on one real, live decision.",
    why: "Low friction, undeniable value, ends with a finding the client can't unsee. This is the paid trial.",
    converts: "→ a diagnostic engagement"
  },
  {
    rung: "2 — Diagnose",
    offer: "Decision-quality audit: Groupthink scorecard + assumption table on the client's last three big bets.",
    why: "Reframes a one-off win as a systemic gap. Produces artifacts leadership circulates internally for you.",
    converts: "→ a quarterly cadence"
  },
  {
    rung: "3 — Cadence",
    offer: "Retained quarterly red-team: war-game or Team B on each roadmap milestone, facilitated by Taz Brown Strategies.",
    why: "Recurring revenue tied to the client's own planning rhythm. You become part of how they decide.",
    converts: "→ an installed capability"
  },
  {
    rung: "4 — Install & Partner",
    offer: "Stand up the client's internal red cell — charter, training, and Taz as the standing external partner and the leader's coach.",
    why: "Multi-year, highest-margin, referral-generating. The client's wins become your case studies and your next clients.",
    converts: "→ referrals + case studies → new logos"
  }
];

export function getTechnique(id: string) {
  return RED_TEAM_LINEAGE.find((t) => t.id === id);
}

// Lightweight matcher used by the agent's recommend_technique tool and by
// demo mode. Scores each technique against the words in a client situation.
export function recommendTechniques(situation: string, limit = 3): RedTeamTechnique[] {
  const s = situation.toLowerCase();
  const signals: Record<string, string[]> = {
    premortem: ["launch", "about to", "before we", "commit", "go/no-go", "decision", "irreversible", "ship"],
    "key-assumptions-check": ["assumption", "assume", "unsure", "risky", "depends on", "bet", "uncertain", "first"],
    "kriegsspiel-wargaming": ["competitor", "rival", "pricing", "react", "market", "launch", "regulator", "m&a", "acquisition"],
    "groupthink-remedies": ["consensus", "agree", "team", "founder", "harmony", "everyone thinks", "aligned", "no pushback"],
    ach: ["why did", "diagnose", "root cause", "retention", "churn", "missed", "explain", "what caused"],
    "team-b": ["pivot", "raise", "high stakes", "category", "narrative", "second opinion", "validate"],
    "dialectical-inquiry": ["only option", "one plan", "alternative", "either", "single strategy"],
    "advocatus-diaboli": ["fast", "quick agreement", "no objection", "rubber stamp", "challenge"],
    "calibrated-forecasting": ["forecast", "predict", "confident", "huge", "certain", "probability", "odds"],
    "applied-critical-thinking": ["facilitate", "workshop", "room", "seniority", "politics", "voice"],
    "business-red-teaming": ["capability", "ongoing", "operate", "culture", "embed", "standing", "every decision"]
  };
  const scored = RED_TEAM_LINEAGE.map((t) => {
    const words = signals[t.id] ?? [];
    const score = words.reduce((n, w) => (s.includes(w) ? n + 1 : n), 0);
    return { t, score };
  });
  const hits = scored.filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  if (hits.length === 0) {
    // No strong signal → lead with the two highest-ROI, lowest-friction moves.
    return [getTechnique("key-assumptions-check")!, getTechnique("premortem")!];
  }
  return hits.slice(0, limit).map((x) => x.t);
}
