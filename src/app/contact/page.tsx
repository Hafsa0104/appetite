import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Appetite team.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact us"
        subtitle="Questions, feedback, or a craving that needs sorting? Reach out."
      />
      <Container className="py-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4 text-ink">
            <div>
              <h2 className="font-display text-lg font-semibold">Support</h2>
              <p className="text-muted">help@appetite.example</p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Partnerships</h2>
              <p className="text-muted">partners@appetite.example</p>
            </div>
            <p className="text-sm text-muted">
              This is a routed placeholder for the FE-04 skeleton — a working contact
              form arrives in a later phase.
            </p>
          </div>

          {/* Accessible placeholder form (inert submit for now) */}
          <form className="space-y-4" aria-label="Contact form">
            <div>
              <label htmlFor="c-name" className="block text-sm font-medium">
                Name
              </label>
              <input
                id="c-name"
                name="name"
                type="text"
                autoComplete="name"
                className="mt-1 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="c-email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="c-email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-1 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="c-message" className="block text-sm font-medium">
                Message
              </label>
              <textarea
                id="c-message"
                name="message"
                rows={4}
                className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Send message
            </button>
          </form>
        </div>
      </Container>
    </>
  );
}
