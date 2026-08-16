// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import PromoBanner from "./PromoBanner";

afterEach(cleanup);

describe("PromoBanner", () => {
  it("renders the offer heading and a Claim offer CTA to signup", () => {
    render(<PromoBanner />);
    expect(screen.getByRole("heading", { name: /20% off/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /claim offer/i })).toHaveAttribute("href", "/signup");
  });
});