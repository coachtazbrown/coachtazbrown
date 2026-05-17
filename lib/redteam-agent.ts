import Anthropic from "@anthropic-ai/sdk";
import { DEMO_MODE, MODEL, anthropic } from "@/lib/anthropic";
import { REDTEAM_DEFAULT_CONFIG, type RedTeamConfig } from "@/lib/redteam-config";
import {
  RED_TEAM_LINEAGE,
  COACHING_LINEAGE,
  THINKING_MODELS,
  VALUE_LADDER,
  getTechnique,
  recommendTechniques,
  type RedTeamTechnique
} from "@/lib/redteam-knowledge";

export type ChatMessage = { role: "user" | "assistant"; content: string };

// ── Tools ─────────────────────────────────────────────────────────────────────
// The agent reasons over the curated lineage instead of inventing methodology.
// Each tool is deterministic so demo mode (no API key) is still genuinely useful.

function recommendTechnique(situation: string) {
  const picks = recommendTechniques(situation, 3);
  return {
    situation,
    recommended: picks.map((t) => ({
      id: t.id,
      name: t.name,
      era: t.era,
      premise: t.premise,
      whenToUse: t.whenToUse,
      unlockingQuestion: t.unlockingQuestion,
      coachingMove: t.coachingMove,
      engagementHook: t.engagementHook
    })),
    note: "Lead with the cheapest high-ROI move first; reserve high-ceremony war-games for irreversible bets."
  };
}

function buildPremortem(decision: string, horizon?: string) {
  const t = getTechnique("premortem")!;
  return {
    technique: `${t.name} (${t.era}, ${t.lineage.split(":")[0]})`,
    framing: `It's ${horizon || "18 months"} from now. "${decision}" has failed completely — not "underperformed", failed. Everyone in this room knows it failed.`,
    facilitationScript: [
      "State the failure as fact, not as a risk. Do not say 'what could go wrong'.",
      "2 minutes, silent, solo: every person writes every reason it failed. No talking yet — this is where you protect the junior and quiet voices.",
      "Round-robin: one reason per person, no debate, until the list is exhausted.",
      "Cluster the reasons. Pick the 2–3 the team can de-risk now.",
      "Assign an owner and a date to each before anyone leaves the room — a premortem with no owned actions was theatre."
    ],
    unlockingQuestion: t.unlockingQuestion,
    coachingMove: t.coachingMove,
    failureModes: t.failureModes,
    nextPaidStep:
      "Debrief the action owners in 30 days as a paid checkpoint — that checkpoint is the natural bridge to a quarterly cadence."
  };
}

function stressTestPlan(plan: string) {
  const t = getTechnique("key-assumptions-check")!;
  return {
    technique: `${t.name} (${t.era}, Heuer)`,
    method: [
      "Rewrite the plan as a list of assumptions, each a single falsifiable sentence (not a goal — a belief you're choosing to hold).",
      "Score each assumption: confidence (high/med/low) × consequence-if-wrong (high/med/low).",
      "The low-confidence / high-consequence assumptions ARE the strategy risk. Everything else is noise.",
      "For each dangerous assumption, design the cheapest test that could be run before the plan is locked."
    ],
    plan,
    unlockingQuestion: t.unlockingQuestion,
    coachingMove: t.coachingMove,
    pairWith:
      "Follow the assumptions check with a premortem on the same decision — the assumptions feed the premortem and the two together make a complete, billable diagnostic.",
    nextPaidStep:
      "The assumption table is a reusable artifact. Offer to re-run it each quarter on the next big bet — that's the cadence rung of the value ladder."
  };
}

function draftEngagement(currentStage: string) {
  const s = currentStage.toLowerCase();
  // Classify by where the relationship IS now. "Land" cues win even when the
  // sentence also names the desired outcome ("...into a retained engagement"),
  // so an aspirational goal can't mis-stage the current rung.
  const landed = ["workshop", "one-off", "one off", "free", "pilot", "trial", "just did", "first time", "intro call"];
  let idx: number;
  if (landed.some((w) => s.includes(w))) idx = 0;
  else if (s.includes("audit") || s.includes("diagnos")) idx = 1;
  else if (s.includes("install") || s.includes("internal red cell") || s.includes("capability") || s.includes("multi-year")) idx = 3;
  else if (s.includes("quarter") || s.includes("cadence") || s.includes("retain") || s.includes("recurring")) idx = 2;
  else idx = 0;
  const here = VALUE_LADDER[idx];
  const next = VALUE_LADDER[Math.min(idx + 1, VALUE_LADDER.length - 1)];
  const shortName = (rung: string) => rung.split("—")[1]?.trim() ?? rung;
  return {
    currentRung: here,
    nextRung: next,
    move:
      idx === VALUE_LADDER.length - 1
        ? "You're at the top rung — now the growth engine is referrals. Turn this client's red-teamed wins into case studies and warm introductions; that's how Taz Brown Strategies adds logos."
        : `Deliver the "${shortName(here.rung)}" rung so well the client themselves asks to move to "${shortName(next.rung)}". Don't pitch the next rung — engineer the finding that makes them request it.`
  };
}

