# Banner "Precios Mayoristas" — Design Spec

**Date:** 2026-07-04  
**Status:** Design Review  
**Component:** LegalBanner (refactor)

---

## Overview

Redesign the "IMPORTANTE: Precios Mayoristas" banner on the Yesmos home page to replace the generic red alert style with a modern, premium, institutional design that aligns with brand identity and feels professional rather than alarming.

**Location:** Home page (`app/page.tsx`), below the "Catálogo de Refacciones" section  
**Audience:** Reparadores profesionales (professional repair technicians)  
**Tone:** Institutional/informative (not exclusive, not alarming)

---

## Design Direction: Minimalista Premium

A clean, sophisticated banner with:
- Blue gradient background (brand-aligned)
- Off-white text on dark blue
- Serif headline + sans-body typography
- Geometric pattern or minimal illustration as visual anchor (right side, desktop)
- Responsive layout: side-by-side desktop, stacked mobile

---

## Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary Gradient (top) | Brand Blue | `#3b82f6` | Background gradient start |
| Primary Gradient (bottom) | Darker Blue | `#2563eb` | Background gradient end |
| Text – Headline | Pure White | `#ffffff` | Main heading "IMPORTANTE: Precios Mayoristas" |
| Text – Body | Off-White | `#f8f6f1` | Supporting copy, description text |
| Text – Muted | Off-White 85% | `rgba(248, 246, 241, 0.85)` | Secondary paragraphs |
| Accent – Button BG | Pure White | `#ffffff` | CTA button background |
| Accent – Button Text | Brand Blue | `#3b82f6` | CTA button text |
| Visual Element | White 10–15% | `rgba(255, 255, 255, 0.1)` | Geometric pattern or illustration overlay |

---

## Typography

### Headline
- **Font:** Source Serif 4 (serif) or similar characterful serif
- **Size:** 28px (mobile, `sm:`) → 36px (tablet/desktop, `md:`)
- **Weight:** 700 (Bold)
- **Line Height:** 1.2
- **Text:** "IMPORTANTE: Precios Mayoristas"
- **Color:** Pure white (`#ffffff`)
- **Tracking:** Slightly tight (letter-spacing: -0.5px) for formality

### Body
- **Font:** Inter (sans-serif) — matches site default
- **Size:** 16px (mobile) → 18px (desktop)
- **Weight:** 400 (Regular)
- **Line Height:** 1.6
- **Color:** Off-white 95% opacity (`rgba(248, 246, 241, 0.95)`)
- **Paragraphs:**
  1. "Los precios mostrados son tarifa **exclusiva para reparadores profesionales** de la región."
     - **Word:** "exclusiva para reparadores profesionales" → bold (700), same color
  2. "¿Eres cliente final? Usa nuestro cotizador para ver precios especiales al público."
     - Color: Off-white 85% opacity (slightly recessed)

### Button
- **Font:** Inter Semibold (600)
- **Size:** 14px (mobile) → 15px (desktop)
- **Text:** "Ver precios al público →"
- **Background:** Pure white
- **Text Color:** Brand blue (`#3b82f6`)
- **Padding:** 12px 24px
- **Border Radius:** 8px
- **Hover:** Background opacity 90%, slight box-shadow (`0 4px 12px rgba(59, 130, 246, 0.15)`)
- **Transition:** 150ms ease-in-out

---

## Layout

### Desktop (≥768px / `md:`)
```
┌─────────────────────────────────────────────────────────────────┐
│ [Gradient: #3b82f6 → #2563eb]                                  │
│                                                                 │
│  Padding: 48px 40px                                            │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │ [Serif Headline]        │  │ [Geometric Pattern /        │  │
│  │ IMPORTANTE:             │  │  Illustration]              │  │
│  │ Precios Mayoristas      │  │                             │  │
│  │                         │  │ White @ 10-15% opacity      │  │
│  │ [Body Text]             │  │                             │  │
│  │ Los precios mostrados   │  │ ~280px width × 240px height │  │
│  │ son tarifa exclusiva    │  │                             │  │
│  │ para reparadores...     │  │                             │  │
│  │                         │  │                             │  │
│  │ [Secondary Text]        │  │                             │  │
│  │ ¿Eres cliente final?    │  │                             │  │
│  │ Usa nuestro...          │  │                             │  │
│  │                         │  │                             │  │
│  │ [Button]                │  │                             │  │
│  │ Ver precios al público │  │                             │  │
│  │                         │  │                             │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Text column: ~55%, Visual column: ~40%, gap: 5%
```

