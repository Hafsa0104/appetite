import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

/**
 * Homepage hero. White-dominant with a warm cream panel and the red
 * accent reserved for the headline highlight and primary CTA.
 */
export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="bg-white">
      <Container className="py-10 sm:py-14">
        <div className="grid items-center gap-8 rounded-3xl bg-cream p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <Badge>🐼 Fresh, fast, friendly</Badge>
            <h1
              id="hero-heading"
              className="font-display mt-4 text-3xl leading-tight font-bold text-ink sm:text-4xl lg:text-5xl"
            >
              Your next favourite meal, <span className="text-brand">delivered hot</span>.
            </h1>
            <p className="mt-4 max-w-md text-base text-muted">
              Order from the kitchens you love and track every bite to your door.
              Appetite brings the neighbourhood to your table.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/menu" size="lg">
                Explore the menu
              </Button>
              <Button href="/signup" size="lg" variant="secondary">
                Create an account
              </Button>
            </div>
            <dl className="mt-8 flex gap-8">
              <div>
                <dt className="text-xs text-muted">Delivery in</dt>
                <dd className="font-display text-lg font-semibold text-ink">30 min</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Kitchens</dt>
                <dd className="font-display text-lg font-semibold text-ink">500+</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Rating</dt>
                <dd className="font-display text-lg font-semibold text-ink">4.8★</dd>
              </div>
            </dl>
          </div>

          {/* Playful food collage stand-in (real photography lands later) */}
          <div
            className="relative mx-auto grid aspect-square w-full max-w-sm grid-cols-2 gap-4"
            aria-hidden="true"
          >
            {["🍕", "🍔", "🍣", "🍰"].map((food) => (
              <div
                key={food}
                className="flex items-center justify-center rounded-3xl bg-white text-6xl shadow-sm"
              >
                {food}
              </div>
            ))}
            <div className="absolute inset-0 -z-0 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand text-5xl shadow-lg">
                🐼
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
