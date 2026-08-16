import { describe, it, expect } from "vitest";
import {
  catalog,
  catalogIds,
  getProductById,
  inferCategory,
  catalogForPrompt,
} from "./catalog";

describe("catalog", () => {
  it("is non-empty and has unique ids", () => {
    expect(catalog.length).toBeGreaterThan(0);
    const ids = catalog.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("catalogIds matches the catalogue", () => {
    expect(catalogIds.size).toBe(catalog.length);
    for (const p of catalog) expect(catalogIds.has(p.id)).toBe(true);
  });

  it("getProductById returns the trusted local product or undefined", () => {
    const first = catalog[0];
    expect(getProductById(first.id)).toEqual(first);
    expect(getProductById("nonexistent-id")).toBeUndefined();
  });

  it("infers a category for every product", () => {
    for (const p of catalog) {
      expect(typeof inferCategory(p)).toBe("string");
      expect(inferCategory(p).length).toBeGreaterThan(0);
    }
  });

  it("catalogForPrompt exposes id, name, blurb, price, category only", () => {
    const items = catalogForPrompt();
    expect(items.length).toBe(catalog.length);
    const keys = Object.keys(items[0]).sort();
    expect(keys).toEqual(["blurb", "category", "id", "name", "price"]);
  });
});