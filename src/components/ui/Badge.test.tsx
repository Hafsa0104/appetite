// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Badge from "./Badge";

afterEach(cleanup);

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>Popular</Badge>);
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });

  it("uses brand tone by default and neutral tone when requested", () => {
    const { rerender } = render(<Badge>Tag</Badge>);
    expect(screen.getByText("Tag").className).toContain("bg-brand-soft");
    rerender(<Badge tone="neutral">Tag</Badge>);
    expect(screen.getByText("Tag").className).toContain("bg-cream");
  });
});