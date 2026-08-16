// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Container from "./Container";

afterEach(cleanup);

describe("Container", () => {
  it("renders children and merges the max-width with a custom class", () => {
    render(
      <Container className="py-8">
        <p>Inside</p>
      </Container>,
    );
    const wrapper = screen.getByText("Inside").parentElement as HTMLElement;
    expect(wrapper.className).toContain("max-w-7xl");
    expect(wrapper.className).toContain("py-8");
  });
});