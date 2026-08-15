"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/brand/Logo";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import {
  BagIcon,
  ChevronDownIcon,
  CloseIcon,
  GlobeIcon,
  HeartIcon,
  MenuIcon,
  PinIcon,
  SearchIcon,
} from "@/components/ui/icons";
import { mainNav, languages, type Language } from "@/lib/site";

/** Active-aware main navigation links, reused on desktop and in the drawer. */
function NavLinks({
  pathname,
  onNavigate,
  className = "",
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <ul className={className}>
      {mainNav.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "text-brand"
                  : "text-ink hover:text-brand"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Placeholder search field (no search route yet — submits are inert). */
function SearchField({ id = "site-search" }: { id?: string }) {
  return (
    <form
      role="search"
      aria-label="Search Appetite"
      onSubmit={(e) => e.preventDefault()}
      className="relative flex-1"
    >
      <label htmlFor={id} className="sr-only">
        Search dishes, restaurants and cuisines
      </label>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
      <input
        id={id}
        type="search"
        placeholder="Search dishes, restaurants…"
        className="h-11 w-full rounded-full border border-line bg-cream pr-4 pl-10 text-sm text-ink placeholder:text-muted focus:border-brand focus:bg-white focus:outline-none"
      />
    </form>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState<Language>("EN");

  // Close overlays on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setLangOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container>
        {/* Row 1: logo, location, search, actions */}
        <div className="flex h-16 items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            className="rounded-full p-2 text-ink hover:bg-brand-wash lg:hidden"
          >
            <MenuIcon />
          </button>

          <Logo priority className="shrink-0" />

          {/* Location selector (placeholder) */}
          <button
            type="button"
            aria-haspopup="dialog"
            className="ml-1 hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink hover:bg-brand-wash md:inline-flex"
          >
            <PinIcon className="text-brand" />
            <span className="text-muted">Deliver to</span>
            <span className="font-medium">Faisalabad</span>
            <ChevronDownIcon width={16} height={16} className="text-muted" />
          </button>

          {/* Search grows to fill remaining space on desktop */}
          <div className="mx-2 hidden flex-1 lg:flex">
            <SearchField />
          </div>

          {/* Right-side actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Language selector */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={langOpen}
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-ink hover:bg-brand-wash"
              >
                <GlobeIcon width={18} height={18} />
                <span className="font-medium">{lang}</span>
                <ChevronDownIcon width={16} height={16} className="text-muted" />
              </button>
              {langOpen && (
                <ul
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-28 overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-lg"
                >
                  {languages.map((l) => (
                    <li key={l} role="none">
                      <button
                        role="menuitemradio"
                        aria-checked={l === lang}
                        onClick={() => {
                          setLang(l);
                          setLangOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-brand-wash ${
                          l === lang ? "font-semibold text-brand" : "text-ink"
                        }`}
                      >
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Favourites (placeholder) */}
            <button
              type="button"
              aria-label="Favourites"
              className="rounded-full p-2 text-ink hover:bg-brand-wash"
            >
              <HeartIcon />
            </button>

            {/* Cart (placeholder) */}
            <button
              type="button"
              aria-label="Cart, 0 items"
              className="relative rounded-full p-2 text-ink hover:bg-brand-wash"
            >
              <BagIcon />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                0
              </span>
            </button>

            {/* Auth (desktop) */}
            <div className="ml-1 hidden items-center gap-2 lg:flex">
              <Button href="/login" variant="secondary" size="sm">
                Log in
              </Button>
              <Button href="/signup" size="sm">
                Sign up
              </Button>
            </div>
          </div>
        </div>

        {/* Row 2: main nav (desktop) */}
        <nav aria-label="Main" className="hidden pb-2 lg:block">
          <NavLinks pathname={pathname} className="flex items-center gap-1" />
        </nav>

        {/* Search (mobile, below row 1) */}
        <div className="pb-3 lg:hidden">
          <SearchField id="site-search-mobile" />
        </div>
      </Container>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-ink/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-2 text-ink hover:bg-brand-wash"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <button
                type="button"
                className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-2 text-sm"
              >
                <PinIcon className="text-brand" />
                <span className="text-muted">Deliver to</span>
                <span className="font-medium">Faisalabad</span>
              </button>

              <nav aria-label="Mobile">
                <NavLinks
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                  className="flex flex-col gap-1 text-base"
                />
              </nav>

              <hr className="my-4 border-line" />

              <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
                Language
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    aria-pressed={l === lang}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      l === lang
                        ? "border-brand bg-brand-soft font-semibold text-brand-dark"
                        : "border-line text-ink"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
              <Button
                href="/login"
                variant="secondary"
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Button>
              <Button href="/signup" onClick={() => setMobileOpen(false)}>
                Sign up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
