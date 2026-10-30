---
name: Academic Pulse
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
  on-surface-variant: '#464554'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777586'
  outline-variant: '#c7c4d7'
  surface-tint: '#5148d7'
  primary: '#2a14b4'
  on-primary: '#ffffff'
  primary-container: '#4338ca'
  on-primary-container: '#c1beff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#00442d'
  on-tertiary: '#ffffff'
  tertiary-container: '#005e40'
  on-tertiary-container: '#66daa8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#372abf'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-lg: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The design system targets educators, teaching assistants, and administrative staff who require rapid, zero-friction verification of classroom presence. The visual tone is structured, reassuring, and alert: it avoids cold bureaucratic severity while upholding academic rigor and instructional authority. 

The aesthetic is Modern Tactile Minimalism:
- Razor-sharp typographic scannability paired with deliberate structural hierarchy.
- Direct physical affordances for high-frequency interactions (attendance toggling, roster scanning, bulk operations).
- Calm neutral canvas surfaces that step back, allowing vibrant tri-state student status indicators to command immediate attention.
- Crisp feedback cycles ensuring every roll-call mark provides unambiguous confirmation within dense, dynamic classroom environments.

## Colors
The palette balances an authoritative academic slate-indigo foundation with instant-recognition semantic tokens calibrated for split-second classroom audits.

- **Primary (`#4338CA` - Deep Indigo):** Anchor color for top navigation banners, primary progression triggers, selected tab indicators, and institutional branding elements.
- **Secondary (`#0F172A` - Slate 900):** Anchors high-contrast headings, active student names, and dominant structural contours.
- **Tertiary (`#059669` - Emerald):** Represents confirmed "Present" status, bulk completion milestones, and valid submission states.
- **Status Accents:**
  - **Present:** Deep Emerald (`#059669`) paired with Mint Surface (`#ECFDF5`).
  - **Absent:** Vibrant Rose (`#E11D48`) paired with Blush Surface (`#FFF1F2`).
  - **Late / Excused:** Warm Amber (`#D97706`) paired with Honey Surface (`#FFFBEB`).
- **Neutral Canvas (`#F8FAFC` to `#FFFFFF`):** Multi-tier background hierarchy keeping lists glare-free under standard fluorescent or natural classroom lighting.

## Typography
Typographic rhythm relies on `Geist` across all roles to maximize tabular data alignment, high-density legibility, and modern structural balance.

- Headings use tightened letter-spacing (`-0.01em` to `-0.02em`) to maintain a clean, compact footprint on narrow viewport widths.
- Student display names use `title-md` with semi-bold weights (`600`) to guarantee instant recognition during fast-paced vertical scrolling.
- Status badges and metadata timestamps rely on uppercase or title-cased `label-md` and `label-sm` with expanded tracking to maintain legibility when rendered within tinted background pills.
- Numerical readouts (e.g., "28 / 32 Present") strictly use tabular numeric figures to prevent layout shifting during real-time status changes.

## Layout & Spacing
The layout follows an edge-to-edge mobile-first discipline structured around rapid single-handed operation:

- **Vertical Grid & Roster Spacing:** Student rows and card units align on a consistent 4px baseline sub-grid with standardized `space-md` gaps.
- **Canvas Margins:** `margin` (16px) defines side boundaries for standard portrait viewports, expanding to `margin-lg` (24px) on tablet split-screen layouts.
- **Touch-Boundary Rules:** All interactive elements maintain an absolute minimum touch dimension of 44×44px, irrespective of the visual bounding box of the child icon or label.
- **Safe Zones:** Sticky bottom submission trays and quick-mark navigation drawers incorporate dynamic device bottom-safe insets plus an additional `space-md` clearance.

## Elevation & Depth
Depth is articulated primarily through tonal surface tiers and crisp micro-borders, supported by soft ambient under-glows for active states:

- **Surface Levels:**
  - `Level 0 (Base Canvas):` Slate 50 (`#F8FAFC`).
  - `Level 1 (Card & Row Item):` Crisp Pure White (`#FFFFFF`) with a 1px structural hairline outline in Slate 200 (`#E2E8F0`).
  - `Level 2 (Floating Action Toolbar & Sticky Headers):` Pure White with ambient shadow: `0 4px 16px -2px rgba(15, 23, 42, 0.08)`.
  - `Level 3 (Modal Bottom Sheets & Attendance Verification Overlays):` Pure White with heavy backdrop occlusion (`rgba(15, 23, 42, 0.4)`) and `0 12px 32px -4px rgba(15, 23, 42, 0.16)`.
- **Active Pressed State:** Quick-action segmented controls exhibit an inset micro-depth effect via internal 1px shading, delivering immediate tactile reinforcement upon touch contact.

## Shapes
A unified rounded structure (`roundedness: 2`) softens the functional layout while preserving organized geometry:

- **Roster Cards & Containers:** Standardized at `0.75rem` (12px) to frame student profile blocks with clear boundary separation.
- **Interactive Action Buttons:** Styled with `0.5rem` (8px) corner curvature for precise, responsive touch targets.
- **Status Pills & Count Badges:** Rendered as full pills (`9999px` radius) to visually distinguish immutable status states from actionable rectangular controls.
- **Input Fields & Search Shells:** Uniform `0.5rem` (8px) corner radius for clean visual alignment across toolbar elements.

## Components

### Attendance Quick-Action Segmented Controls
- Tri-state tactile switches embedded directly within each roster row:
  - **Present (P):** Idle state is neutral outlined. Active state activates `#ECFDF5` fill, `#059669` bold label, and a `#059669` perimeter ring.
  - **Late (L):** Idle state is neutral outlined. Active state activates `#FFFBEB` fill, `#D97706` bold label, and an amber border.
  - **Absent (A):** Idle state is neutral outlined. Active state activates `#FFF1F2` fill, `#E11D48` bold label, and a rose border.
- Touch dimension is calibrated at 46px height with equal 1:1:1 column distribution.

### Student Roster Cards
- High-contrast white surfaces framed by subtle Slate 200 borders.
- Contains student avatar/initials badge (40×40px), primary student name (`title-md`), ID/desk descriptor (`body-sm`), and the three-stage tactile action cluster on the right edge.
- Visual state updates dynamically: selecting "Absent" shifts the left card border to a 3px Rose indicator strip.

### Status Pills & Chips
- Compact badges displaying live status indicators ("Present", "Absent", "Late", "Excused").
- Built using `label-md`, uppercase styling, 8px horizontal padding, and 4px vertical padding on full-radius pill silhouettes.
- Color combinations strictly adhere to WCAG AAA contrast against light backgrounds.

### Action Buttons
- **Primary Submission CTA:** Fixed or sticky floating bottom bar. Background `#4338CA`, foreground `#FFFFFF`, height 52px, full width minus horizontal canvas margins, font `label-lg`.
- **Secondary / Bulk Mark Trays:** Ghost and light-indigo tinted surfaces (`#EEF2FF`) for non-destructive actions like "Mark All Present" or "Filter Roster".

### Form Controls & Filter Bars
- Roster search fields feature an embedded lens icon, instant-clear button, 44px field height, `#F1F5F9` background, and zero border until focused (`2px #4338CA` ring).