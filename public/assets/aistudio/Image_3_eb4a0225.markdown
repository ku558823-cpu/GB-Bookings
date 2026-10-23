---
name: GB Bookings System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4850'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#00685f'
  on-tertiary: '#ffffff'
  tertiary-container: '#008378'
  on-tertiary-container: '#f4fffc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.5rem
    fontWeight: '800'
    lineHeight: 3rem
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.875rem
    fontWeight: '800'
    lineHeight: 2.25rem
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '700'
    lineHeight: 1.75rem
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
  price-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '800'
    lineHeight: 1.75rem
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system drives a conversion-oriented, dependable travel marketplace tailored for expeditions, stays, and transport across Gilgit-Baltistan. The aesthetic balances crisp informational architecture with the visual precision of modern travel giants. It builds immediate consumer confidence in remote bookings through high-contrast structural framing, crystal-clear typography, and unambiguous interactive feedback.

The personality balances utilitarian efficiency with adventurous discovery:
- **Trustworthy & Authoritative:** High-contrast structural boundaries, unmistakable visual hierarchy, and prominent verification cues.
- **Approachable & Modern:** Clean geometric sans-serif type paired with warm, softened container radiuses.
- **Frictionless Utility:** High scanning speed, clear pricing typography, and dense, structured booking filters.

## Colors

The palette is engineered for maximum readability, contrast, and conversion velocity against bright daylight viewing conditions common during active travel.

- **Primary (`#0284C7`):** Vivid Sky Azure. Reserved for trust indicators, active tab underlines, star rating accents, verified vendor badges, and highlighted search modifiers.
- **Secondary (`#0F172A`):** Deep Slate Jet. Applied to primary call-to-action buttons, high-priority pricing displays, and primary headlines to guarantee immediate legibility.
- **Tertiary (`#0D9488`):** Deep Mountain Emerald. Used selectively for confirmation banners, positive availability states, eco-friendly transit badges, and verified mountain guide stamps.
- **Neutrals:**
  - `#FFFFFF`: Pure canvas background.
  - `#F8FAFC`: Secondary background for filters, sticky headers, and input fills.
  - `#F1F5F9`: Chip surfaces and inactive segmented control backgrounds.
  - `#E2E8F0`: Subtle, structural dividing lines and card outlines.
  - `#64748B`: Mid-tone body secondary copy, metadata, and icon states.
  - `#1E293B`: Deep body text for descriptions and policies.

## Typography

The typographic pairing balances approachable modern geometry with neutral structural legibility:

- **Display & Headlines (Plus Jakarta Sans):** Brings a welcoming, premium marketplace rhythm. The wide geometric forms deliver clear section distinction across accommodation titles, destination cards, and booking steppers.
- **Body & Controls (Inter):** Highly neutral and utilitarian, Inter handles high-density listing metrics, facility tags, tabular fare comparisons, and legibility on mobile screens under high sunlight.
- **Price Display:** Employs tight tabular spacing and heavy weight (`800`) to anchor scanning eyes on commercial details immediately.

## Layout & Spacing

The layout is built upon an 8pt spatial grid configured to handle data-dense search, multi-faceted filtering, and photo-heavy destination grids.

- **Desktop (1024px+):** 12-column fluid grid within a `1280px` maximum content container. Search modules span the full width or 8/4 splits for listing feeds and sticky map layouts. Desktop margins are fixed at `2rem` (`32px`), with `1.5rem` (`24px`) gutters.
- **Tablet (768px - 1023px):** 8-column layout. Filter sidebars collapse into a modal trigger strip; card grids convert from 3-column to 2-column arrays.
- **Mobile (< 768px):** 4-column layout with strict `1rem` outer canvas padding. Components snap edge-to-edge when presenting image carousels, with interactive padding inset cleanly.
- **Vertical Spacing:** Component internal padding uses strict multiples: `0.5rem` for compact pills, `1rem` for input fields and card interiors, and `1.5rem` to `2rem` for major search modules and content sections.

## Elevation & Depth

Depth is established primarily through crisp structural surface outlines combined with low-opacity ambient shadows, avoiding heavy drops to preserve a pristine, modern marketplace aesthetic.

