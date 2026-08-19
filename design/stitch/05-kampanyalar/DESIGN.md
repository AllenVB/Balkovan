---
name: Balkovan Artisanal System
colors:
  surface: '#fff8f4'
  surface-dim: '#f2d5bc'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1e7'
  surface-container: '#ffead9'
  surface-container-high: '#ffe3cb'
  surface-container-highest: '#faddc4'
  on-surface: '#271909'
  on-surface-variant: '#554334'
  inverse-surface: '#3e2d1c'
  inverse-on-surface: '#ffeee0'
  outline: '#887362'
  outline-variant: '#dbc2ae'
  surface-tint: '#8c5000'
  primary: '#8c5000'
  on-primary: '#ffffff'
  primary-container: '#f9930a'
  on-primary-container: '#603500'
  inverse-primary: '#ffb873'
  secondary: '#984715'
  on-secondary: '#ffffff'
  secondary-container: '#fd965e'
  on-secondary-container: '#732f00'
  tertiary: '#625e52'
  on-tertiary: '#ffffff'
  tertiary-container: '#b1ab9d'
  on-tertiary-container: '#434034'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcbf'
  primary-fixed-dim: '#ffb873'
  on-primary-fixed: '#2d1600'
  on-primary-fixed-variant: '#6a3b00'
  secondary-fixed: '#ffdbcb'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783100'
  tertiary-fixed: '#e9e2d2'
  tertiary-fixed-dim: '#ccc6b7'
  on-tertiary-fixed: '#1e1c12'
  on-tertiary-fixed-variant: '#4a473b'
  background: '#fff8f4'
  on-background: '#271909'
  surface-variant: '#faddc4'
typography:
  display-lg:
    fontFamily: Fraunces
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  price-display:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is rooted in the "Honest Producer" persona—an aesthetic that prioritizes warmth, earthiness, and transparency over corporate slickness. It captures the tactile sensation of a local apiary through a "Tactile Minimalism" approach.

The visual language emphasizes:
- **Warmth and Modesty:** Utilizing soft, cream-based backgrounds instead of sterile whites.
- **Handcrafted Quality:** High-contrast serif typography paired with organic, generous spacing.
- **Earthy Texture:** Subtle use of honeycomb geometric patterns as low-opacity background watermarks to reinforce origin without cluttering the interface.
- **Trustworthy Clarity:** An interface that feels grounded and permanent, avoiding trendy animations in favor of stable, purposeful transitions.

## Colors

The palette is derived from the lifecycle of honey and the earth it springs from. 

- **Backgrounds:** Never use pure white. `cream` (#fffcf5) is the default page surface to reduce eye strain and increase warmth. `comb` (#fdf6e6) is used for secondary containers and cards to create soft structural depth.
- **Primary Actions:** `honey-500` is the brand signature, used for highlights and secondary buttons. 
- **High-Contrast Actions:** `amber-deep` is reserved for "Buy" buttons, price tags, and critical calls to action to ensure accessibility and visual hierarchy.
- **Typography:** `ink` (#2b1c0c) provides a high-contrast, legible base that feels more natural and "printed" than pure black.

## Typography

This design system utilizes a "Soft Editorial" typographic pairing. 

- **Fraunces:** Selected for headlines to convey a handcrafted, artisanal feel. Its slight irregularities suggest a human touch. Use `700` weight for main titles and `600` for subtitles.
- **Inter:** Chosen for its exceptional legibility in e-commerce contexts. It handles data-heavy sections and descriptions with a neutral, professional tone.
- **Price Formatting:** All prices must use `Inter` with **tabular-nums** enabled to ensure vertical alignment in lists and carts. 
- **Localization:** Adhere to Turkish currency formatting: `1.234,56 ₺`.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. Content is centered within a maximum width of 1280px to maintain readability on ultra-wide monitors.

- **Grid:** Use a 12-column grid for desktop with 24px gutters. On mobile, transition to a 4-column grid with 16px margins.
- **Whitespace:** Ample breathing room is a core brand pillar. Vertical "stacks" should favor `stack-lg` (48px) between major sections to prevent a cluttered "discount store" feel.
- **Alignment:** Content should feel grounded and heavy at the bottom, using asymmetrical padding where necessary to mimic organic placement.

## Elevation & Depth

To avoid the "SaaS look," this design system rejects harsh drop shadows and neon glows. Depth is achieved through **Tonal Stacking** and **Warm Ambient Shadows**.

- **Surfaces:** Use `cream` as the base level. Elevate cards and modals using `comb`.
- **Shadows:** Shadows should be extremely soft, using a warm tint rather than grey. Use a multi-layered shadow approach: `0 4px 20px rgba(70, 25, 3, 0.06)`. This creates a subtle "lifted off the paper" effect.
- **Interactions:** When hovering over product cards, the shadow should slightly deepen and the element should scale by 1% (1.01) to simulate a physical pull.

## Shapes

The shape language is defined by the "Softened Hexagon" concept. While actual hexagons are used sparingly as decorative accents, the UI components adopt a consistent 16px radius.

- **Standard Components:** Buttons, Input fields, and Cards all share the `rounded-lg` (16px) property to feel approachable and "ripe."
- **Small Elements:** Chips, tags, and checkboxes use `rounded-sm` (4px) to maintain crispness at smaller scales.
- **Icons:** Use rounded caps and joins in iconography to match the corner radius of the UI.

## Components

- **Buttons:**
    - *Primary:* `amber-deep` background with white text. 16px border radius. Bold Inter font.
    - *Secondary:* `honey-100` background with `honey-900` text. Soft tactile feel.
- **Product Cards:**
    - Background: `comb`.
    - Border: 1px solid `honey-100`.
    - Shadow: Soft warm ambient shadow on hover.
    - Image: 16px top-rounded corners, subtle inner-glow to define edges against the background.
- **Input Fields:**
    - Border: 2px solid `honey-200`. 
    - Focus State: 2px solid `honey-500` with a subtle `honey-50` outer glow.
    - Label: `ink-muted`, positioned above the field.
- **Chips & Tags:**
    - Used for product attributes (e.g., "Organic", "Raw"). Background: `honey-50`. Text: `honey-800`.
- **Lists:**
    - Product lists should use generous 16px padding between items with a light `honey-100` divider line.
- **Cart Summary:**
    - Fixed bottom bar on mobile or sticky sidebar on desktop. Use `amber-deep` for the final price and checkout button to drive conversion.