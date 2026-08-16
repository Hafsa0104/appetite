// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import SectionHeading from "./SectionHeading";

afterEach(cleanup);

describe("SectionHeading", () => {
  it("renders the title as an h2 by default", () => {
    render(<SectionHeading title="Most Popular" />);
    expect(screen.getByRole("heading", { level: 2, name: "Most Popular" })).toBeInTheDocument();
  });

  it("respects the `as` prop for the heading level", () => {
    render(<SectionHeading title="Sub" as="h3" />);
    expect(screen.getByRole("heading", { level: 3, name: "Sub" })).toBeInTheDocument();
  });

  it("renders the action link only when both label and href are given", () => {
    const { rerender } = render(<SectionHeading title="A" actionLabel="See all" actionHref="/menu" />);
    expect(screen.getByRole("link", { name: "See all" })).toHaveAttribute("href", "/menu");
    rerender(<SectionHeading title="A" actionLabel="See all" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});