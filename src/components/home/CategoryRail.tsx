import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "./SectionHeading";
import { categories } from "@/lib/data";

/** "Our Menu" — a horizontally scrollable rail of food categories. */
export default function CategoryRail() {
  return (
    <section aria-labelledby="our-menu-heading">
      <Container className="py-6">
        <SectionHeading
          id="our-menu-heading"
          title="Our Menu"
          subtitle="Browse by craving"
          actionLabel="See all"
          actionHref="/menu"
        />
        <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {categories.map((cat) => (
            <li key={cat.id} className="shrink-0">
              <Link
                href="/menu"
                className="flex w-24 flex-col items-center gap-2 rounded-2xl border border-line bg-white p-3 text-center transition-colors hover:border-brand"
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-2xl"
                  aria-hidden="true"
                >
                  {cat.emoji}
                </span>
                <span className="text-sm font-medium text-ink">{cat.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
