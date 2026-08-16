// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import PageHeader from "./PageHeader";

afterEach(cleanup);

describe("PageHeader", () => {
  it("renders the title as an h1", () => {
    render(<PageHeader title="Menu" />);
    expect(screen.getByRole("heading", { level: 1, name: "Menu" })).toBeInTheDocument();
  });

  it("renders the subtitle when provided and omits it otherwise", () => {
    const { rerender } = render(<PageHeader title="A" subtitle="Sub text" />);
    expect(screen.getByText("Sub text")).toBeInTheDocument();
    rerender(<PageHeader title="A" />);
    expect(screen.queryByText("Sub text")).not.toBeInTheDocument();
  });
});