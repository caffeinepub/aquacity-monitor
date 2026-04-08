# Design Brief — AquaCity Monitor

## Purpose & Context
Smart Water Distribution Monitoring System for academic capstone. Admin dashboard tracking water usage, pressure, leaks across urban distribution network. Institutional authority + data-first clarity.

## Tone & Aesthetic
Professional academic. Clean, trustworthy, systems-oriented. Water-centric (teal/cyan). Status-driven (green normal, red critical). Presentation-ready for technical defense.

## Color Palette

| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary | 0.50 0.08 240° | Deep teal — water systems authority, CTAs |
| Secondary | 0.70 0.06 250° | Soft cyan — data highlights, secondary actions |
| Success | 0.60 0.12 160° | Calm green — normal/safe status badges |
| Destructive | 0.55 0.22 25° | Critical red — leak severity, alerts |
| Accent | 0.70 0.06 250° | Cyan — interactive states, focus rings |
| Neutral | 0.92 0.01 220° | Warm gray — surfaces, borders, subtle depth |

## Typography
- **Display**: Figtree (academic authority, headers)
- **Body**: DM Sans (clean readability, tables, descriptions)
- **Mono**: System monospace (data values, timestamps)

## Elevation & Depth
- **Background**: Subtle warm-gray tint (0.98 L, 0.01 C)
- **Card**: Pure white with teal-tinted border (0.88 L)
- **Sidebar**: Light neutral (0.96 L) with teal primary accents
- **Interactive hover**: Soft shadow (`elevated: 0 8px 16px rgba(80,160,240,0.12)`)

## Structural Zones

| Zone | Treatment | Notes |
|------|-----------|-------|
| Header | Teal bar (primary color) white text, logo, title | Full-width fixed or sticky |
| Sidebar | Light neutral bg, teal accent on active, collapsible mobile | Icons + labels, 3–4 main nav items |
| Main Content | White cards grid on warm-gray bg (0.98 L) | KPI row, data tables, map section |
| KPI Cards | Elevated card + large metric + badge | 4-card grid on mobile, flex responsive |
| Data Tables | Card-wrapped table, row left-border coded (green/red) | Sortable columns, inline actions |
| Map | Full-width card, embedded Leaflet | Pipe networks, area circles, leak markers |

## Component Patterns
- **Status Badges**: Inline `badge-success` (green bg), `badge-critical` (red bg), `badge-normal` (cyan bg)
- **Data Row**: Left border 4px (green=normal, red=critical) for rapid status scanning
- **KPI Card**: Metric block + label + trend indicator + badge
- **Sidebar Toggle**: Mobile hamburger, expand/collapse animation
- **Table Actions**: Inline edit/delete in row context menu, confirm dialogs

## Motion & Interaction
- **Default transition**: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- **Sidebar toggle**: `accordion-up/down` 0.2s ease-out
- **Page entry**: `fade-in` 0.3s + `slide-down` 0.3s staggered
- **Status badges**: `pulse-subtle` 2s ease-in-out for live alerts
- **Hover**: Shadow elevation + color shift

## Constraints
- Max 3 colors per section (primary, secondary, neutral)
- Min 4.5:1 contrast ratio on all text
- Mobile-first responsive (`sm:`, `md:`, `lg:` breakpoints)
- No decorative gradients; use OKLCH color system exclusively
- Sidebar collapses below `md` breakpoint

## Signature Detail
Live status badges with subtle pulse animation on critical leaks. Teal accent color applied consistently to interactive elements and active navigation to reinforce water theme. Card-based grid system with intentional spacing rhythm (8px base) reflecting data hierarchy.

## Deliverables
- `src/frontend/src/index.css` — OKLCH tokens, font-face, utility classes
- `src/frontend/tailwind.config.js` — boxShadow, keyframes, animations
- Design preview: `.platform/design/preview-1775639407363.jpg`
