import { describe, it, expect } from "vitest";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import { DEFAULT_CONSTRAINTS } from "./schema";
import type { CatalogItem } from "@/lib/catalog";

const catalog: CatalogItem[] = [
  { id: "p1", name: "Bamboo Margherita", blurb: "cheese", price: 9.5, category: "pizza" },
  { id: "p2", name: "Panda Double Smash", blurb: "beef", price: 8, category: "burgers" },
];

describe("SYSTEM_PROMPT", () => {
  it("instructs the model to use only the catalogue and exact ids", () => {
    expect(SYSTEM_PROMPT).toMatch(/only/i);
    expect(SYSTEM_PROMPT).toMatch(/never invent/i);
    expect(SYSTEM_PROMPT).toMatch(/id/i);
  });

  it("instructs the model to return JSON", () => {
    expect(SYSTEM_PROMPT).toMatch(/json/i);
    expect(SYSTEM_PROMPT).toContain('"recommendations"');
  });
});

describe("buildUserPrompt", () => {
  it("includes the craving, constraints, and every catalogue id", () => {
    const prompt = buildUserPrompt({
      craving: "warm and cheesy",
      constraints: { ...DEFAULT_CONSTRAINTS, budget: "under10" },
      catalog,
    });
    expect(prompt).toContain("warm and cheesy");
    expect(prompt).toContain("under $10");
    expect(prompt).toContain("p1");
    expect(prompt).toContain("p2");
  });
});