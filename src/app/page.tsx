import Hero from "@/components/home/Hero";
import CategoryRail from "@/components/home/CategoryRail";
import ProductRail from "@/components/home/ProductRail";
import PromoBanner from "@/components/home/PromoBanner";
import { mostPopular, dailyDeals, pizzasAndBurgers } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryRail />

      <ProductRail
        headingId="most-popular-heading"
        title="Most Popular"
        subtitle="What everyone's ordering right now"
        products={mostPopular}
        actionLabel="See all"
        actionHref="/menu"
      />

      <ProductRail
        headingId="daily-deals-heading"
        title="Your Daily Deals"
        subtitle="Limited-time savings, refreshed daily"
        products={dailyDeals}
        actionLabel="See all"
        actionHref="/menu"
        tinted
      />

      <ProductRail
        headingId="pizzas-burgers-heading"
        title="Pizzas & Burgers"
        subtitle="The classics, done right"
        products={pizzasAndBurgers}
        actionLabel="See all"
        actionHref="/menu"
      />

      <PromoBanner />
    </>
  );
}
