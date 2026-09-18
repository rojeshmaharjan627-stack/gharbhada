# DESIGN.md — GharBhada (घरभाडा) World-Class Design System Specification

**Brand Identity:** GharBhada (घरभाडा) — Nepal's Direct Rental Marketplace  
**Aesthetic Benchmark:** Airbnb's listing cards, Linear's typography and spacing discipline, Stripe's use of whitespace.

---

## 1. Exact Color Palette

| Token | Hex Code | Visual Name | Role & Usage |
|---|---|---|---|
| `bg-primary` / `page-bg` | `#FDFBF7` | Warm Off-White | Global page background, warm organic canvas |
| `surface` | `#FFFFFF` | Pure White | Cards, modal panels, navbar, search surface |
| `border-subtle` | `#F0EBE3` | Warm Stone Border | Hairline 1px borders on cards, inputs, and separators |
| `text-primary` | `#1F1B16` | Deep Umber Charcoal | Primary headings, titles, active labels, prices |
| `text-secondary`| `#6B6258` | Warm Muted Gray | Body text, descriptions, metadata, subtitles |
| `accent-primary`| `#D97757` | Warm Terracotta | Primary action buttons, active tags, links, focus rings |
| `accent-secondary`| `#7C9885` | Muted Sage | Secondary tags, verified highlights, category chips |
| `status-success`| `#5B8266` | Forest Green | Verified owner badges, available indicators, confirmations |
| `status-warning`| `#C1543D` | Rust Red | Error alerts, delete buttons, validation notices |
| `whatsapp` | `#25D366` | WhatsApp Green | Direct WhatsApp communication CTA |
| `viber` | `#7360F2` | Viber Purple | Direct Viber communication CTA |

---

## 2. Typography & Hierarchy

- **Primary Font Stack:** `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Base Body Size:** `15px` (`text-[15px]` / `1rem`), Line-Height: `1.5`
- **Headings Rule:** Maximum `28px` (`text-2xl` / `text-[28px]`), Line-Height: `1.2`
- **Hierarchy Philosophy:** Hierarchy is achieved through weight (`font-semibold` / `600`, `font-medium` / `500`, `font-normal` / `400`) and whitespace discipline rather than oversized font scales alone.

### Typography Scale Table
| Element | Font Size | Line Height | Weight | Color | Tracking |
|---|---|---|---|---|---|
| **Page / Hero Headline** | `26px – 28px` | `1.2` | Semi-bold (600) | `#1F1B16` | `-0.025em` |
| **Section Headings (H2)** | `18px – 20px` | `1.2` | Semi-bold (600) | `#1F1B16` | `-0.02em` |
| **Card Title (H3)** | `15px – 16px` | `1.25` | Semi-bold (600) | `#1F1B16` | `-0.015em` |
| **Price Callout** | `18px – 20px` | `1.1` | Bold (700) | `#D97757` | `-0.02em` |
| **Body Paragraph** | `15px` | `1.5` | Regular (400) | `#1F1B16` | `normal` |
| **Secondary / Meta Text** | `13px – 14px` | `1.4` | Regular (400) | `#6B6258` | `normal` |
| **Micro Labels & Tags** | `11px – 12px` | `1.2` | Medium (500/600) | `#7C9885` / `#6B6258` | `+0.01em` |

---

## 3. Layout, Spacing Grid & Radii Discipline

- **Consistent 8px Spacing Grid:** Standard increments only: `8px`, `16px`, `24px`, `32px`, `48px` (no arbitrary margins or paddings).
- **Border Radius Standard:**
  - **Cards & Surface Containers:** Exactly `12px` (`rounded-[12px]`)
  - **Buttons, Inputs & Interactive Chips:** Exactly `8px` (`rounded-[8px]`)
  - **Pills / Micro Badges:** `6px` (`rounded-[6px]`) or `9999px` (`rounded-full`)
- **Card Shadow (Barely-There):**
  - Resting: `0 1px 3px rgba(0, 0, 0, 0.06)`
  - Elevated/Hover: `0 4px 12px rgba(31, 27, 22, 0.08)`
  - No harsh drop shadows or dark borders.
- **Listing Card Structure (Airbnb Model):**
  1. Large 4:3 dominant photo container (`aspect-[4/3]`) with rounded 12px card boundary
  2. Bold price as the 2nd most prominent element (`रु 25,000 / month`)
  3. Clean property title immediately below
  4. Muted location and category tags (`#7C9885` / `#6B6258`)

---

## 4. Iconography Standard

- **Icon Family:** Lucide icons (`lucide` npm package / tree-shaken `src/lib/icons.js`).
- **Stroke Width:** Uniform `2px`.
- **Icon Sizing:** `14px` (`w-3.5 h-3.5`) for inline metadata, `16px` (`w-4 h-4`) for buttons and controls.

---

## 5. Animation Specifications (Snappy < 300ms)

All micro-interactions and transitions are kept under 300ms:

| Interaction | Class / Selector | Duration | Easing | Behavior |
|---|---|---|---|---|
| **Staggered Card Entrance** | `.card-stagger` | `240ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Fade + 8px slide up, staggered `50ms` apart (`animation-delay: index * 50ms`) |
| **Card Hover Lift** | `.card-airbnb` | `200ms` | `ease-out` | Lifts `2px` (`transform: translateY(-2px)`), shadow deepens to `0 4px 12px rgba(31, 27, 22, 0.08)` |
| **Button Press** | `.btn-press` | `100ms` | `ease-out` | Snappy scale-down (`transform: scale(0.97)` on `:active`) |
| **Page Route Transitions** | `.page-transition`| `200ms` | `ease-out` | Crossfade (`opacity: 0` to `1` + `translateY(4px)` to `0`) |
| **Image Carousel** | `.carousel-slide` | `200ms` | `ease-out` | Smooth slide crossfade with mobile swipe touch momentum |
| **Skeleton Loading** | `.skeleton-shimmer` | `1.5s infinite` | `linear` | Warm gradient shimmer between `#F7F3EC` and `#EBE4D7` |

---

## 6. Verification Checklist for All Screens

- [x] **Browse Screen:** Search bar, category chips, 4:3 Airbnb cards, bold price second, warm shimmer skeletons.
- [x] **Listing Detail Screen:** Breadcrumb, 4:3 carousel with dots/thumbs, bento overview, contact cards with deep links.
- [x] **Post a Rental Screen:** 12px form sections, 8px inputs with focus ring, drag & drop photos, Lucide icons.
- [x] **Login / Signup Screen:** 12px auth card, 8px inputs/buttons, tab switcher, demo quick-fill helper.
- [x] **My Listings Screen:** Landlord stats, 12px cards with status badges, edit/delete actions, warm shimmer skeletons.
