/**
 * Central site configuration.
 * Keeping nav + metadata here means the header, footer, and pages
 * all read from one source of truth instead of duplicating links.
 */

export const site = {
  name: "Appetite",
  tagline: "Cravings, delivered fast.",
  description:
    "Appetite is a modern food-delivery app — order from your favourite kitchens and track it to your door.",
  // Path where the real 3D panda logo PNG should live (see README).
  logoSrc: "/appetite-logo.png",
} as const;

/** Primary content routes shown in the main navigation. */
export const mainNav: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Footer link groups (placeholder destinations for the skeleton). */
export const footerNav: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Menu", href: "/menu" },
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/signup" },
    ],
  },
  {
    heading: "System",
    links: [{ label: "Health check", href: "/health" }],
  },
];

/** Languages offered by the language selector (placeholder). */
export const languages = ["EN", "UR", "AR", "FR"] as const;
export type Language = (typeof languages)[number];
