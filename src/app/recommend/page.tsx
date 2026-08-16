import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import RecommendForm from "@/components/recommend/RecommendForm";

export const metadata: Metadata = {
  title: "Help me decide",
  description:
    "Describe a craving and let Appetite suggest dishes from the menu that fit.",
};

export default function RecommendPage() {
  return (
    <>
      <PageHeader
        title="Help me decide"
        subtitle="Tell us what you're craving and we'll suggest dishes from the Appetite menu — no scrolling required."
      />
      <Container className="py-8">
        <RecommendForm />
      </Container>
    </>
  );
}