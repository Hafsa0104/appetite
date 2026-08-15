import Container from "@/components/ui/Container";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

/** Consistent title block for content routes (menu, about, contact…). */
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="border-b border-line bg-cream">
      <Container className="py-10 sm:py-12">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-muted">{subtitle}</p>}
      </Container>
    </div>
  );
}
