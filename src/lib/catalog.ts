import {
  mostPopular,
  dailyDeals,
  pizzasAndBurgers,
  categories,
  type Product,
} from "@/lib/data";

/**
 * The recommender's single source of truth: every product it may choose from,
 * deduped by id. Built from the existing FE-04 catalogue arrays — data.ts is
 * left untouched.
 */
export const catalog: Product[] = dedupeById([
  ...mostPopular,
  ...dailyDeals,
  ...pizzasAndBurgers,
]);

/** Fast id -> Product lookup for mapping AI results back to trusted local data. */
const byId = new Map(catalog.map((p) => [p.id, p]));

export function getProductById(id: string): Product | undefined {
  return byId.get(id);
}

/** The set of valid ids — passed to the parser to reject invented ids. */
export const catalogIds = new Set(catalog.map((p) => p.id));

/** Category ids available as constraints, from the existing categories list. */
export const categoryIds = categories.map((c) => c.id);

/**
 * data.ts Products carry no explicit `category` field. Rather than modify the
 * FE-04 data structure, we derive a coarse category from the emoji so both the
 * model prompt and the deterministic fallback have category context.
 */
const EMOJI_CATEGORY: Record<string, string> = {
  "🍕": "pizza",
  "🍔": "burgers",
  "🍟": "burgers",
  "🍣": "sushi",
  "🍰": "desserts",
  "🧁": "desserts",
  "🥤": "drinks",
  "🥗": "healthy",
  "🍜": "noodles",
  "☕": "coffee",
};

export function inferCategory(product: Product): string {
  return EMOJI_CATEGORY[product.emoji] ?? "other";
}

/** Minimal, controlled catalogue context sent to the model. */
export type CatalogItem = {
  id: string;
  name: string;
  blurb: string;
  price: number;
  category: string;
};

export function catalogForPrompt(): CatalogItem[] {
  return catalog.map((p) => ({
    id: p.id,
    name: p.name,
    blurb: p.blurb,
    price: p.price,
    category: inferCategory(p),
  }));
}

function dedupeById(items: Product[]): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      out.push(item);
    }
  }
  return out;
}