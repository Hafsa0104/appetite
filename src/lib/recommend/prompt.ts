import { LIMITS, type Constraints } from "./schema";
import type { CatalogItem } from "@/lib/catalog";

export type PromptInput = {
  craving: string;
  constraints: Constraints;
  catalog: CatalogItem[];
};

/**
 * System instructions. Kept as an exported constant so tests can assert the
 * grounding rules (only-from-catalogue, exact ids, JSON-only) are present.
 */
export const SYSTEM_PROMPT = [
  "You are Appetite's dish recommender.",
  "Recommend dishes ONLY from the provided catalogue.",
  "Never invent dishes, ids, prices, or details that are not in the catalogue.",
  "Use the exact `id` values from the catalogue for every recommendation.",
  `Return between 1 and ${LIMITS.maxRecommendations} recommendations, best match first.`,
  "Respect the user's craving and constraints. If nothing fits well, return your closest catalogue matches and explain briefly in `note`.",
  "Each `reason` must be one short sentence, grounded only in catalogue information — do not claim details that are not present.",
  "Respond with ONLY a JSON object (no markdown, no code fences, no prose) matching exactly this shape:",
  '{"recommendations":[{"id":"<catalogue id>","reason":"<short reason>"}],"note":"<short note or empty string>"}',
].join(" ");

/**
 * Builds the user message: craving, constraints, and the controlled catalogue.
 * The catalogue is serialized as JSON so ids are unambiguous.
 */
export function buildUserPrompt(input: PromptInput): string {
  const { craving, constraints, catalog } = input;
  return [
    "USER CRAVING:",
    craving,
    "",
    "CONSTRAINTS:",
    `- dietary: ${constraints.dietary}`,
    `- spice: ${constraints.spice}`,
    `- budget: ${constraints.budget === "under10" ? "under $10" : "any"}`,
    `- category: ${constraints.category}`,
    "",
    "CATALOGUE (choose only from these):",
    JSON.stringify(catalog),
  ].join("\n");
}