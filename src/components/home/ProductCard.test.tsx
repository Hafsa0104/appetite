// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/data";

afterEach(cleanup);

const base: Product = {
  id: "x1",
  name: "Bamboo Margherita",
  blurb: "Fresh basil, mozzarella",
  price: 9.5,
  emoji: "🍕",
  tag: "Popular",
};

describe("ProductCard", () => {
  it("renders name, blurb, formatted price and an accessible Add button", () => {
    render(<ProductCard product={base} />);
    expect(screen.getByRole("heading", { name: "Bamboo Margherita" })).toBeInTheDocument();
    expect(screen.getByText("Fresh basil, mozzarella")).toBeInTheDocument();
    expect(screen.getByText("$9.50")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add bamboo margherita to cart/i }),
    ).toBeInTheDocument();
  });

  it("shows the tag badge when present and hides it when absent", () => {
    const { rerender } = render(<ProductCard product={base} />);
    expect(screen.getByText("Popular")).toBeInTheDocument();
    rerender(<ProductCard product={{ ...base, tag: undefined }} />);
    expect(screen.queryByText("Popular")).not.toBeInTheDocument();
  });
});