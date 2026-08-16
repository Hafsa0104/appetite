import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { requestRecommendation, AiUnavailableError } from "./anthropic";
import { DEFAULT_CONSTRAINTS } from "./schema";

const input = {
  craving: "warm cheesy",
  constraints: DEFAULT_CONSTRAINTS,
  catalog: [{ id: "p1", name: "Pizza", blurb: "cheese", price: 9, category: "pizza" }],
};

const KEY = "sk-test-do-not-use";
const originalKey = process.env.ANTHROPIC_API_KEY;
const originalFetch = global.fetch;

afterEach(() => {
  if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = originalKey;
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("requestRecommendation — missing key", () => {
  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("throws AiUnavailableError when the key is missing (never calls out)", async () => {
    const fetchSpy = vi.fn();
    global.fetch = fetchSpy as unknown as typeof fetch;
    await expect(requestRecommendation(input)).rejects.toBeInstanceOf(AiUnavailableError);
    expect(fetchSpy).not.toHaveBeenCalled(); // no network attempt without a key
  });
});

describe("requestRecommendation — real HTTP path (fetch mocked)", () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = KEY;
  });

  it("calls Anthropic server-side with the key header and catalogue grounding, and returns the text", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: '{"recommendations":[{"id":"p1","reason":"cheesy"}]}' }],
      }),
    })) as unknown as typeof fetch;
    global.fetch = fetchMock;

    const text = await requestRecommendation(input);

    const call = (fetchMock as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const url = call[0] as string;
    const init = call[1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    const body = String(init.body);

    expect(url).toContain("api.anthropic.com");
    expect(headers["x-api-key"]).toBe(KEY); // key sent server-side only
    expect(headers["anthropic-version"]).toBeTruthy();
    expect(body).toContain("p1"); // catalogue grounding reached the model
    expect(body).toContain("recommendations"); // structured-output instruction present
    expect(text).toContain("p1"); // extracted model text returned
  });

  it("throws AiUnavailableError on a non-2xx response", async () => {
    global.fetch = vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) })) as unknown as typeof fetch;
    await expect(requestRecommendation(input)).rejects.toBeInstanceOf(AiUnavailableError);
  });

  it("throws AiUnavailableError when the response has no text content", async () => {
    global.fetch = vi.fn(async () => ({ ok: true, json: async () => ({ content: [] }) })) as unknown as typeof fetch;
    await expect(requestRecommendation(input)).rejects.toBeInstanceOf(AiUnavailableError);
  });
});