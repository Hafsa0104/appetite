import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

type LogoProps = {
  /** Rendered height in px at the largest breakpoint. */
  className?: string;
  priority?: boolean;
};

/**
 * Renders the real Appetite brand logo (the provided 3D panda chef asset).
 *
 * The asset is expected at `public/appetite-logo.png` (see site.logoSrc).
 * A clearly-labelled placeholder ships at that path so the build/preview
 * never shows a broken image — drop your real PNG there with the same
 * filename and it will appear with no code change.
 */
export default function Logo({ className = "", priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label={`${site.name} — home`}
    >
      <Image
        src={site.logoSrc}
        alt={`${site.name} logo`}
        width={150}
        height={44}
        priority={priority}
        className="h-9 w-auto sm:h-10"
      />
    </Link>
  );
}
