# Appetite — Food Delivery App

A modern food-delivery web app. This repository is the **FE-04 skeleton**
("Capstone Skeleton, Deployed") and is the same project that will grow into the
Week 8 capstone — nothing here is throwaway.

Built with **Next.js (App Router) · TypeScript · Tailwind CSS v4**.
Server Components by default; Client Components only where interactivity requires
them (currently just the site header).

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file from the example
cp .env.example .env.local

# 3. Run the dev server
npm run dev
# open http://localhost:3000
```

### Scripts

| Command         | What it does               |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint                 |

---

## Project structure

```
src/
  app/
    layout.tsx            Root layout: fonts, metadata, skip link, global chrome
    page.tsx              Homepage (composes home components)
    globals.css           Design tokens (@theme) + base styles
    not-found.tsx         Custom 404
    menu/ about/ contact/ login/ signup/    Routed pages
    health/page.tsx       Health check — fetches /api/health and renders it
    api/health/route.ts   Health API endpoint (JSON)
  components/
    layout/   DeliveryBar, Header (client), Footer
    brand/    Logo
    home/     Hero, CategoryRail, ProductRail, ProductCard, PromoBanner, SectionHeading
    ui/       Container, Button, Badge, PageHeader, icons
  lib/
    site.ts   Nav config + site metadata
    data.ts   Placeholder catalogue data + types
public/
  appetite-logo.png       Brand logo (see "Logo" below)
```

## Routes

| Route         | Type            | Purpose                              |
| ------------- | --------------- | ------------------------------------ |
| `/`           | Static          | Homepage                             |
| `/menu`       | Static          | Menu (placeholder grid)              |
| `/about`      | Static          | About (placeholder)                  |
| `/contact`    | Static          | Contact (placeholder + form)         |
| `/login`      | Static          | Log in (placeholder form)            |
| `/signup`     | Static          | Sign up (placeholder form)           |
| `/health`     | Dynamic         | Fetches `/api/health` and renders it |
| `/api/health` | Dynamic (route) | Returns live JSON health status      |

---

## Design tokens

Defined once in `src/app/globals.css` under Tailwind v4's `@theme`, so they're
available as utilities (`bg-brand`, `text-brand`, `bg-cream`, `font-display`…):

- `--color-brand` `#e4222e` — the single red accent (CTAs, prices, active states)
- `--color-brand-dark` — hover/pressed
- `--color-brand-soft` / `--color-brand-wash` — subtle red fills/washes
- `--color-ink` — warm near-black text
- `--color-muted` — secondary text
- `--color-cream` — warm off-white section background
- `--color-line` — hairline borders

White is the dominant page background; red is reserved for emphasis.

Fonts are **self-hosted** via `@fontsource` (Poppins for display, Inter for body)
— no external font fetch at runtime.

---

## Logo

The brand logo is loaded from **`public/appetite-logo.png`**.

A clearly-labelled **placeholder** currently ships at that path. To use the real
3D panda logo, replace that file **with the same filename** (`appetite-logo.png`)
— no code changes needed. If your asset has very different proportions, adjust the
`width`/`height` in `src/components/brand/Logo.tsx`.

---

## Environment variables

- Copy `.env.example` → `.env.local` for local development.
- `.env*` files are git-ignored; only `.env.example` (placeholders) is committed.
- `NEXT_PUBLIC_*` variables are exposed to the browser — put **non-secret** values
  only. Everything else stays server-only.
- Currently used: `NEXT_PUBLIC_SITE_URL` (absolute URL for metadata).

**Never commit real secrets.** Set production values in your host's dashboard.

---

## Deployment (Vercel)

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** your GitHub repo.
3. Framework preset is auto-detected as **Next.js**. No build settings changes needed.
4. (Optional) Add `NEXT_PUBLIC_SITE_URL` in **Settings → Environment Variables**
   set to your production URL.
5. **Deploy.** Every push to the default branch → Production; every push to any
   other branch / PR → a **Preview** deployment.

### Verification checklist

- [ ] Production build succeeds (no build errors in the deploy log)
- [ ] Live URL loads the homepage
- [ ] `/menu`, `/about`, `/contact`, `/login`, `/signup` all load
- [ ] `/health` shows a green status and live values (not hard-coded)
- [ ] `/api/health` returns JSON
- [ ] Pushing a commit to a branch produces a Preview URL that builds
- [ ] No `.env` file or secret is present in the repository
- [ ] Layout works at 375px and 1280px (no horizontal scroll)

---

## Roadmap

FE-04 foundation → full Appetite app (auth, cart, checkout, orders, delivery
tracking) → meaningful AI integration → testing → accessibility & performance
audits → production deployment (Week 8 capstone). This skeleton is built so those
features slot into the existing architecture without a rebuild.