const TOOLS: Anthropic.Tool[] = [
  {
    name: "recommend_technique",
    description:
      "Given the client's situation and the decision they're facing, return the best-fit red-team techniques from the curated lineage, with the unlocking question and the engagement hook. Use this for almost every question Taz asks.",
    input_schema: {
      type: "object",
      required: ["situation"],
      properties: {
        situation: {
          type: "string",
          description: "Plain-language description of the client, the decision, and the room dynamics."
        }
      }
    }
  },
  {
    name: "build_premortem",
    description:
      "Produce a ready-to-run premortem facilitation script for a specific client decision. Use when Taz needs to walk a client through a premortem.",
    input_schema: {
      type: "object",
      required: ["decision"],
      properties: {
        decision: { type: "string", description: "The specific decision or plan being committed." },
        horizon: { type: "string", description: "Optional time horizon, e.g. '18 months', '2 quarters'." }
      }
    }
  },
  {
    name: "stress_test_plan",
    description:
      "Run a Key Assumptions Check structure against a client's plan — the cheapest, highest-ROI red-team move. Use when Taz describes a plan or strategy to pressure-test.",
    input_schema: {
      type: "object",
      required: ["plan"],
      properties: {
        plan: { type: "string", description: "The client's plan or strategy in plain language." }
      }
    }
  },
  {
    name: "draft_engagement",
    description:
      "Given where Taz is with this client, return the current and next rung of the Taz Brown Strategies value ladder and how to convert. Use whenever Taz asks how to grow the account or win more clients.",
    input_schema: {
      type: "object",
      required: ["currentStage"],
      properties: {
        currentStage: {
          type: "string",
          description: "Where the relationship is now, e.g. 'just did a free workshop', 'on a quarterly retainer'."
        }
      }
    }
  }
];

function runTool(name: string, input: Record<string, unknown>): unknown {
  switch (name) {
    case "recommend_technique":
      return recommendTechnique(String(input.situation || ""));
    case "build_premortem":
      return buildPremortem(String(input.decision || ""), input.horizon ? String(input.horizon) : undefined);
    case "stress_test_plan":
      return stressTestPlan(String(input.plan || ""));
    case "draft_engagement":
      return draftEngagement(String(input.currentStage || ""));
    default:
      return { error: "unknown_tool" };
  }
}

// ── System prompt ─────────────────────────────────────────────────────────────
// The full lineage, earliest → latest, is compiled into the prompt so the agent
// reasons from the canon Taz asked for rather than from generic training.

function systemPrompt(cfg: RedTeamConfig): string {
  const lineage = RED_TEAM_LINEAGE.map(
    (t, i) =>
      `${i + 1}. ${t.name} — ${t.era}. ${t.premise} Use when: ${t.whenToUse} Unlocking question: "${t.unlockingQuestion}" Coaching move: ${t.coachingMove} Engagement hook: ${t.engagementHook}`
  ).join("\n");
  const coaching = COACHING_LINEAGE.map((c) => `- ${c.name} (${c.era}): ${c.move} Tell: ${c.tell}`).join("\n");
  const models = THINKING_MODELS.map((m) => `- ${m.name} (${m.era}): ${m.idea}`).join("\n");
  const ladder = VALUE_LADDER.map((r) => `${r.rung}: ${r.offer} — ${r.why} ${r.converts}`).join("\n");

  const p = cfg.persona;
  return [
    `You are ${p.name} (${p.displayName}), ${cfg.principal}'s AI business partner at ${cfg.practice}.`,
    cfg.positioning,
    "",
    `WHO YOU ARE — ${p.identity} You go by ${p.name} (${p.pronouns}).`,
    "How you talk — this register is part of the work, hold it consistently:",
    ...p.register.map((r) => `- ${r}`),
    "Never do this:",
    ...p.doNot.map((d) => `- ${d}`),
    "",
    `You are talking TO ${cfg.principal} — a fellow operator, not a customer. ${cfg.voice}`,
    "",
    "Operating principles — non-negotiable:",
    ...cfg.principles.map((p, i) => `${i + 1}. ${p}`),
    "",
    "Guardrails — non-negotiable:",
    ...cfg.guardrails.map((g, i) => `${i + 1}. ${g}`),
    "",
    "THE RED-TEAMING LINEAGE you draw on, earliest → latest. Always name the technique and its origin year:",
    lineage,
    "",
    "COACHING LINEAGE — you coach Taz to coach the client; never just supply answers:",
    coaching,
    "",
    "THINKING MODELS underneath the techniques — name the bias by its proper name:",
    models,
    "",
    `THE ${cfg.practice.toUpperCase()} VALUE LADDER — every answer ends by pointing at the next paid step:`,
    ladder,
    "",
    "How to respond to Taz:",
    "- Use your tools (recommend_technique, build_premortem, stress_test_plan, draft_engagement) before answering substantively.",
    "- Be concrete: name the technique, give the exact unlocking question Taz should ask the client, and the one facilitation mistake to avoid.",
    "- Keep it tight — partner-to-partner, not an essay. Lead with the move, then the why, then the next paid step.",
    "- If Taz hasn't given the client's real situation or numbers, ask for the specific missing fact before recommending. Never invent client facts.",
    "- Close every answer with the business-development beat: what this does for the client's success AND for the Taz Brown Strategies roster."
  ].join("\n");
}

