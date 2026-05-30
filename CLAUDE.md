# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce website for **Yesmos Celulares** (mobile phone parts and technical service in Sahuayo, Mexico). Built with Next.js App Router and deployed as a static export to HostGator.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Build static export (outputs to /out)
npm run lint       # ESLint check
npm run predeploy  # Clean, build, and copy PHP API to /out
npm run deploy     # predeploy + rsync to HostGator (hostgator:~/public_html/)
```

No test suite is configured.

## Architecture

### Static Export + PHP API Hybrid

The site uses `output: 'export'` in [next.config.ts](next.config.ts), generating static HTML in `/out`. Dynamic product data comes from a dual-mode API:

- **Development:** `/app/api/refacciones/route.ts` (Next.js API route with Cheerio/Puppeteer web scraping)
- **Production:** `/app/api/refacciones.php` (copied to `/out/api/` by `predeploy` — runs on HostGator)

The `ProductCatalog` component handles the fallback between these two endpoints automatically.

### App Router Structure

- `app/layout.tsx` — Root layout with full SEO metadata (JSON-LD `LocalBusiness` schema, OpenGraph, Twitter cards)
- `app/page.tsx` — Home page (Server Component)
- `app/cotizaciones/` — Quotations page with `TicketSidebar`
- `components/` — Feature components + `components/ui/` (shadcn/ui primitives)
- `lib/utils.ts` — `cn()` utility (Tailwind class merging via `clsx` + `tailwind-merge`)

### Component Pattern

Default components are React Server Components. Add `"use client"` only for interactivity. The main interactive component is `product-catalog.tsx`, which owns:
- Client-side search with Unicode normalization (accent-insensitive)
- Category filtering and lazy pagination (15 items per page)
- Shopping cart state

### UI Stack

shadcn/ui ("new-york" style, configured in `components.json`) with Radix UI primitives. Add new shadcn components with `npx shadcn@latest add <component>`. Import path alias: `@/*` maps to the project root.

### Image Domains

Remote images are allowed from `filedn.com` and `anegocios.com.mx` (configured in `next.config.ts`). Image optimization is disabled (required for static export).
