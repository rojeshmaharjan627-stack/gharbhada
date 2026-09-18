# DESIGN.md — GharBhada (घरभाडा) Sleek Modern Design System

**Brand Identity:** GharBhada (घरभाडा) — Nepal's Direct Rental Marketplace  
**Aesthetic:** Clean, current, and polished — modern typography, single refined accent palette, Lucide iconography, and lightweight CSS animations.

---

## 1. Design Principles

1. **Focused & Modern:** Elimination of bulky visual elements, oversized text, and heavy outlines. Interfaces prioritize generous whitespace, hairline borders (`border-slate-200/80`), and soft elevation (`shadow-xs` / `shadow-sm`).
2. **Refined Limited Color Palette:** A single dominant terracotta accent (`#E76F51`) paired with clean neutral slates and whites. Clashing or extraneous colors are prohibited.
3. **Subtle & Fast Interactivity:** Animations are lightweight, responsive, and brief (150–280ms) with `cubic-bezier(0.16, 1, 0.3, 1)` deceleration.
4. **Mobile Performance First:** Pure CSS animations and inline SVG icons to ensure instantaneous rendering on mobile 3G/4G networks across Nepal.

---

## 2. Refined Color System

| Role | Token | Hex | Usage |
|---|---|---|---|
| **Primary Accent** | `primary` | `#E76F51` | Key CTAs, active pills, price tags, brand logo |
| **Primary Hover** | `primary-hover` | `#D65D3F` | Interactive hover state for primary buttons |
| **Primary Light** | `primary-light` | `#FFF5F2` | Subtle notification pills, active category tint |
| **Trust Accent** | `secondary` | `#0F4C5C` | Verified badges, location indicators, owner tags |
| **Surface Background** | `surface` | `#F8FAFC` | Global page background (neutral slate-50) |
| **Card Surface** | `surface-card` | `#FFFFFF` | Listing cards, search shell, modal panels |
| **Subtle Neutral** | `slate-50` / `slate-100` | `#F8FAFC` / `#F1F5F9` | Inputs, secondary buttons, thumbnail placeholders |
| **Border Neutral** | `slate-200` | `rgba(226, 232, 240, 0.8)` | Hairline 1px card and control boundaries |
| **Headings Text** | `slate-900` | `#0F172A` | Primary headlines, property titles, key numbers |
| **Body Text** | `slate-600` | `#475569` | Descriptions, metadata, bilingual subtext |
| **Muted Text** | `slate-400` / `slate-500` | `#94A3B8` / `#64748B` | Timestamps, placeholders, helper text |
| **Chat WhatsApp** | `whatsapp` | `#25D366` | Direct WhatsApp action button |
| **Chat Viber** | `viber` | `#7360F2` | Direct Viber action button |

---

## 3. Modern Compact Typography

- **Font Stack:** `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Smoothing:** `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`

### Type Scale Specification
| Token | CSS Class | Size / Leading | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| **Hero Title** | `text-2xl sm:text-3xl` | `28px – 32px / 1.2` | Bold (700) | `-0.025em` | Browse view main headline |
| **Page Header (H1)** | `text-xl sm:text-2xl` | `20px – 24px / 1.25` | Bold (700) | `-0.02em` | Listing detail title, Post rental header |
| **Section Header (H2)** | `text-base sm:text-lg` | `16px – 18px / 1.3` | Bold (700) | `-0.015em` | Form section headings, modal titles |
| **Card Title (H3)** | `text-sm font-semibold` | `14px / 1.35` | Semi-bold (600) | `-0.01em` | Listing card titles, widget headers |
| **Price Callout** | `text-base sm:text-lg` | `16px – 18px / 1.1` | Bold (700) | `-0.02em` | `रु 25,000 / mo` |
| **Body (Default)** | `text-xs sm:text-sm` | `13px – 14px / 1.5` | Normal (400) | `-0.01em` | Property descriptions, amenity notes |
| **Subtext / Helper** | `text-xs` | `12px / 1.4` | Medium (500) | `normal` | Bilingual subheadings, owner notes |
| **Micro / Badge** | `text-[10px] – text-[11px]`| `10px – 11px / 1.2` | Semi-bold (600) | `+0.01em` | Status chips, category pills |

---

## 4. Spacing, Borders & Geometry

- **Border Radius:**
  - `rounded-lg` (8px): Inputs, compact buttons, quick action chips, thumbnail masks.
  - `rounded-xl` (12px): Listing cards, search shell, modal panels, image carousel container.
  - `rounded-full` (9999px): Category pills, status indicators, avatar circles.
- **Elevation Tokens:**
  - `shadow-xs`: `0 1px 2px 0 rgba(15, 23, 42, 0.04)` (Resting cards, buttons)
  - `shadow-sm`: `0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`
  - `shadow-md`: `0 4px 12px -2px rgba(15, 23, 42, 0.08)` (Card hover lift)
  - `shadow-nav`: `0 1px 4px 0 rgba(15, 23, 42, 0.05)` (Scrolled header shadow)
- **Grid Spacing:** Standard gap between cards is `gap-5` (20px), internal card padding is `p-3.5` to `p-4`.

---

## 5. Iconography: Lucide Icon System

- **Standard Library:** Lucide (`lucide` npm package / `src/lib/icons.js`).
- **Stroke Width:** `2px` (standard uniform stroke).
- **Default Sizing:** `14px – 16px` (`w-3.5 h-3.5` or `w-4 h-4`).
- **Helper Usage:** `getIcon(iconName, { class: 'w-4 h-4 text-primary' })`.

---

## 6. Animation, Timing & Interactivity Specifications

All animations are implemented in pure CSS to keep the application blazing fast on mobile networks:

### 1. Timing & Easing Curves
- **Standard Duration:** `150ms – 280ms` (fast, crisp, never sluggish).
- **Easing Curve:** `cubic-bezier(0.16, 1, 0.3, 1)` (snappy spring deceleration).
- **Hover Transitions:** `duration-200 ease-out`.

### 2. Staggered Card Entrance (`.stagger-card`)
- Cards slide in with opacity from 0 to 1 and `translateY(12px)` to `0`.
- Stagger calculation: `animation-delay: ${Math.min(index * 45, 360)}ms;`

### 3. Card Hover Lift (`.card-hover`)
- On hover: `transform: translateY(-2px);`
- Box shadow elevates from `shadow-xs` to `shadow-md`
- Border subtly deepens to `border-slate-300`

### 4. Page & Route Transitions (`.page-transition`)
- Triggered on route change in `router.js`.
- Smooth fade + subtle lift (`translateY(6px)` to `0`) over `200ms`.

### 5. Skeleton Loading Shimmer (`.skeleton`)
- Animated linear gradient (`#F1F5F9` → `#E2E8F0` → `#F1F5F9`).
- `1.5s infinite ease-in-out` shimmer cycle for cards, photos, and detail skeletons while Supabase queries execute.

### 6. Micro-Interactions
- **Buttons (`.btn-interactive`):** Scale to `0.98` on `:active` with smooth `150ms` spring-back.
- **Form Inputs (`.input-interactive`):** Smooth border color change and subtle `ring-2 ring-primary/20` focus ring.
- **Sticky Top Nav:** Transparent/borderless at top, transitions to `bg-white/95 backdrop-blur-md shadow-nav border-slate-200` when scrolled beyond 12px.

### 7. Listing Detail Carousel
- Multi-photo carousel with fade/slide transitions between active slide and inactive slides.
- Left/right arrow navigation, touch swipe detection (`touchstart`/`touchend`), dot indicators, and scrollable thumbnail bar.
