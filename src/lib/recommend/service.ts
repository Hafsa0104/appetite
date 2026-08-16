import { catalogForPrompt, catalogIds, categoryIds, getProductById } from "@/lib/catalog";
import {
  LIMITS,
  DIETARY_OPTIONS,
  SPICE_OPTIONS,
  BUDGET_OPTIONS,
  type Constraints,
  type RecommendationResponse,
} from "./schema";
import { parseRecommendations } from "./parse";
import { requestRecommendation } from "./anthropic";
import { getFallbackProducts } from "./fallback";
import type { Product } from "@/lib/data";

/** Thrown for bad user input — surfaced to the client as a 400 with a safe message. */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const FALLBACK_MESSAGE =
  "Smart picks are unavailable right now — here are some popular choices.";

/** Validate + normalize the request body. Throws ValidationError on bad input. */
export function validateInput(
  rawCraving: unknown,
  rawConstraints: unknown,
): { craving: string; constraints: Constraints } {
  const craving = typeof rawCraving === "string" ? rawCraving.trim() : "";

  if (craving.length < LIMITS.minCravingLength) {
    throw new ValidationError("Tell us what you're craving first.");
  }
  if (craving.length > LIMITS.maxCravingLength) {
    throw new ValidationError(
      `Please keep your craving under ${LIMITS.maxCravingLength} characters.`,
    );
  }

  return { craving, constraints: normalizeConstraints(rawConstraints) };
}

/** Coerce arbitrary constraint input to safe, whitelisted values. */
function normalizeConstraints(raw: unknown): Constraints {
  const r = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;

  const pick = <T extends readonly string[]>(
    value: unknown,
    options: T,
    fallback: T[number],
  ): T[number] =>
    typeof value === "string" && (options as readonly string[]).includes(value)
      ? (value as T[number])
      : fallback;

  const category =
    typeof r.category === "string" && (r.category === "any" || categoryIds.includes(r.category))
      ? r.category
      : "any";

  return {
    dietary: pick(r.dietary, DIETARY_OPTIONS, "any"),
    spice: pick(r.spice, SPICE_OPTIONS, "any"),
    budget: pick(r.budget, BUDGET_OPTIONS, "any"),
    category,
  };
}

/** Deterministic, catalogue-only response used whenever the AI path can't deliver. */
function buildFallback(
  constraints: Constraints,
  message: string = FALLBACK_MESSAGE,
): RecommendationResponse {
  return {
    source: "fallback",
    items: getFallbackProducts(constraints).map((product) => ({
      product,
      reason: "A popular choice.",
    })),
    note: null,
    message,
  };
}

/**
 * Orchestrates a recommendation:
 *  1. ask the model (server-side) for catalogue-grounded picks
 *  2. parse/validate its (untrusted) output
 *  3. map ids to trusted local products
 * Any failure at any step — missing key, timeout, network, bad JSON, no valid
 * ids — resolves to the deterministic fallback. This function never throws.
 */
export async function getRecommendations(
  craving: string,
  constraints: Constraints,
): Promise<RecommendationResponse> {
  let rawText: string;
  try {
    rawText = await requestRecommendation({
      craving,
      constraints,
      catalog: catalogForPrompt(),
    });
  } catch {
    return buildFallback(constraints); // AI unavailable
  }

  let parsed;
  try {
    parsed = parseRecommendations(rawText, catalogIds);
  } catch {
    return buildFallback(constraints); // malformed AI output
  }

  const items = parsed.recommendations
    .map((r) => {
      const product = getProductById(r.id);
      return product ? { product, reason: r.reason } : null;
    })
    .filter((x): x is { product: Product; reason: string } => x !== null);

  if (items.length === 0) {
    return buildFallback(constraints); // AI returned nothing usable
  }

  return { source: "ai", items, note: parsed.note, message: null };
}