### Tablet (≥640px / `sm:`)
Same as desktop (two-column layout).

### Mobile (<640px)
```
┌─────────────────────────────────────────────────────────────────┐
│ [Gradient: #3b82f6 → #2563eb]                                  │
│                                                                 │
│  Padding: 32px 20px                                            │
│                                                                 │
│  [Serif Headline]                                              │
│  IMPORTANTE: Precios Mayoristas                                │
│                                                                 │
│  [Body Text]                                                   │
│  Los precios mostrados son tarifa exclusiva...                 │
│                                                                 │
│  [Geometric Pattern / Illustration]                            │
│  Full width, ~180px height                                     │
│                                                                 │
│  [Secondary Text]                                              │
│  ¿Eres cliente final?...                                       │
│                                                                 │
│  [Button]                                                      │
│  Ver precios al público →                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Stacked vertically, headline → pattern → body → button
```

---

## Visual Element: Geometric Pattern

### Purpose
Provide visual interest and brand sophistication without being illustrative or literal.

### Options

**Option 1: Geometric Grid Pattern** (Recommended)
- Subtle grid of hexagons or circles
- Lines at 20–30% opacity
- Angled/rotated to suggest motion or professionalism
- ~280px × 240px (desktop)

**Option 2: Abstract Arrows / Flow**
- Directional lines suggesting "forward progress" or "professional growth"
- Angular, modern aesthetic
- Complements serif headline

**Option 3: Minimalist Illustration**
- Small, stylized toolkit or mobile device icon (representing repair/professional work)
- Larger scale, ~200px width
- Line art style, white strokes only

**Recommendation:** Option 1 (geometric grid). It's abstract enough to feel premium, distinctly different from the current red alert, and ties to a "professional, structured" narrative without being too literal.

---

## Component Structure

**File:** `components/legal-banner.tsx` (rename from current; or keep name, update internals)

### Props
None required (static content for now; could be extended later).

### Subcomponents
- `LegalBannerContainer` — Wrapper with gradient + padding
- `LegalBannerContent` — Two-column grid (text + visual)
- `LegalBannerText` — Left column: headline + paragraphs + button
- `LegalBannerVisual` — Right column: SVG pattern or static illustration

### Responsive Behavior
- Desktop (`md:`): Grid 2 columns, gap-40
- Mobile: Flex column, stack vertically
- Heading: text-2xl `sm:text-4xl` for scaling
- Padding: px-5 `sm:px-10` `md:px-12` for horizontal safety

---

## Accessibility

- **Contrast:** Off-white on blue gradient (≥4.5:1 WCAG AA compliance)
- **Semantic:** `<section>` wrapper, `<h3>` for headline, `<p>` for body
- **Button:** Proper `<a>` or `<button>` with visible focus state (outline on :focus-visible)
- **Reduced Motion:** Respect `prefers-reduced-motion` (no animation on hover/focus, just color change)
- **Mobile:** Full-width button, adequate tap target (≥44×44px)

---

## Dark Mode

Gradient and colors remain the same (already high contrast). Test on dark mode to ensure off-white text remains readable; if needed, slightly increase opacity of text.

---

## Implementation Notes

1. **Serif Font:** Add Source Serif 4 to `next/font/google` in `app/layout.tsx`
   ```tsx
   import { Source_Serif_4 } from 'next/font/google'
   const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' })
   ```

2. **Gradient:** Use Tailwind `bg-gradient-to-b from-[#3b82f6] to-[#2563eb]`

3. **SVG Pattern:** Create a simple geometric pattern SVG (~4KB) or use inline Tailwind divs with absolute positioning

4. **Button Styling:** Use shadcn Button component with custom className overrides or inline styles for the white background + blue text combination

5. **Removed:** Delete AlertTriangle icon; no longer needed

---

## Success Criteria

- [ ] Banner visually distinct from previous red alert style
- [ ] Text readable and hierarchy clear (serif headline > body > secondary)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Meets WCAG AA contrast ratio (4.5:1+)
- [ ] Aligns with Yesmos brand (blue gradient, off-white, professional)
- [ ] Geometric visual element renders cleanly on all breakpoints
- [ ] Button hover states responsive and accessible

---

## References

- Current banner: `components/legal-banner.tsx`
- Brand colors: `app/globals.css` (--primary: #3b82f6)
- Font: Inter (existing), Source Serif 4 (to add)
- Page integration: `app/page.tsx` (uses `<LegalBanner />`)
