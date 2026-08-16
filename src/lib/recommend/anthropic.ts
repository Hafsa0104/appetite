import { SYSTEM_PROMPT, buildUserPrompt, type PromptInput } from "./prompt";

/** Thrown for any failure talking to the model (network, timeout, non-200, no key). */
export class AiUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiUnavailableError";
  }
}

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5";
const TIMEOUT_MS = 10_000;

/**
 * Calls the Anthropic Messages API and returns the raw text content.
 * Server-only: reads ANTHROPIC_API_KEY from the environment and never exposes it.
 * Isolated here so the route can be tested by mocking this single function.
 */
export async function requestRecommendation(input: PromptInput): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AiUnavailableError("Missing ANTHROPIC_API_KEY.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(input) }],
      }),
    });
  } catch (err) {
    throw new AiUnavailableError(
      err instanceof Error && err.name === "AbortError"
        ? "Recommendation request timed out."
        : "Could not reach the recommendation service.",
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new AiUnavailableError(`Recommendation service returned ${res.status}.`);
  }

  const data: unknown = await res.json().catch(() => null);
  const text = extractText(data);
  if (!text) {
    throw new AiUnavailableError("Recommendation service returned no content.");
  }
  return text;
}

/** Pull the concatenated text out of an Anthropic Messages response. */
function extractText(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "content" in data &&
    Array.isArray((data as { content: unknown }).content)
  ) {
    const blocks = (data as { content: Array<{ type?: string; text?: string }> }).content;
    return blocks
      .filter((b) => b?.type === "text" && typeof b.text === "string")
      .map((b) => b.text as string)
      .join("\n")
      .trim();
  }
  return "";
}