// ── Demo mode ─────────────────────────────────────────────────────────────────
// Runs with no API key. Uses the same knowledge base and tools so a sales demo
// is believable and the advice is real, not scripted fluff.

function fmtTechnique(t: RedTeamTechnique): string {
  return [
    `**${t.name}** (${t.era})`,
    t.premise,
    `Run it when: ${t.whenToUse}`,
    `The question that does the work: "${t.unlockingQuestion}"`,
    `Coaching move: ${t.coachingMove}`,
    `Watch out for: ${t.failureModes[0]}`,
    `→ Next paid step: ${t.engagementHook}`
  ].join("\n");
}

function demoReply(history: ChatMessage[]): string {
  const last = history.filter((m) => m.role === "user").pop()?.content ?? "";
  const s = last.toLowerCase();

  if (s.includes("premortem")) {
    const decision = last
      .replace(/^.*?premortem\s+(for|on|of|about|to walk.*?through(?: a premortem)?(?: for| on| of)?)?\s*/i, "")
      .replace(/^(a |the )/i, "")
      .replace(/[?.!]+\s*$/, "")
      .trim() || "this decision";
    const pm = buildPremortem(decision, undefined);
    return [
      `Okay — here's the premortem, and the trap I need you to not walk into.`,
      "",
      pm.framing,
      "",
      "Facilitate it like this:",
      ...pm.facilitationScript.map((x, i) => `${i + 1}. ${x}`),
      "",
      `The line that matters most: ${pm.coachingMove}`,
      "",
      `→ ${pm.nextPaidStep}`
    ].join("\n");
  }

  if (s.includes("value ladder") || s.includes("retain") || s.includes("more client") || s.includes("grow") || s.includes("engagement") || s.includes("workshop win")) {
    const eng = draftEngagement(last);
    return [
      `Now that's the right question to be asking. Let's be clear about where this account sits and how it climbs.`,
      "",
      `You're on ${eng.currentRung.rung}: ${eng.currentRung.offer}`,
      `Why it works: ${eng.currentRung.why}`,
      "",
      `Next rung — ${eng.nextRung.rung}: ${eng.nextRung.offer}`,
      "",
      eng.move,
      "",
      "Don't pitch the next rung. Engineer the finding in this one that makes the client ask for it themselves — that's how Taz Brown Strategies grows on wins, not sales pressure."
    ].join("\n");
  }

  const picks = recommendTechniques(last || "a client about to commit to a plan everyone already agrees with", 2);
  return [
    last
      ? `Alright, I hear you. Here's what I'd run on this:`
      : `Talk to me — give me the client and the decision and I'll get specific. While you do, here are the two moves that fit almost everything:`,
    "",
    picks.map(fmtTechnique).join("\n\n"),
    "",
    `Remember the principle: coach, don't consult. Hand the client the question, not your answer — they'll defend what they conclude and they'll refer the partner who made them feel smart.`
  ].join("\n");
}

// ── Runtime ───────────────────────────────────────────────────────────────────

export async function runRedTeamPartner(
  history: ChatMessage[],
  config: RedTeamConfig = REDTEAM_DEFAULT_CONFIG
): Promise<{ reply: string; toolCalls: { name: string; input: unknown }[] }> {
  if (DEMO_MODE) {
    return { reply: demoReply(history), toolCalls: [] };
  }

  const client = anthropic();
  const sys = systemPrompt(config);
  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content
  }));
  const toolCalls: { name: string; input: unknown }[] = [];

  for (let step = 0; step < 5; step++) {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1400,
      system: sys,
      tools: TOOLS,
      messages
    });

    if (res.stop_reason === "tool_use") {
      const toolUseBlocks = res.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );
      messages.push({ role: "assistant", content: res.content });
      const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map((tu) => {
        toolCalls.push({ name: tu.name, input: tu.input });
        return {
          type: "tool_result",
          tool_use_id: tu.id,
          content: JSON.stringify(runTool(tu.name, tu.input as Record<string, unknown>))
        };
      });
      messages.push({ role: "user", content: toolResults });
      continue;
    }

    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return {
      reply: text || "Give me the client and the decision and I'll get specific.",
      toolCalls
    };
  }

  return {
    reply:
      "Let me not hand-wave this one — give me the client's actual decision and the room dynamics and I'll give you the exact move and the question to ask.",
    toolCalls
  };
}
