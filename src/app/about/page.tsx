import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description: "What Appetite is and who it's for.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Appetite"
        subtitle="A modern food-delivery experience with a friendly panda chef at its heart."
      />
      <Container className="py-10">
        <div className="max-w-2xl space-y-4 text-ink">
          <p>
            Appetite connects hungry people with the kitchens they love. Order in a
            few taps, watch your food get prepared, and track your rider all the way
            to the door.
          </p>
          <p className="text-muted">
            This page is a routed placeholder for the FE-04 skeleton. The full story,
            team, and mission content will land in a later phase.
          </p>
        </div>
      </Container>
    </>
  );
}
