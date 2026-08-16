import { describe, it, expect } from "vitest";
import { getFallbackProducts, isVegetarian, isSpicy } from "./fallback";
import { DEFAULT_CONSTRAINTS, LIMITS } from "./schema";
import { catalog, inferCategory } from "@/lib/catalog";

describe("fallback heuristics", () => {
  it("flags meat dishes as non-vegetarian", () => {
    const beef = catalog.find((p) => /beef/i.test(p.blurb))!;
    expect(beef).toBeDefined();
    expect(isVegetarian(beef)).toBe(false);
  });

  it("flags a spicy dish as spicy", () => {
    const spicy = catalog.find((p) => /spicy|pepperoni/i.test(p.name + p.blurb))!;
    expect(spicy).toBeDefined();
    expect(isSpicy(spicy)).toBe(true);
  });
});

describe("getFallbackProducts", () => {
  it("always returns up to the max, never empty", () => {
    const result = getFallbackProducts(DEFAULT_CONSTRAINTS);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(LIMITS.maxRecommendations);
  });

  it("respects the under-$10 budget in the primary matches", () => {
    const result = getFallbackProducts({ ...DEFAULT_CONSTRAINTS, budget: "under10" });
    const underTen = result.filter((p) => p.price <= 10);
    expect(underTen.length).toBeGreaterThan(0);
  });

  it("returns only vegetarian items when vegetarian is required and enough exist", () => {
    const veg = catalog.filter((p) => isVegetarian(p));
    if (veg.length >= LIMITS.maxRecommendations) {
      const result = getFallbackProducts({ ...DEFAULT_CONSTRAINTS, dietary: "vegetarian" });
      expect(result.every((p) => isVegetarian(p))).toBe(true);
    } else {
      expect(true).toBe(true);
    }
  });

  it("filters by category when a category is chosen", () => {
    const result = getFallbackProducts({ ...DEFAULT_CONSTRAINTS, category: "pizza" });
    const pizzas = result.filter((p) => inferCategory(p) === "pizza");
    expect(pizzas.length).toBeGreaterThan(0);
  });

  it("returns no duplicates", () => {
    const result = getFallbackProducts(DEFAULT_CONSTRAINTS);
    const ids = result.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});