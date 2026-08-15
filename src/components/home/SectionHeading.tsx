import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  /** Optional short line under the title. */
  subtitle?: string;
  /** Optional "see all" style action on the right. */
  actionLabel?: string;
  actionHref?: string;
  /** Heading level for correct document outline. Defaults to h2. */
  as?: "h2" | "h3";
  id?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  actionLabel,
  actionHref,
  as: Tag = "h2",
  id,
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <Tag
          id={id}
          className="font-display text-xl font-semibold text-ink sm:text-2xl"
        >
          {title}
        </Tag>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="shrink-0 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
