import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "brand" | "neutral";
  className?: string;
};

/** Compact label pill — used for merchandising tags like "Popular". */
export default function Badge({ children, tone = "brand", className = "" }: BadgeProps) {
  const tones = {
    brand: "bg-brand-soft text-brand-dark",
    neutral: "bg-cream text-muted",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
