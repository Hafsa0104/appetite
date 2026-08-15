import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

/** Full-width promotional banner — the one place red goes edge to edge. */
export default function PromoBanner() {
  return (
    <section aria-labelledby="promo-heading">
      <Container className="py-10">
        <div className="flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-brand px-6 py-10 text-center text-white sm:px-10 md:flex-row md:text-left">
          <div className="flex-1">
            <h2 id="promo-heading" className="font-display text-2xl font-bold sm:text-3xl">
              Get 20% off your first three orders
            </h2>
            <p className="mt-2 max-w-xl text-white/90">
              Sign up today and let our panda chef take care of dinner. No code
              needed — the discount is applied at checkout.
            </p>
          </div>
          <div className="shrink-0">
            <Button href="/signup" size="lg" variant="inverse">
              Claim offer
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