- **Level 0 (Flat Canvas):** `#FFFFFF` main background with `#E2E8F0` 1px borders to delineate sections, card surfaces, and list separators.
- **Level 1 (Card & Filter Surfaces):** Subtle ambient shadow (`0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`) combined with a 1px border (`#E2E8F0`). Used for inactive listing cards, segmented tab bars, and search inputs.
- **Level 2 (Hover & Active Booking Cards):** Mild elevation (`0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`). Used when hovering property cards, date-picker flyouts, and guest selection dropdowns.
- **Level 3 (Overlays & Sticky Mobile Navigation):** High floating elevation (`0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`). Dedicated to mobile bottom sticky bars, drawer filters, and modal dialogues.

## Shapes

The design uses a balanced `roundedness: 2` scale, pairing approachable curves with dense structural stability.

- **Base Radius (`0.5rem` / `8px`):** Applied to standard inputs, interactive buttons, badge containers, and image corners inside card components.
- **Container Radius (`1rem` / `16px`):** Applied to full card wrappers, search engine composite blocks, and modal dialogs.
- **Large Radius (`1.5rem` / `24px`):** Applied to primary mobile sheet pullouts and featured visual banners.
- **Pill (`9999px`):** Reserved strictly for filter chips, rating pill overlays, verified check stamps, and active category switches.

## Components

### Buttons
- **Primary:** Background `#0F172A`, text `#FFFFFF`, border-radius `0.5rem`, padding `0.75rem 1.5rem`. Hover shifts to `#1E293B`. Used for checkout, booking confirmation, and primary search execution.
- **Accent:** Background `#0284C7`, text `#FFFFFF`. Used for high-priority conversion triggers (e.g., "Reserve Now", "Unlock Member Deal").
- **Secondary:** Background `#F8FAFC`, border 1px solid `#E2E8F0`, text `#0F172A`. Hover shifts border to `#64748B`.
- **Tertiary / Ghost:** Transparent background, text `#0284C7`, hover background `#F0F9FF`.

### Chips & Filter Pills
- Compact horizontal elements styled with a full pill radius (`9999px`).
- **Unselected:** Background `#F1F5F9`, text `#64748B`, 1px solid transparent border.
- **Active:** Background `#E0F2FE`, text `#0284C7`, 1px solid `#0284C7`.

### Cards (Listings & Stays)
- Background `#FFFFFF`, 1px solid `#E2E8F0`, border-radius `1rem`, overflow hidden.
- Includes integrated aspect-ratio (16:10) image carousel with an absolute rating badge (`#0284C7` background, white text, pill radius) top-right.
- Content zone utilizes `1rem` padding: typography uses `headline-sm` for titles, `body-sm` for location cues with an inline pin icon, and a bold `price-display` anchored bottom-right.

### Form Inputs & Search Tabs
- **Search Tabs:** Segmented tab control with `#F1F5F9` container. Active tab sits on `#FFFFFF` with Level 1 shadow and bold `#0F172A` text.
- **Fields:** Inset background `#F8FAFC`, 1px solid `#E2E8F0`, focus state adds a 2px outer ring in `#0284C7` with `#FFFFFF` background. Labels sit compact and upper-cased in `label-sm`.

### Checkboxes & Radios
- Size `1.25rem` (`20px`), border `1.5px solid #CBD5E1`, border-radius `0.25rem` (radios `9999px`).
- Checked state transitions immediately to `#0284C7` fill with clean white interior vectors.

### Travel-Specific Components
- **Trust Badges:** Verified guide stamps and safety accreditations feature a `#0D9488` or `#0284C7` badge with a `0.25rem` rounded container and crisp vector shield icon.
- **Mobile Sticky Navigation:** Fixed to bottom viewport, `#FFFFFF` background with a subtle top border `#E2E8F0` and Level 3 elevation. Features quick-action summary containing real-time price preview and a direct "Reserve" button.
- **Filter Sheet:** Full-height mobile modal with a sticky bottom action bar displaying live listing counts (e.g., "Show 84 Stays").