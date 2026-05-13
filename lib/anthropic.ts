import Anthropic from "@anthropic-ai/sdk";

// Single source of truth for "do we have a real key + should we call Claude?"
// Every agent imports DEMO_MODE from here so the four agents behave consistently
// during sales demos when ANTHROPIC_API_KEY is absent.
export const DEMO_MODE =
  process.env.AGENTS_DEMO_MODE === "true" ||
  process.env.MAYA_DEMO_MODE === "true" ||
  !process.env.ANTHROPIC_API_KEY;

export const MODEL = process.env.AGENTS_MODEL || process.env.MAYA_MODEL || "claude-sonnet-4-6";

let _client: Anthropic | null = null;
export function anthropic() {
  if (!_client) _client = new Anthropic();
  return _client;
}

// Pull the text content out of a Claude response, ignoring tool_use blocks.
export function extractText(res: Anthropic.Message): string {
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}
