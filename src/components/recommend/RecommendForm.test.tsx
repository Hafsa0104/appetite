// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecommendForm from "./RecommendForm";

afterEach(cleanup);

const product = {
  id: "p1",
  name: "Bamboo Margherita",
  blurb: "Fresh basil, mozzarella, tomato",
  price: 9.5,
  emoji: "🍕",
  tag: "Popular",
};

function mockFetchOnce(response: { ok: boolean; body: unknown }) {
  const fetchMock = vi.fn(async () => ({
    ok: response.ok,
    json: async () => response.body,
  })) as unknown as typeof fetch;
  global.fetch = fetchMock;
  return fetchMock as unknown as ReturnType<typeof vi.fn>;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("RecommendForm", () => {
  it("renders the idle state with a craving field and submit button", () => {
    render(<RecommendForm />);
    expect(screen.getByLabelText(/what are you craving/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /find dishes/i })).toBeInTheDocument();
    expect(screen.getByText(/your picks will appear here/i)).toBeInTheDocument();
  });

  it("shows a validation error and does not call the API for an empty craving", async () => {
    const fetchMock = mockFetchOnce({ ok: true, body: {} });
    const user = userEvent.setup();
    render(<RecommendForm />);

    await user.click(screen.getByRole("button", { name: /find dishes/i }));

    expect(screen.getByText(/tell us what you're craving first/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("renders AI picks using trusted local product data", async () => {
    const fetchMock = mockFetchOnce({
      ok: true,
      body: {
        source: "ai",
        items: [{ product, reason: "Warm and cheesy" }],
        note: null,
        message: null,
      },
    });
    const user = userEvent.setup();
    render(<RecommendForm />);

    await user.type(screen.getByLabelText(/what are you craving/i), "warm cheesy");
    await user.click(screen.getByRole("button", { name: /find dishes/i }));

    expect(await screen.findByText("Bamboo Margherita")).toBeInTheDocument();
    expect(screen.getByText(/warm and cheesy/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /your picks/i })).toBeInTheDocument();

    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.craving).toBe("warm cheesy");
    expect(body.constraints).toBeDefined();
  });

  it("shows the fallback status message when source is fallback", async () => {
    mockFetchOnce({
      ok: true,
      body: {
        source: "fallback",
        items: [{ product, reason: "A popular choice." }],
        note: null,
        message: "Smart picks are unavailable right now — here are some popular choices.",
      },
    });
    const user = userEvent.setup();
    render(<RecommendForm />);

    await user.type(screen.getByLabelText(/what are you craving/i), "anything");
    await user.click(screen.getByRole("button", { name: /find dishes/i }));

    expect(await screen.findByText(/unavailable right now/i)).toBeInTheDocument();
    expect(screen.getByText("Bamboo Margherita")).toBeInTheDocument();
  });

  it("shows a safe error and a retry action on a 400 response", async () => {
    mockFetchOnce({ ok: false, body: { error: "Tell us what you're craving first." } });
    const user = userEvent.setup();
    render(<RecommendForm />);

    await user.type(screen.getByLabelText(/what are you craving/i), "hi");
    await user.click(screen.getByRole("button", { name: /find dishes/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/craving/i);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("shows a friendly message on network failure", async () => {
    global.fetch = vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    const user = userEvent.setup();
    render(<RecommendForm />);

    await user.type(screen.getByLabelText(/what are you craving/i), "pizza");
    await user.click(screen.getByRole("button", { name: /find dishes/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't reach/i);
    expect(screen.queryByText(/network down/i)).not.toBeInTheDocument();
  });

  it("disables the submit control while a request is in flight", async () => {
    let resolveFetch: () => void = () => {};
    global.fetch = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = () =>
            resolve({
              ok: true,
              json: async () => ({ source: "ai", items: [], note: null, message: null }),
            } as Response);
        }),
    ) as unknown as typeof fetch;

    const user = userEvent.setup();
    render(<RecommendForm />);

    await user.type(screen.getByLabelText(/what are you craving/i), "warm cheesy");
    await user.click(screen.getByRole("button", { name: /find dishes/i }));

    const button = await screen.findByRole("button", { name: /analyzing your cravings/i });
    expect(button).toBeDisabled();

    resolveFetch();
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: /analyzing your cravings/i }),
      ).not.toBeInTheDocument(),
    );
  });
});