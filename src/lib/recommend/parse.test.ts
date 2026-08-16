import { describe, it, expect } from "vitest";
import { parseRecommendations, RecommendationParseError } from "./parse";
import { LIMITS } from "./schema";

const validIds = new Set(["p1", "p2", "p3", "p4"]);

describe("parseRecommendations", () => {
  it("parses a valid response and keeps only id + reason", () => {
    const raw = JSON.stringify({
      recommendations: [
        { id: "p1", reason: "Warm and cheesy" },
        { id: "p2", reason: "Filling classic" },
      ],
      note: "Great picks",
    });
    const result = parseRecommendations(raw, validIds);
    expect(result.recommendations).toEqual([
      { id: "p1", reason: "Warm and cheesy" },
      { id: "p2", reason: "Filling classic" },
    ]);
    expect(result.note).toBe("Great picks");
  });

  it("drops ids that are not in the catalogue (rejects invented dishes)", () => {
    const raw = JSON.stringify({
      recommendations: [
        { id: "p1", reason: "real" },
        { id: "does-not-exist", reason: "invented" },
        { id: "p99", reason: "invented" },
      ],
    });
    const result = parseRecommendations(raw, validIds);
    expect(result.recommendations.map((r) => r.id)).toEqual(["p1"]);
  });

  it("dedupes repeated ids, keeping the first", () => {
    const raw = JSON.stringify({
      recommendations: [
        { id: "p1", reason: "first" },
        { id: "p1", reason: "second" },
        { id: "p2", reason: "keep" },
      ],
    });
    const result = parseRecommendations(raw, validIds);
    expect(result.recommendations).toEqual([
      { id: "p1", reason: "first" },
      { id: "p2", reason: "keep" },
    ]);
  });

  it("returns an empty array when there are no valid recommendations", () => {
    const raw = JSON.stringify({ recommendations: [{ id: "nope", reason: "x" }] });
    const result = parseRecommendations(raw, validIds);
    expect(result.recommendations).toEqual([]);
  });

  it("caps the number of recommendations", () => {
    const many = Array.from({ length: 20 }, () => ({ id: "p1", reason: "x" }));
    const distinct = ["p1", "p2", "p3", "p4"].map((id) => ({ id, reason: "x" }));
    const raw = JSON.stringify({ recommendations: [...distinct, ...many] });
    const result = parseRecommendations(raw, validIds);
    expect(result.recommendations.length).toBeLessThanOrEqual(LIMITS.maxRecommendations);
  });

  it("extracts JSON wrapped in ```json fences", () => {
    const raw = "Sure!\n```json\n" + JSON.stringify({ recommendations: [{ id: "p3", reason: "ok" }] }) + "\n```";
    const result = parseRecommendations(raw, validIds);
    expect(result.recommendations).toEqual([{ id: "p3", reason: "ok" }]);
  });

  it("extracts a JSON object embedded in surrounding prose", () => {
    const raw = 'Here you go: {"recommendations":[{"id":"p2","reason":"nice"}]} enjoy';
    const result = parseRecommendations(raw, validIds);
    expect(result.recommendations).toEqual([{ id: "p2", reason: "nice" }]);
  });

  it("truncates an over-long reason", () => {
    const longReason = "a".repeat(LIMITS.maxReasonLength + 50);
    const raw = JSON.stringify({ recommendations: [{ id: "p1", reason: longReason }] });
    const result = parseRecommendations(raw, validIds);
    expect(result.recommendations[0].reason.length).toBeLessThanOrEqual(
      LIMITS.maxReasonLength + 1,
    );
    expect(result.recommendations[0].reason.endsWith("…")).toBe(true);
  });

  it("supplies a default reason when reason is missing or non-string", () => {
    const raw = JSON.stringify({ recommendations: [{ id: "p1" }, { id: "p2", reason: 5 }] });
    const result = parseRecommendations(raw, validIds);
    expect(result.recommendations[0].reason).toBeTruthy();
    expect(result.recommendations[1].reason).toBeTruthy();
  });

  it("skips entries with a non-string id", () => {
    const raw = JSON.stringify({ recommendations: [{ id: 123, reason: "x" }, { id: "p1", reason: "y" }] });
    const result = parseRecommendations(raw, validIds);
    expect(result.recommendations.map((r) => r.id)).toEqual(["p1"]);
  });

  it("normalizes a missing/blank note to null", () => {
    const raw = JSON.stringify({ recommendations: [{ id: "p1", reason: "x" }], note: "   " });
    const result = parseRecommendations(raw, validIds);
    expect(result.note).toBeNull();
  });

  it("throws on invalid JSON", () => {
    expect(() => parseRecommendations("not json at all", validIds)).toThrow(
      RecommendationParseError,
    );
  });

  it("throws when recommendations is not an array", () => {
    const raw = JSON.stringify({ recommendations: "nope" });
    expect(() => parseRecommendations(raw, validIds)).toThrow(RecommendationParseError);
  });

  it("throws on an empty string", () => {
    expect(() => parseRecommendations("", validIds)).toThrow(RecommendationParseError);
  });
});