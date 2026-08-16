import {
  LIMITS,
  type AiRecommendation,
  type ParsedRecommendations,
} from "./schema";

/** Thrown when the model output can't be recovered into the expected shape. */
export class RecommendationParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RecommendationParseError";
  }
}

/**
 * Convert the model's raw text into a validated, catalogue-grounded result.
 * The input is treated as fully untrusted:
 *  - extracts the JSON object even if wrapped in prose or ```json fences
 *  - throws RecommendationParseError on unparseable / wrong-shaped output
 *  - drops ids not in the catalogue (rejects invented dishes)
 *  - dedupes repeated ids, truncates over-long reasons, caps the count
 *
 * Never throws for "no valid items" — it returns an empty array so the caller
 * can fall back deterministically.
 */
export function parseRecommendations(
  raw: string,
  validIds: Set<string>,
): ParsedRecommendations {
  const json = extractJson(raw);

  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new RecommendationParseError("Response was not valid JSON.");
  }

  if (!isRecord(data) || !Array.isArray(data.recommendations)) {
    throw new RecommendationParseError(
      "Response did not contain a recommendations array.",
    );
  }

  const seen = new Set<string>();
  const recommendations: AiRecommendation[] = [];

  for (const entry of data.recommendations) {
    if (recommendations.length >= LIMITS.maxRecommendations) break;
    if (!isRecord(entry)) continue;

    const id = entry.id;
    if (typeof id !== "string") continue; // malformed entry
    if (!validIds.has(id)) continue; // invented / unknown id
    if (seen.has(id)) continue; // duplicate

    seen.add(id);
    recommendations.push({ id, reason: normalizeReason(entry.reason) });
  }

  return { recommendations, note: normalizeNote(data.note) };
}

/** Pull a JSON object out of arbitrary model text. */
function extractJson(raw: string): string {
  const text = String(raw ?? "").trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return body.trim();
  return body.slice(start, end + 1);
}

function normalizeReason(value: unknown): string {
  const s = typeof value === "string" ? value.trim() : "";
  if (!s) return "Recommended for you.";
  return s.length > LIMITS.maxReasonLength
    ? s.slice(0, LIMITS.maxReasonLength).trimEnd() + "…"
    : s;
}

function normalizeNote(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  if (!s) return null;
  return s.length > LIMITS.maxNoteLength
    ? s.slice(0, LIMITS.maxNoteLength).trimEnd() + "…"
    : s;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}