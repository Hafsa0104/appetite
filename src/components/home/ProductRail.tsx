import Container from "@/components/ui/Container";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/data";

type ProductRailProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  actionLabel?: string;
  actionHref?: string;
  /** Optional warm-wash background to separate alternating sections. */
  tinted?: boolean;
  headingId: string;
};

/**
 * A titled grid of product cards. Reused for "Most Popular",
 * "Your Daily Deals" and "Pizzas & Burgers" so those sections stay
 * consistent and there's a single place to evolve card layout.
 */
export default function ProductRail({
  title,
  subtitle,
  products,
  actionLabel,
  actionHref,
  tinted = false,
  headingId,
}: ProductRailProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={tinted ? "bg-brand-wash" : "bg-white"}
    >
      <Container className="py-8">
        <SectionHeading
          id={headingId}
          title={title}
          subtitle={subtitle}
          actionLabel={actionLabel}
          actionHref={actionHref}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
