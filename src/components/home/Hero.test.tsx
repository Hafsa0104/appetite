// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Hero from "./Hero";

afterEach(cleanup);

describe("Hero", () => {
  it("renders a single h1 headline", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("exposes the three CTAs with correct destinations (incl. the recommender entry point)", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /help me decide/i })).toHaveAttribute("href", "/recommend");
    expect(screen.getByRole("link", { name: /explore the menu/i })).toHaveAttribute("href", "/menu");
    expect(screen.getByRole("link", { name: /create an account/i })).toHaveAttribute("href", "/signup");
  });
});