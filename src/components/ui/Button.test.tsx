// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

afterEach(cleanup);

describe("Button", () => {
  it("renders a native <button> with its label when no href", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn.tagName).toBe("BUTTON");
  });

  it("renders a link with the given href when href is provided", () => {
    render(<Button href="/menu">Menu</Button>);
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute("href", "/menu");
  });

  it("calls onClick when activated", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Nope" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies different styles per variant", () => {
    const { rerender } = render(<Button>Primary</Button>);
    const primary = screen.getByRole("button").className;
    rerender(<Button variant="secondary">Secondary</Button>);
    const secondary = screen.getByRole("button").className;
    expect(primary).toContain("bg-brand");
    expect(secondary).toContain("border");
    expect(primary).not.toBe(secondary);
  });
});