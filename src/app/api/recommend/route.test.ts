import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Anthropic boundary so route tests never touch the network or a key.
vi.mock("@/lib/recommend/anthropic", () => ({
  requestRecommendation: vi.fn(),
}));

import { POST } from "./route";
import { requestRecommendation } from "@/lib/recommend/anthropic";

const mockAi = vi.mocked(requestRecommendation);

function post(body: unknown, raw = false) {
  return new Request("http://localhost/api/recommend", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

beforeEach(() => mockAi.mockReset());

describe("POST /api/recommend (route contract)", () => {
  it("returns 200 + AI source for valid input with a good AI response", async () => {
    mockAi.mockResolvedValue(
      JSON.stringify({ recommendations: [{ id: "p1", reason: "cheesy" }] }),
    );
    const res = await POST(post({ craving: "warm cheesy", constraints: {} }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.source).toBe("ai");
    expect(json.items[0].product.id).toBe("p1");
    // display data comes from the trusted local product, not the model
    expect(json.items[0].product.name).toBe("Bamboo Margherita");
  });

  it("returns 400 with a safe message for empty craving", async () => {
    const res = await POST(post({ craving: "", constraints: {} }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/craving/i);
  });

  it("returns 400 for malformed request JSON", async () => {
    const res = await POST(post("not-json", true));
    expect(res.status).toBe(400);
  });

  it("returns 200 fallback when the AI output can't be used", async () => {
    // Unusable model output -> parser fails -> route serves deterministic fallback.
    mockAi.mockResolvedValue("this is not valid json");
    const res = await POST(post({ craving: "warm cheesy", constraints: {} }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.source).toBe("fallback");
    expect(json.items.length).toBeGreaterThan(0);
    expect(json.message).toMatch(/unavailable/i);
  });

  it("never leaks raw model output or internals into the response", async () => {
    mockAi.mockResolvedValue("LEAK_SENTINEL_12345 {not: valid json}");
    const res = await POST(post({ craving: "warm cheesy", constraints: {} }));
    const text = JSON.stringify(await res.json());
    expect(text).not.toContain("LEAK_SENTINEL_12345"); // raw model text not echoed
    expect(text).not.toMatch(/api[_-]?key/i);
    expect(text).not.toMatch(/stack/i);
  });
});