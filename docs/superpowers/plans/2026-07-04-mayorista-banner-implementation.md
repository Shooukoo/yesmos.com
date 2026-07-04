# Mayorista Banner Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the "IMPORTANTE: Precios Mayoristas" banner from a generic red alert to a modern, premium minimalista design with blue gradient, serif typography, geometric visual element, and responsive layout.

**Architecture:** Add Source Serif 4 font to the root layout, create a reusable geometric SVG pattern component, and rebuild the legal-banner component with new color palette, typography hierarchy, responsive grid layout, and updated CTA button styling. The component remains self-contained in `components/legal-banner.tsx` but with internal subcomponents for better structure.

**Tech Stack:** Next.js (App Router), Tailwind CSS, React, TypeScript, SVG (inline pattern), shadcn/ui Button component

## Global Constraints

- Color Palette: Blue gradient `#3b82f6` → `#2563eb`, Off-white text `#f8f6f1`, Pure white button background `#ffffff`
- Typography: Source Serif 4 (bold, 28px→36px headline), Inter regular (16px→18px body)
- Responsive: Desktop 2-column layout, mobile stacked vertical
- WCAG AA contrast minimum (4.5:1 on body text over gradient)
- Tone: Institutional, professional, not alarming
- File: Component lives in `components/legal-banner.tsx` (refactor existing)

---

## File Structure

**Files to Create:**
- `components/ui/geometric-pattern.tsx` — Reusable SVG geometric pattern (hexagon grid, 10-15% opacity white)

**Files to Modify:**
- `app/layout.tsx` — Add Source Serif 4 font import and CSS variable
- `components/legal-banner.tsx` — Complete rebuild: gradient background, serif headline, responsive grid, new button styling
- No other files affected (banner is already integrated in `app/page.tsx`)

---

## Task 1: Add Source Serif 4 Font to Root Layout

**Files:**
- Modify: `app/layout.tsx:1-10`

**Interfaces:**
- Produces: CSS variable `--font-serif` available globally via `className={serif.variable}`

**Steps:**

- [ ] **Step 1: Open layout.tsx and locate the Inter font import**

Current location: lines 1-8 (import statement and font initialization)

- [ ] **Step 2: Add Source Serif 4 import below Inter**

```tsx
import { Inter, Source_Serif_4 } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' })
```

Replace the existing:
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
```

- [ ] **Step 3: Add serif.variable to body className**

Find the `<body>` tag (around line 148) and update:

```tsx
<body className={`${inter.variable} ${serif.variable} font-sans antialiased`}>
```

Currently it only has `inter.variable`. Add `${serif.variable}` to make the serif font available.

- [ ] **Step 4: Verify globals.css includes serif variable**

Check `app/globals.css` line 128:
```css
--font-serif: 'Source Serif 4', 'Source Serif 4 Fallback';
```

This is already there, so no changes needed. The serif font is now wired up.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: Add Source Serif 4 font to root layout

Enables serif typography for banner redesign. Font variable registered as --font-serif globally."
```

---

## Task 2: Create Geometric Pattern SVG Component

**Files:**
- Create: `components/ui/geometric-pattern.tsx`

**Interfaces:**
- Produces: `<GeometricPattern />` component, exports default React component
- Props: None required; internal SVG with 10-15% opacity white
- Usage: `import { GeometricPattern } from '@/components/ui/geometric-pattern'`

**Steps:**

- [ ] **Step 1: Create the geometric pattern file**

Create `components/ui/geometric-pattern.tsx` with this content:

```tsx
export function GeometricPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        {/* Hexagon grid pattern */}
        <defs>
          <pattern
            id="hexagons"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Hexagon outline */}
            <polygon
              points="30,0 60,15 60,45 30,60 0,45 0,15"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.12"
            />
            {/* Horizontal line */}
            <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="1" opacity="0.08" />
          </pattern>
        </defs>

        {/* Fill with pattern */}
        <rect width="400" height="300" fill="url(#hexagons)" />

        {/* Subtle accent lines (angular, motion-like) */}
        <line x1="100" y1="20" x2="200" y2="80" stroke="white" strokeWidth="2" opacity="0.1" />
        <line x1="250" y1="30" x2="350" y2="120" stroke="white" strokeWidth="2" opacity="0.08" />
        <line x1="50" y1="150" x2="300" y2="220" stroke="white" strokeWidth="2" opacity="0.09" />
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Verify file creation**

Run:
```bash
ls -la components/ui/geometric-pattern.tsx
```

Expected: File exists with ~60 lines of SVG code.

- [ ] **Step 3: Commit**

```bash
git add components/ui/geometric-pattern.tsx
git commit -m "feat: Create geometric pattern SVG component

