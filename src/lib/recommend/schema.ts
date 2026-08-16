import type { Product } from "@/lib/data";

/** Hard limits shared across prompt, parser, and UI. */
export const LIMITS = {
  maxRecommendations: 6,
  maxReasonLength: 160,
  maxNoteLength: 200,
  maxCravingLength: 300,
  minCravingLength: 2,
} as const;

/** Allowed constraint values — single source of truth for form + prompt + fallback. */
export const DIETARY_OPTIONS = ["any", "vegetarian"] as const;
export const SPICE_OPTIONS = ["any", "mild", "spicy"] as const;
export const BUDGET_OPTIONS = ["any", "under10"] as const;

export type Dietary = (typeof DIETARY_OPTIONS)[number];
export type Spice = (typeof SPICE_OPTIONS)[number];
export type Budget = (typeof BUDGET_OPTIONS)[number];

export type Constraints = {
  dietary: Dietary;
  spice: Spice;
  budget: Budget;
  /** "any" or a category id from the catalogue. */
  category: string;
};

export const DEFAULT_CONSTRAINTS: Constraints = {
  dietary: "any",
  spice: "any",
  budget: "any",
  category: "any",
};

/** A single validated recommendation (id proven to exist in the catalogue). */
export type AiRecommendation = { id: string; reason: string };

/** Output of the parser: validated subset + optional note. */
export type ParsedRecommendations = {
  recommendations: AiRecommendation[];
  note: string | null;
};

/**
 * The API route's response to the UI. `source` distinguishes real AI picks
 * from the deterministic fallback so the UI can message honestly. `items`
 * always carry the trusted local Product, never model-supplied display data.
 */
export type RecommendationResponse = {
  source: "ai" | "fallback";
  items: { product: Product; reason: string }[];
  note: string | null;
  /** User-facing status message (e.g. fallback explanation). */
  message: string | null;
};