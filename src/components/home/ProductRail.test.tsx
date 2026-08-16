// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ProductRail from "./ProductRail";
import type { Product } from "@/lib/data";

afterEach(cleanup);

const products: Product[] = [
  { id: "a", name: "Alpha Pizza", blurb: "cheese", price: 8, emoji: "🍕" },
  { id: "b", name: "Beta Burger", blurb: "beef", price: 7, emoji: "🍔", tag: "Popular" },
];

describe("ProductRail", () => {
  it("renders the titled section and one card per product", () => {
    render(
      <ProductRail
        headingId="popular"
        title="Most Popular"
        subtitle="What everyone's ordering"
        products={products}
        actionLabel="See all"
        actionHref="/menu"
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Most Popular" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Alpha Pizza" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Beta Burger" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /add .* to cart/i })).toHaveLength(2);
    expect(screen.getByRole("link", { name: "See all" })).toHaveAttribute("href", "/menu");
  });

  it("links the section to its heading id for accessibility", () => {
    const { container } = render(
      <ProductRail headingId="deals" title="Deals" products={products} />,
    );
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "deals");
  });
});