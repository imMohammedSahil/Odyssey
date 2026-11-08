# 🕹️ Odyssey Neo-Brutalist Arcade Showcase — Master Handoff

## 1. Quick Launch & Project Context
- **Stack**: React 19 + Create React App (Port 3000) | Express + MongoDB (Port 5000)
- **Launch Command**: Run `.\start.bat` in the project root to start both frontend & backend servers.
- **Base Student Route**: `/student` ([UploadOrder.js](file:///c:/Holidays/Odyssey/frontend/src/pages/UploadOrder.js))
- **Live Showcase Pages Completed**:
  1. **Writing Essentials**: `/writing` ([Writing.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Writing.jsx), backdrop: `/halloween-reference-landscape.svg`) — *Toxic Lime & Seafoam Green*
  2. **Correction & Marking**: `/stationery/correction` ([Correction.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Correction.jsx), backdrop: `/correction-landscape.svg`) — *Twilight Purple & Pumpkin Orange*
  3. **Paper & Reams**: `/stationery/paper` and `/paper` ([Paper.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Paper.jsx), backdrop: `/paper-landscape.svg`) — *Midnight Slate & Electric Cyan*
  4. **Payment Gateway & Checkout**: `/payment` ([PaymentPage.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/PaymentPage.jsx), backdrop: `/graveyard-gate-landscape.svg?v=24`) — *Gothic Steel Slate, Void Black & Fiery Crimson*

---

## 2. Core Architecture & Strict Layout Rules (Zero Layout Shift)

Every arcade showcase page follows an identical locked geometry to eliminate layout shift:

| Element | Geometry / Styling Constraints |
| :--- | :--- |
| **Main Glass Card (Catalog)** | Width: `660px`, Height: locked at `505px` (`min-height: 505px, max-height: 505px`), `border: 4px solid #0D0D0D`, `box-shadow: 6px 6px 0px #000`, `backdrop-filter: blur(20px)`. |
| **Central Terminal Card (Payment)** | Max-width: `440px`, `border: 4px solid #0D0D0D`, `box-shadow: 8px 8px 0px #0D0D0D`, `backdrop-filter: blur(20px)`, `background: rgba(20, 27, 32, 0.93)`. |
| **Carousel Row (Catalog)** | 3-column layout: Left Circular Arrow (`58×58px`, `border: 3.5px solid #0D0D0D`, `box-shadow: 4px 4px 0px #0D0D0D`) + Center Active Card + Right Circular Arrow (`58×58px`). |
| **Keyboard Navigation** | `ArrowLeft` / `ArrowRight` cycles through current category items; `Escape` returns to previous page / basecamp (`navigate(-1)`). |
| **Top Action Pills** | Minimal top-right action pills (`← BACK TO BASE` and `CART (N)`) with hard offset comic drop shadows (`3px 3px 0px rgba(0,0,0,0.4)`). |
| **Category Switcher** | Centered hero title (`Titan One`, `34px`) with pill tabs directly beneath it (`tab1`, `tab2`, `tab3`). Active tab gets solid accent background with black text. |

### Payment Page Terminal Architecture (`/payment`)
- **Vector Backdrop**: Gothic church in fog, winding moonlit cobblestone road, skull lantern post with fiery red glow, and pure `#0D0D0D` Void Black framing (`/graveyard-gate-landscape.svg?v=24`).
- **Central Neo-Brutalist Terminal**:
  - Locked 440px glass card (`rgba(20, 27, 32, 0.93)`), `4px solid #0D0D0D`, `8px 8px 0px #0D0D0D` hard shadow, `backdrop-filter: blur(20px)`.
- **Order Dossier**: Item count badge + `₹{total}` formatted in `Archivo Black, 'Plus Jakarta Sans', sans-serif`.
- **QR Frame**: High-contrast white box (`180×180px` UPI QR) + GPay, PhonePe, Paytm, BHIM, Cred pills.
- **Dispatch CTA**: Full-width `#FF3B2B` button with `4px solid #0D0D0D` and 4px comic offset shadow (`box-shadow: 4px 4px 0px #0D0D0D`).

---

## 3. The 4-Tier Card Visual Hierarchy

### Tier 1: Header Block
- Product title (`26px Archivo Black, 'Plus Jakarta Sans'`, `color: #FFFFFF`, `text-shadow: 2px 2px 0px #0D0D0D`) and category subtitle (`13px, font-weight 800`).
- Right-aligned badges:
  - **Counter badge**: `[ 1 / 6 ]` (semi-transparent dark background, accent border).
  - **Price badge**: `[ ₹X / UNIT ]` (vibrant accent pop fill, black border, black text).

### Tier 2: Comic Dossier Box
- **Dimensions**: `height: 116px`, `min-height: 116px`, `box-sizing: border-box`, `padding: 14px 18px 16px`.
- **Styling**: `3.5px solid #0D0D0D`, `4px 4px 0px #000` hard shadow, `border-radius: 10px`.
- **Content**: 2-line product specification text (`font-size: 13.5px, font-weight: 700, line-height: 1.45`) + punchy tagline badge with generous bottom clearance.

### Tier 3: Config Options Box (Anti-Overflow Rules)
- **Multi-row categories** (e.g. 2 option rows): `height: 126px, min-height: 126px`.
- **Single-row categories** (e.g. 1 option row): `.compact (height: 94px, min-height: 94px)`.
- **CRITICAL ANTI-OVERFLOW RULES**:
  - Always enforce `flex-wrap: nowrap;`, `white-space: nowrap;`, `overflow-x: auto;`, and `scrollbar-width: none;` on `.writing-config-row` and `.writing-ink-chips-row`.
  - Use concise chip labels (e.g., `100 Pgs`, `200 Pgs` rather than long repeated prefixes).
  - Chip padding: `5px 8px`, `font-size: 11px`, `gap: 5px-6px`.
  - Active chip with dark dot: add `2px solid var(--accent)` ring around dark dots so they stay visible against black button backgrounds.

### Tier 4: Dispatch Command Bar
- **Quantity Stepper**: `[ − ] [ QTY ] [ + ]` in dark semi-transparent comic pill (`box-shadow: 3px 3px 0px #0D0D0D`).
- **CTA Button**: Full width, `Archivo Black`, `14px`, `box-shadow: 4px 4px 0px #0D0D0D`, active depressed state `translate(2px, 2px)`.

---

## 4. Toast Notification Specs
- **Position**: `fixed, bottom: 28px; right: 28px; z-index: 1000`.
- **Styling**: `3.5px solid #0D0D0D`, `5px 5px 0px #0D0D0D`, `border-radius: 12px`, `padding: 12px 22px`.
- **Animation**: CSS toggle `.visible` (`opacity: 0 & translateY(24px)` -> `opacity: 1 & translateY(0)`).
- **Timeout**: `4500ms` auto-dismiss with `useRef` cleanup.

---

## 5. Palette Harmonization Table

| Role | Toxic Green Page ([Writing.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Writing.jsx)) | Purple Twilight Page ([Correction.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Correction.jsx)) | Blood Crimson Graveyard Page ([Paper.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Paper.jsx)) | Gothic Steel Slate & Church Fog ([PaymentPage.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/PaymentPage.jsx)) |
| :--- | :--- | :--- | :--- | :--- |
| **Background Fill** | `#019E70` (Seafoam Green) | `#2D114D` (Night Purple) | `#140507` (Gothic Velvet Abyss) | `#192024` / `#4C585E` (Night Mist) |
| **Glass Card Fill** | `rgba(10, 24, 18, 0.84)` | `rgba(28, 12, 44, 0.86)` | `rgba(18, 10, 12, 0.88)` | `rgba(20, 27, 32, 0.93)` |
| **Memo / Dossier Box**| `#CCFB9A` (Moon Lime) | `#C899EB` (Twilight Lilac) | `#C4A8AC` (Weathered Stone Mauve) | `#172126` (Steel Inset Dossier) |
| **Option Button Fill**| `#B2F069` | `#B078DD` | `#886E71` (hover `#72585B`) | `#0D0D0D` (UPI App Pills) |
| **Primary Action CTA**| `#9DE869` (Toxic Lime) | `#FFA012` (Pumpkin Orange) | `#FF3B47` (Hazard Blood Crimson) | `#FF3B2B` (Fiery Crimson) |
| **Comic Borders** | `#0D0D0D` (Void Black) | `#0D0D0D` (Void Black) | `#0D0D0D` (Void Black) | `#0D0D0D` (Void Black) |

---

## 6. Critical Technical Lessons & Rules

1. **Backdrop Vectorization (Cumulative Stacking over Naive Rings)**:
   - When converting reference paintings to SVG, **do NOT** trace disjoint contour slices with `fill-rule="evenodd"`. That inverts solid shapes into hollow wireframe ribbons and looks like an X-ray / MRI scan.
   - **Always use cumulative back-to-front threshold stacking**:
     1. Base sky gradient (`<linearGradient>` or `<radialGradient>`)
     2. Cumulative masks: progressive luminance paths (`gray < threshold_distant`, `gray < threshold_mid`, `gray < threshold_near`)
     3. Solid foreground silhouettes: `gray < threshold_black` rendered as **100% solid, opaque Void Black (`#0D0D0D`)** with standard non-zero fills on top.
2. **Zero Bounding-Box Crops for Atmospheric Effects**:
   - Never use hard rectangular ROI slices for fog, mist, or lantern glows. Hard box slices create jarring seams against gradients.
   - Instead, compute smooth radial / elliptical alpha falloffs or vector masks spanning natural atmospheric contours.
3. **Mignola Black Inking**:
   - Architectural masses, foreground walls, and structures framing intense light sources (e.g., skull lanterns, stained glass) must be preserved as solid Void Black (`#0D0D0D`).
   - Avoid pale or washed-out compression artifacts by strictly clamping framing silhouettes to pure black.
4. **Font Fallback for Rupee (`₹`) Symbol**:
   - `Archivo Black` lacks the Indian Rupee (`₹`) glyph.
   - Always define font fallbacks as: `font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;` so the Rupee symbol renders cleanly without substitution glitches.
5. **Asset Cache Busting**:
   - Always append version queries to SVG image backdrops in React (e.g. `src="/graveyard-gate-landscape.svg?v=24"`).

---

## 7. Upcoming Stationery Pages to Implement

The remaining two stationery categories linked from [UploadOrder.js](file:///c:/Holidays/Odyssey/frontend/src/pages/UploadOrder.js):

1. **Measuring & Drawing** (`/stationery/measuring`):
   - Items: Drafting Scales, Geometry Sets, Protractors, Engineering Compasses, Dividers, Set Squares.
   - Suggested Theme: Precision Blueprint Navy / Grid Blue with Laser Neon Amber / Yellow CTA.
2. **Office & Utility** (`/stationery/office`):
   - Items: Heavy Staplers, Staple Pins, Glue Sticks, Brown Roll Covers, High-Tack Adhesives, Binder Clips.
   - Suggested Theme: Industrial Kraft / Charcoal Slate with Safety Hazard Neon Orange / Yellow CTA.

---

## 8. Step-by-Step Blueprint for the Next Page
1. **Backdrop**: Vectorize target reference image using cumulative solid layering into `frontend/public/<category>-landscape.svg`.
2. **Component**: Duplicate `frontend/src/pages/Paper.jsx` (or `Correction.jsx`) to `frontend/src/pages/<PageName>.jsx`.
3. **Routing**: Register `/<page>` and `/stationery/<category>` in `frontend/src/App.js` before `/stationery/:type`.
4. **Data Catalog**: Update `CATALOG_ITEMS` (3 categories, 6 items each = 18 total items, realistic campus specifications, lore1, lore2, dynamic price tiers).
5. **Theme Harmonization**: Tune `:root` CSS variables (`--accent`, `--slate-box`, `--slate-btn`, CTA color) directly from the target landscape vector.
6. **Verification**: Run `npm run build` in `frontend/` to confirm zero compilation warnings or layout shifts.