Reusable hexagon grid pattern with subtle accent lines, 10-15% white opacity. Used as visual element in banner redesign."
```

---

## Task 3: Rebuild Legal Banner Component

**Files:**
- Modify: `components/legal-banner.tsx` (complete rewrite)

**Interfaces:**
- Consumes: `GeometricPattern` component (from Task 2)
- Produces: `<LegalBanner />` component, default export, used in `app/page.tsx`
- Replaces: Previous red alert style with blue gradient minimalista design

**Steps:**

- [ ] **Step 1: Open legal-banner.tsx and review current structure**

Current file: `components/legal-banner.tsx` (40 lines, red alert style with AlertTriangle icon)

- [ ] **Step 2: Replace entire file with new design**

```tsx
'use client'

import Link from 'next/link'
import { GeometricPattern } from '@/components/ui/geometric-pattern'

export function LegalBanner() {
  return (
    <section className="relative bg-gradient-to-b from-[#3b82f6] to-[#2563eb] overflow-hidden">
      {/* Geometric pattern background */}
      <GeometricPattern />

      {/* Content container with relative positioning (above pattern) */}
      <div className="relative z-10 container mx-auto px-5 py-12 sm:px-10 sm:py-16 md:py-20 lg:px-12">
        {/* Desktop: Grid 2 columns, Mobile: Flex column */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-center">
          {/* Left column: Text content */}
          <div className="flex flex-col justify-center">
            {/* Headline: Serif, bold, white */}
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
              IMPORTANTE: Precios Mayoristas
            </h3>

            {/* Body text: Inter, off-white */}
            <p className="text-base sm:text-lg text-[#f8f6f1] font-medium mb-3 leading-relaxed">
              Los precios mostrados son tarifa{' '}
              <strong className="font-bold">exclusiva para reparadores profesionales</strong> de la
              región.
            </p>

            {/* Secondary text: Slightly recessed */}
            <p className="text-sm sm:text-base text-[#f8f6f1] text-opacity-85 mb-6 leading-relaxed">
              ¿Eres cliente final? Usa nuestro cotizador para ver precios especiales al público.
            </p>

            {/* Button: White background, blue text */}
            <div className="flex">
              <Link
                href="/cotizaciones"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-white text-[#3b82f6] px-7 font-semibold hover:bg-opacity-90 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md hover:shadow-[rgba(59,130,246,0.15)] select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Ver precios al público →
              </Link>
            </div>
          </div>

          {/* Right column: Geometric visual (hidden on mobile, visible on desktop) */}
          <div className="hidden md:flex items-center justify-center min-h-[240px]">
            {/* SVG pattern fills this container via GeometricPattern's absolute positioning */}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify the new component structure**

Check the file has:
- Blue gradient background (`from-[#3b82f6] to-[#2563eb]`)
- Serif headline using `font-serif` class
- Off-white text colors (`#f8f6f1`)
- White button with blue text
- Responsive grid (1 column mobile, 2 column desktop via `md:grid-cols-2`)
- GeometricPattern component imported and used

- [ ] **Step 4: Test in browser (visual verification)**

Run the dev server:
```bash
npm run dev
```

Navigate to http://localhost:3000 and scroll to the banner section. Verify:
- Blue gradient background appears (not red)
- "IMPORTANTE: Precios Mayoristas" is visible in serif font
- Text is white/off-white and readable
- Button is white with blue text
- Desktop: 2-column layout with pattern on right (pattern shows subtle hexagons)
- Mobile: Stacked layout, pattern fills background
- Geometric pattern is subtle (10-15% opacity)

- [ ] **Step 5: Check responsive behavior**

Open browser DevTools and test:
- Mobile (375px width): Text stacked, button full-width behavior, pattern background
- Tablet (768px width): 2-column layout appears
- Desktop (1024px): Full 2-column with spacing

Expected: Layout shifts from column at `md:` breakpoint, no horizontal scroll, text readable on all sizes.

- [ ] **Step 6: Verify accessibility**

- Open DevTools → Accessibility panel
- Check color contrast of off-white text on blue gradient: should be ≥4.5:1 (WCAG AA)
- Tab through page: Button should have visible focus outline (white outline, browser default)
- Keyboard navigate to button and press Enter: should navigate to `/cotizaciones`

- [ ] **Step 7: Commit**

```bash
git add components/legal-banner.tsx
git commit -m "feat: Redesign Mayorista banner with blue gradient and minimalista style

- Replace red alert with blue gradient background (#3b82f6 → #2563eb)
- Add serif headline (Source Serif 4) and off-white body text
- Integrate geometric SVG pattern (hexagon grid, 10-15% opacity)
- Responsive layout: 2-col desktop, stacked mobile
- Update button: white background, blue text, hover effects
- Remove AlertTriangle icon
- WCAG AA contrast compliant"
```

---

## Task 4: Final Verification and Polish

**Files:**
- No new files; verification only

**Interfaces:**
- Consumes: Completed banner from Task 3, geometric pattern from Task 2

**Steps:**

- [ ] **Step 1: Run linter to check for TypeScript/ESLint errors**

```bash
npm run lint
```

Expected: No errors in `components/legal-banner.tsx` or `components/ui/geometric-pattern.tsx`. If errors appear, fix them (e.g., unused imports, type issues).

- [ ] **Step 2: Test dark mode (if applicable)**

If your site has dark mode toggle, navigate to banner and verify:
- Gradient remains the same (high contrast)
- Off-white text remains readable against blue gradient
- Button styling works in dark mode context

Expected: No contrast issues, button click still works.

- [ ] **Step 3: Verify page build (static export)**

Run:
```bash
npm run build
```

Expected: Build succeeds, no warnings about missing fonts or components. Output shows `/out` directory with static files.

- [ ] **Step 4: Check home page in built output**

Navigate to `/out/index.html` and verify the banner HTML is rendered with correct classes:
- `bg-gradient-to-b from-[#3b82f6] to-[#2563eb]` in inline styles or class
- `font-serif` applied to headline
- No `AlertTriangle` icon in the rendered HTML

- [ ] **Step 5: Cross-browser test (optional but recommended)**

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (if available)

Expected: Gradient renders, text readable, button clickable, no layout shifts.

- [ ] **Step 6: Final commit (if any polish changes made)**

If no changes in this task:
```bash
git log --oneline -3
```

Expected: Last 3 commits show banner redesign tasks.

If changes made (e.g., lint fixes):
```bash
git add .
git commit -m "chore: Polish banner redesign (lint, build verification)"
```

---

## Plan Self-Review

**Spec Coverage:**
- ✅ Color palette (blue gradient #3b82f6 → #2563eb, off-white #f8f6f1, white button) — Task 3
- ✅ Typography (Source Serif 4 headline, Inter body) — Task 1 + Task 3
- ✅ Layout (2-col desktop, stacked mobile) — Task 3
- ✅ Visual element (geometric pattern SVG) — Task 2 + Task 3
- ✅ Responsive behavior — Task 3 + Task 4
- ✅ Accessibility (WCAG AA contrast, focus states) — Task 3 + Task 4
- ✅ Button styling (white bg, blue text) — Task 3
- ✅ Integration (uses existing LegalBanner in app/page.tsx, no changes needed) — Task 3

**Placeholder Scan:**
- No "TBD" or "TODO" anywhere
- All code snippets are complete and runnable
- All commands are exact with expected outputs
- No vague instructions like "add error handling" — all steps show what to do and how

**Type Consistency:**
- GeometricPattern exports as default function (Task 2)
- GeometricPattern imported in legal-banner.tsx (Task 3)
- All className strings are valid Tailwind (Task 3)
- Font variables (serif, inter) match globals.css definitions (Task 1)

**Scope Check:**
- Plan is focused: redesign one banner component
- No unrelated refactoring
- All tasks are pre-requisite ordered (Task 1 → Task 2 → Task 3 → Task 4)
