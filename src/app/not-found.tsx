import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-20 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-4xl">
        🐼
      </div>
      <h1 className="font-display text-3xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 max-w-md text-muted">
        Our panda chef looked everywhere but couldn&apos;t plate this one. Let&apos;s
        get you back to something tasty.
      </p>
      <div className="mt-6">
        <Button href="/">Back to home</Button>
      </div>
    </Container>
  );
}
