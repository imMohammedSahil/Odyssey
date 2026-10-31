# 🎨 Odyssey Visual Revamp: Design System & Style Guide

Based on the reference design, this guide defines the theme, color palette, typography, visual motifs, and UI component standards for the complete frontend revamp.

---

## 1. Aesthetic DNA: "Neo-Brutalist Comic / Playful Pop"

- **Visual Tone**: Bold, quirky, playful, cartoonish, high-contrast.
- **Core Structural Rules**:
  - **Heavy Outlines**: Solid `3px` to `4px` black borders (`#0A0A0A`) on all buttons, cards, badges, and illustrations.
  - **Hard Drop Shadows**: Zero blur, solid offset shadows (`box-shadow: 4px 4px 0px #000000`).
  - **Sharp Color Blocking**: Full-width high-saturation color sections separated by organic wavy curves, jagged cuts, or dripping borders.
  - **Tactile Hover States**: Buttons press down on hover/active (`transform: translate(2px, 2px)` with shadow reduced to `2px 2px 0px`).

---

## 2. Color Palette (Tokens & Hex)

| Role | Color Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Primary Base** | **Punchy Comic Lime Green** | `#9DE869` | Hero section background, success states, primary highlights |
| **Deep Contrast** | **Abyssal Black** | `#0D0D0D` | Dark sections, typography, heavy borders, hard shadows |
| **Secondary Wave** | **Toxic Seafoam** | `#45B89E` | Secondary section backgrounds, pill badges, info highlights |
| **Warm Accent** | **Mustard Hazard Gold** | `#F7B919` | Third section / feature blocks, warning alerts, star ratings |
| **Action Accent** | **Gummy Brain Pink** | `#FF70A6` | Primary CTA buttons, attention tags, dripping accents |
| **Card / Canvas** | **Off-White Parchment** | `#F9F9F3` | Form inputs, popovers, light card backgrounds |
| **Muted Grey** | **Grave Grey** | `#A8B3B8` | Subdued text on dark backgrounds, secondary borders |

---

## 3. Typography Scale

- **Headings & Display (Primary)**:
  - **Font**: `'Mosko Mappa', 'Archivo Black', sans-serif`
  - **Style**: Ultra-bold, cheeky retro cartoon display font with curved chunky letterforms and heavy visual punch.
  - **File Location**: Put `MoskoMappa.otf` / `.ttf` / `.woff2` inside `frontend/public/fonts/`.
- **Body & Micro-copy**:
  - **Font**: `'Plus Jakarta Sans', 'Inter', system-ui, sans-serif`
  - **Style**: Medium weight (500–600), clean and highly legible to balance the heavy headings.
  - **Caption / Subtitles**: Small (12–14px), placed inline next to buttons or inside badges.

---

## 4. Component Patterns

### A. Buttons
```css
.btn-brutal-pink {
  background-color: #FF70A6;
  color: #0D0D0D;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 28px;
  border: 3px solid #0D0D0D;
  border-radius: 6px;
  box-shadow: 4px 4px 0px #0D0D0D;
  transition: all 0.15s ease-in-out;
}
.btn-brutal-pink:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #0D0D0D;
}
```

### B. Cards & Feature Blocks
- Solid background fill (white or colored).
- Thick `3px` solid black border with rounded corners (`rounded-lg` or `rounded-xl`).
- High-contrast hard drop-shadow (`4px 4px 0px #000`).
- Comic-style vector icons with stitched/patched badge details.

### C. Section Dividers
- Irregular, playful transitions between full-bleed color sections:
  1. **Slime Drips**: SVG drips hanging from the navbar and section tops.
  2. **Jagged Graveyard Cutouts**: Silhouette horizon cuts between green and black sections.
  3. **Wavy Rolling Hills**: Curved SVG transitions separating black and yellow zones.

---

## 5. 2-Day Revamp Roadmap for Odyssey

1. **Phase 1: Global Theme & Assets Foundation**
   - Install fonts & configure Tailwind / CSS color variables.
   - Build reusable Neo-Brutalist primitives: `<BrutalButton>`, `<BrutalCard>`, `<BrutalBadge>`, `<DripDivider>`.
2. **Phase 2: Navigation & Landing Page (IntroPage)**
   - Hero section with bold slogan, Slime Green backdrop, pink CTA button, and playful mascots.
   - Feature blocks (Print, Stationery, Writing) mapped to the 3 colored zones (Black, Seafoam, Hazard Yellow).
3. **Phase 3: Core App Pages**
   - Redesign Print Upload, Stationery Store, Cart, and Admin Dashboard into the new theme.

