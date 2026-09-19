# DESIGN.md — GharBhada (घरभाडा) World-Class Design System Specification

**Brand Identity:** GharBhada (घरभाडा) — Nepal's Direct Rental Marketplace  
**Aesthetic Benchmark:** Airbnb's listing cards, Linear's typography and spacing discipline, Stripe's fluid micro-interactions and glassmorphism.

---

## 1. Modern Color Palette

| Token | Hex Code | Visual Name | Role & Usage |
|---|---|---|---|
| `bg-primary` / `page-bg` | `#F8FAFC` | Crisp Slate 50 | Global page background, modern clean canvas |
| `surface` | `#FFFFFF` | Pure White | Elevated cards, modal panels, navbar, search surface |
| `border-subtle` | `#E2E8F0` | Fine Slate Border | Clean 1px hairline borders on cards, inputs, and dividers |
| `text-primary` | `#0F172A` | Deep Slate 900 | Primary headings, titles, prices, active text |
| `text-secondary`| `#475569` | Neutral Slate 600 | Body text, descriptions, metadata, subtitles |
| `text-muted` | `#94A3B8` | Subtle Slate 400 | Micro labels, timestamps, placeholders |
| `primary` / `accent` | `#F04D36` | Vibrant Coral | High-contrast CTA buttons, price highlights, active states |
| `primary-hover` | `#E03A22` | Deep Vermilion | Button hover and pressed feedback |
| `success` | `#10B981` | Emerald Green | Verified owner badges, available indicators, confirmations |
| `whatsapp` | `#25D366` | WhatsApp Green | Direct WhatsApp communication CTA |
| `viber` | `#7360F2` | Viber Purple | Direct Viber communication CTA |

---

## 2. Typography & Hierarchy

- **Primary Font Stack:** `'Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', system-ui, -apple-system, sans-serif`
- **Base Body Size:** `15px`, Line-Height: `1.5`
- **Headings Rule:** Maximum `36px` (`text-4xl`), Line-Height: `1.15`
- **Devanagari Support:** Full Unicode rendering for Nepali numbers (१, २, ३) and labels.

---

## 3. Layout, Spacing & Card Anatomy

- **Container Radii Standard:**
  - **Cards & Surface Containers:** Exactly `16px` (`rounded-2xl`)
  - **Buttons & Form Inputs:** Exactly `10px - 12px` (`rounded-xl`)
  - **Pills / Micro Badges:** Fully rounded (`rounded-full`)
- **Card Shadow (Multi-Tier Elevation):**
  - Resting: `0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)`
  - Hover: `0 12px 28px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.03)`
  - Floating Panels: `0 14px 34px -6px rgba(15, 23, 42, 0.1)`

---

## 4. Animation Physics & Micro-Interactions

| Interaction | Class / Selector | Duration | Easing | Behavior |
|---|---|---|---|---|
| **Page Route Transition** | `.page-transition` | `220ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Soft crossfade (`opacity: 0 -> 1`) with 2px vertical ease |
| **Card Hover Lift** | `.card-modern` | `280ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Lifts `3px` (`translateY(-3px)`), shadow expands, border sharpens |
| **Card Photo Zoom** | `.img-zoom` | `450ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Smooth `scale(1.04)` inside `overflow-hidden` container |
| **Heart Save Toggle** | `.heart-pop` | `250ms` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Pop animation (`scale(1.3) -> 1`) on active tap |
| **Button Micro-Press** | `.btn-press` | `150ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Smooth tactile `scale(0.98)` |
| **Primary Button Hover**| `.btn-modern` | `200ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Lifts `1px` with subtle coral glow shadow |
| **Skeleton Loading** | `.skeleton-shimmer` | `1.5s infinite` | `ease-in-out` | Ambient wave between `#F1F5F9` and `#E2E8F0` |
