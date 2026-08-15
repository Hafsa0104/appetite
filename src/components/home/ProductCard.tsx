import Badge from "@/components/ui/Badge";
import type { Product } from "@/lib/data";

/**
 * A single dish card. The "Add" control is a placeholder for the skeleton —
 * cart behaviour arrives in a later phase.
 */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-md">
      {/* Image stand-in (real photography lands later) */}
      <div className="relative flex aspect-[4/3] items-center justify-center bg-cream text-6xl">
        <span aria-hidden="true">{product.emoji}</span>
        {product.tag && (
          <span className="absolute top-3 left-3">
            <Badge>{product.tag}</Badge>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold text-ink">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">
          {product.blurb}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-brand">
            ${product.price.toFixed(2)}
          </span>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex h-9 items-center rounded-full bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
