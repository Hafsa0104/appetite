import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Anthropic client so the service can be tested without network or a key.
vi.mock("./anthropic", () => ({
  requestRecommendation: vi.fn(),
}));

import { getRecommendations, validateInput, ValidationError } from "./service";
import { requestRecommendation } from "./anthropic";
import { DEFAULT_CONSTRAINTS, LIMITS } from "./schema";

const mockAi = vi.mocked(requestRecommendation);

beforeEach(() => {
  mockAi.mockReset();
});

describe("validateInput", () => {
  it("throws on empty or whitespace craving", () => {
    expect(() => validateInput("", {})).toThrow(ValidationError);
    expect(() => validateInput("   ", {})).toThrow(ValidationError);
  });

  it("throws on an over-long craving", () => {
    const long = "a".repeat(LIMITS.maxCravingLength + 1);
    expect(() => validateInput(long, {})).toThrow(ValidationError);
  });

  it("trims a valid craving and returns default constraints", () => {
    const { craving, constraints } = validateInput("  warm cheesy  ", undefined);
    expect(craving).toBe("warm cheesy");
    expect(constraints).toEqual(DEFAULT_CONSTRAINTS);
  });

  it("normalizes unknown constraint values to safe defaults", () => {
    const { constraints } = validateInput("pizza", {
      dietary: "carnivore",
      spice: "nuclear",
      budget: "free",
      category: "not-a-category",
    });
    expect(constraints).toEqual(DEFAULT_CONSTRAINTS);
  });

  it("keeps valid constraint values", () => {
    const { constraints } = validateInput("pizza", {
      dietary: "vegetarian",
      spice: "mild",
      budget: "under10",
      category: "pizza",
    });
    expect(constraints).toEqual({
      dietary: "vegetarian",
      spice: "mild",
      budget: "under10",
      category: "pizza",
    });
  });
});

describe("getRecommendations (AI path)", () => {
  it("maps valid AI ids to trusted local products", async () => {
    mockAi.mockResolvedValue(
      JSON.stringify({
        recommendations: [
          { id: "p1", reason: "Warm and cheesy" },
          { id: "p2", reason: "Filling classic" },
        ],
        note: "Enjoy",
      }),
    );

    const result = await getRecommendations("warm cheesy", DEFAULT_CONSTRAINTS);

    expect(result.source).toBe("ai");
    expect(result.items.map((i) => i.product.id)).toEqual(["p1", "p2"]);
    expect(result.items[0].product.name).toBeTruthy();
    expect(result.items[0].reason).toBe("Warm and cheesy");
    expect(result.note).toBe("Enjoy");
    expect(result.message).toBeNull();
  });

  it("drops unknown ids but keeps the valid ones", async () => {
    mockAi.mockResolvedValue(
      JSON.stringify({
        recommendations: [
          { id: "p1", reason: "real" },
          { id: "totally-made-up", reason: "invented" },
        ],
      }),
    );

    const result = await getRecommendations("x", DEFAULT_CONSTRAINTS);
    expect(result.source).toBe("ai");
    expect(result.items.map((i) => i.product.id)).toEqual(["p1"]);
  });
});

describe("getRecommendations (fallback paths)", () => {
  it("falls back when the AI is unavailable (throws)", async () => {
    mockAi.mockImplementation(async () => {
      throw new Error("no key");
    });
    const result = await getRecommendations("x", DEFAULT_CONSTRAINTS);
    expect(result.source).toBe("fallback");
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.message).toMatch(/unavailable/i);
  });

  it("falls back when the AI returns malformed JSON", async () => {
    mockAi.mockResolvedValue("this is not json");
    const result = await getRecommendations("x", DEFAULT_CONSTRAINTS);
    expect(result.source).toBe("fallback");
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("falls back when the AI returns only unknown ids", async () => {
    mockAi.mockResolvedValue(
      JSON.stringify({ recommendations: [{ id: "nope", reason: "x" }] }),
    );
    const result = await getRecommendations("x", DEFAULT_CONSTRAINTS);
    expect(result.source).toBe("fallback");
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("fallback items always carry a trusted product and a reason", async () => {
    mockAi.mockImplementation(async () => {
      throw new Error("down");
    });
    const result = await getRecommendations("x", DEFAULT_CONSTRAINTS);
    for (const item of result.items) {
      expect(item.product.id).toBeTruthy();
      expect(item.reason).toBeTruthy();
    }
  });
});