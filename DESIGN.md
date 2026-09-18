# DESIGN.md — GharBhada (घरभाडा) Modern Design System & Visual Specification

**Brand Identity:** GharBhada (घरभाडा) / Nepal Rental Marketplace  
**Visual Style:** Modern Hospitality & Clean Slate — Compact, elegant, confident, and hyper-localized for Nepal's peer-to-peer rental ecosystem.

---

## 1. Design Philosophy & Modern Aesthetic

GharBhada marries the functional clarity of modern international marketplaces with authentic Nepali rental realities. The modern redesign eliminates visual heaviness, oversized headings, and bulky borders in favor of a clean, tight, modern interface:

- **Compact, Confident Typography:** Headings feel confident without overpowering the viewport; body text sits at a comfortable, readable 13–15px scale with tight leading.
- **Warm Terracotta & Muted Slate (`#E76F51` & `#0F4C5C`):** Vibrant, welcoming accents referencing Nepal's traditional terracotta brickwork balanced with slate teal for trust and security.
- **Airy, Subdued Surfaces & Thinner Borders:** Subtle `1px` borders (`border-slate-200/70` to `border-slate-200/80`), soft shadows, and clean whitespace instead of heavy cards or harsh dividers.
- **Proportionally Scaled Controls:** Compact form fields, buttons (32–38px height), and refined micro-chips that scale gracefully across mobile and desktop.

---

## 2. Color Tokens

### Primary & Brand Accents
| Token | Hex Value | Purpose |
|---|---|---|
| `primary` | `#E76F51` | Primary CTA, key active selections, price badges |
| `primary-hover` | `#D65D3F` | Interactive hover state for primary elements |
| `primary-container` | `#FFE8D6` | Subtle badge backgrounds, soft notification pills |
| `secondary` | `#0F4C5C` | Secondary accent, location tags, trust shields |
| `secondary-container` | `#E6F0F2` | Verified landlord chips, light accent containers |

### Surfaces & Neutrals
| Token | Hex Value | Purpose |
|---|---|---|
| `surface-canvas` | `#F8FAFC` | Global page background |
| `surface-container-lowest` | `#FFFFFF` | Card backgrounds, dropdown menus, modals |
| `surface-container-low` | `#F1F5F9` | Input fields, filter chip backdrops, secondary tabs |
| `surface-container` | `#E2E8F0` | Hover states, active segmented buttons |
| `border-subtle` | `rgba(226, 232, 240, 0.8)` | Modern hairline borders on cards and inputs |

### Text & Messaging
| Token | Hex Value | Purpose |
|---|---|---|
| `text-primary` | `#0F172A` / `#1E293B` | Main headings, listing titles, primary prices |
| `text-secondary` | `#475569` / `#64748B` | Body copy, meta descriptions, subtitles |
| `text-muted` | `#94A3B8` | Placeholder text, timestamps, secondary indicators |
| `whatsapp` | `#25D366` | Direct WhatsApp action button |
| `viber` | `#7360F2` | Direct Viber action button |

---

## 3. Typography & Compact Type Scale

- **Font Stack:** `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Smoothing:** `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`
- **Tracking:** Headings use tighter tracking (`-0.02em` to `-0.025em`) for a modern editorial feel; body text uses `-0.01em`.

### Modern Type Scale Table
| Role | Size | Line Height | Weight | Letter Spacing | Example Usage |
|---|---|---|---|---|---|
| **Display / Hero H1** | `28px – 32px` | `1.15 – 1.2` | Bold (700) | `-0.025em` | Main hero title on Browse page |
| **Page Header H1** | `22px – 24px` | `1.25` | Bold (700) | `-0.02em` | Listing detail title, Post Rental header |
| **Section Header H2** | `16px – 18px` | `1.3` | Semi-bold (600/700) | `-0.015em` | Form section headings, modal headers |
| **Card Title H3** | `14px – 15px` | `1.35` | Semi-bold (600) | `-0.01em` | Listing card titles, sidebar widget titles |
| **Price Callout** | `18px – 20px` | `1.1` | Bold (700) | `-0.02em` | Listing card `रु 25,000 / mo` |
| **Body (Default)** | `13px – 14px` | `1.5` | Normal (400) | `-0.01em` | Property descriptions, amenity notes |
| **Subtext / Helper** | `12px` | `1.4` | Medium (500) | `normal` | Bilingual subheadings `(भाडामा पोस्ट गर्नुहोस्)` |
| **Micro / Badge** | `10px – 11px` | `1.2` | Semi-bold (600) | `+0.01em` | Status chips, category pills, verification tags |

---

## 4. Component Sizing & Proportions

### Navigation Bar
- Height: `h-16` (64px, reduced from 80px)
- Brand mark: `32px × 32px` icon with `text-base font-bold` logo text
- Nav action buttons: `px-3.5 py-1.5 text-xs font-semibold rounded-lg`
- Border: `border-b border-slate-200/60` with ultra-soft backdrop blur

### Buttons & CTAs
- **Primary Action (Standard):** `px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg`
- **Compact / Card Action:** `px-3 py-1.5 text-xs font-semibold rounded-lg`
- **Pill Filter:** `px-3 py-1 text-xs font-medium rounded-full`
- **Soft Shadows:** `shadow-xs` (`0 1px 2px 0 rgba(0,0,0,0.04)`) with smooth hover transitions

### Form Fields & Inputs
- **Padding:** `px-3.5 py-2` (compact vertical footprint)
- **Text Size:** `text-xs sm:text-sm` (13–14px)
- **Border:** `1px solid rgba(226, 232, 240, 0.8)`
- **Focus Ring:** `ring-1 ring-primary border-primary`
- **Corner Radius:** `rounded-lg` (8px)

### Property Cards & Bentos
- **Card Shell:** `rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs hover:shadow-sm transition-all`
- **Detail Bento Grid:** `h-64 sm:h-80` gallery with `rounded-xl` image masks
- **Spacing:** Spacing gaps between cards tightened from `gap-6` to `gap-4 sm:gap-5`

---

## 5. Responsive Behavior & Mobile Optimization

- **Mobile Viewport (< 640px):**
  - Hero font scales gracefully from `24px` to `28px`
  - Body text maintains minimum `13px` for crisp legibility
  - Bento photo gallery converts into a clean single or 2-up preview
  - Filter chips support horizontal smooth-scroll with touch momentum
  - Sticky bottom action bar on mobile listing details ensures instant WhatsApp/Call access without obscuring content
