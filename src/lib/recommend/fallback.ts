import { catalog, inferCategory } from "@/lib/catalog";
import { LIMITS, type Constraints } from "./schema";
import type { Product } from "@/lib/data";

// Coarse, best-effort heuristics over the small catalogue. Deterministic and
// used only for the non-AI fallback path; the model handles nuance on the AI path.
const NON_VEG = /\b(beef|chicken|pepperoni|bacon|ham|prawn|shrimp|fish|salmon|tuna|meat)\b/i;
const SPICY = /\b(spicy|chilli|chili|jalapeno|pepperoni|hot)\b/i;

export function isVegetarian(p: Product): boolean {
  return !NON_VEG.test(p.blurb) && !NON_VEG.test(p.name);
}

export function isSpicy(p: Product): boolean {
  return SPICY.test(p.blurb) || SPICY.test(p.name);
}

/**
 * Deterministic, catalogue-only recommendations for when AI is unavailable.
 * Filters by the chosen constraints; if too few match, pads with other
 * catalogue items so the user always sees useful choices (never a blank state).
 */
export function getFallbackProducts(constraints: Constraints): Product[] {
  const result = catalog
    .filter((p) => matchesConstraints(p, constraints))
    .slice(0, LIMITS.maxRecommendations);

  if (result.length < LIMITS.maxRecommendations) {
    for (const p of catalog) {
      if (result.length >= LIMITS.maxRecommendations) break;
      if (!result.includes(p)) result.push(p);
    }
  }
  return result;
}

function matchesConstraints(p: Product, c: Constraints): boolean {
  if (c.budget === "under10" && p.price > 10) return false;
  if (c.dietary === "vegetarian" && !isVegetarian(p)) return false;
  if (c.spice === "mild" && isSpicy(p)) return false;
  if (c.spice === "spicy" && !isSpicy(p)) return false;
  if (c.category !== "any" && inferCategory(p) !== c.category) return false;
  return true;
}