import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import ProductCard from "@/components/home/ProductCard";
import { categories, mostPopular, dailyDeals, pizzasAndBurgers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse the full Appetite menu by category.",
};

const allProducts = [...mostPopular, ...dailyDeals, ...pizzasAndBurgers];

export default function MenuPage() {
  return (
    <>
      <PageHeader
        title="Menu"
        subtitle="Browse every dish. Full filtering and product details arrive in a later phase."
      />
      <Container className="py-8">
        {/* Category chips */}
        <ul className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm">
                <span aria-hidden="true">{cat.emoji}</span>
                {cat.name}
              </span>
            </li>
          ))}
        </ul>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </>
  );
}
