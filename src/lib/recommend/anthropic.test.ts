import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { requestRecommendation, AiUnavailableError } from "./anthropic";
import { DEFAULT_CONSTRAINTS } from "./schema";

const input = {
  craving: "warm cheesy",
  constraints: DEFAULT_CONSTRAINTS,
  catalog: [{ id: "p1", name: "Pizza", blurb: "cheese", price: 9, category: "pizza" }],
};

describe("requestRecommendation (server-only key handling)", () => {
  const original = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
    if (original === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = original;
  });

  it("throws AiUnavailableError when ANTHROPIC_API_KEY is missing (never calls out)", async () => {
    await expect(requestRecommendation(input)).rejects.toBeInstanceOf(AiUnavailableError);
  });
});