# 🕹️ Odyssey Neo-Brutalist Arcade Showcase — Master Handoff

## 1. Quick Launch & Project Context
- **Stack**: React 19 + Create React App (Port 3000) | Express + MongoDB (Port 5000)
- **Launch Command**: Run `.\start.bat` in the project root to start both frontend & backend servers.
- **Base Student Route**: `/student` ([UploadOrder.js](file:///c:/Holidays/Odyssey/frontend/src/pages/UploadOrder.js))
- **Live Showcase Pages Completed**:
  1. **Writing Essentials**: `/writing` ([Writing.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Writing.jsx), backdrop: `/halloween-reference-landscape.svg`) — *Toxic Lime & Seafoam Green*
  2. **Correction & Marking**: `/stationery/correction` ([Correction.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Correction.jsx), backdrop: `/correction-landscape.svg`) — *Twilight Purple & Pumpkin Orange*
  3. **Paper & Reams**: `/stationery/paper` and `/paper` ([Paper.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Paper.jsx), backdrop: `/paper-landscape.svg`) — *Midnight Slate & Electric Cyan*
  4. **Measuring & Drawing**: `/stationery/measuring` and `/measuring` ([Measuring.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Measuring.jsx), backdrop: `/measuring-landscape.svg`) — *Laser Flame Orange & Terracotta Mauve*
  5. **Office & Utility**: `/stationery/office` and `/office` ([Office.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Office.jsx), backdrop: `/office-landscape.svg`)
6. **Post-Apocalyptic Payment Receipt**: `/receipt` ([ReceiptPage.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/ReceiptPage.jsx), backdrop: `/receipt-backdrop-clean.svg`, full art vector: `/receipt-landscape.svg`) — *Toxic Lime, Hazard Yellow, Hot Pink & Outbreak Crimson* — *Industrial Charcoal Dusk & Luminous Sky Cream*

---

## 2. Core Architecture & Strict Layout Rules (Zero Layout Shift)

Every arcade showcase page follows an identical locked geometry to eliminate layout shift:

| Element | Geometry / Styling Constraints |
| :--- | :--- |
| **Main Glass Card** | Width: `660px`, Height: locked at `505px` (`min-height: 505px, max-height: 505px`), `border: 4px solid #0D0D0D`, `box-shadow: 6px 6px 0px #000`, `backdrop-filter: blur(20px)`. |
| **Carousel Row** | 3-column layout: Left Circular Arrow (`58×58px`, `border: 3.5px solid #0D0D0D`, `box-shadow: 4px 4px 0px #0D0D0D`) + Center Active Card + Right Circular Arrow (`58×58px`). |
| **Keyboard Navigation** | `ArrowLeft` / `ArrowRight` cycles through current category items; `Escape` returns to previous page / basecamp (`navigate(-1)`). |
| **Top Action Pills** | Minimal top-right action pills (`← BACK TO BASE` and `CART (N)`) with hard offset comic drop shadows (`3px 3px 0px rgba(0,0,0,0.4)`). |
| **Category Switcher** | Centered hero title (`Titan One`, `34px`) with pill tabs directly beneath it (`tab1`, `tab2`, `tab3`). Active tab gets solid accent background with black text. |

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

| Role | Toxic Green Page ([Writing.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Writing.jsx)) | Purple Twilight Page ([Correction.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Correction.jsx)) | Blood Crimson Graveyard Page ([Paper.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Paper.jsx)) | Dark Vortex Ruins Page ([Measuring.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Measuring.jsx)) | Industrial Dusk Skyline ([Office.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Office.jsx)) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Background Fill** | `#019E70` (Seafoam Green) | `#2D114D` (Night Purple) | `#140507` (Gothic Velvet Abyss) | `#1E1119` (Gothic Plum Abyss) | `#181513` (Industrial Charcoal Abyss) |
| **Glass Card Fill** | `rgba(10, 24, 18, 0.84)` | `rgba(28, 12, 44, 0.86)` | `rgba(18, 10, 12, 0.88)` (Locked Gothic Velvet Abyss) | `rgba(30, 17, 25, 0.88)` (Dark Vortex Plum Glass) | `rgba(26, 23, 21, 0.88)` (Industrial Charcoal Glass) |
| **Memo / Dossier Box**| `#CCFB9A` (Moon Lime) | `#C899EB` (Twilight Lilac) | `#8D6B6D` (OG Weathered Stone Mauve) | `#AA726D` (Apocalyptic Terracotta Dust) | `#C2A482` (Warm Industrial Kraft Box) |
| **Option Button Fill**| `#B2F069` | `#B078DD` | `#735557` | `#8A5954` | `#8A7059` (hover `#735A45`) |
| **Primary Action CTA**| `#9DE869` (Toxic Lime) | `#FFA012` (Pumpkin Orange) | `#FF3B47` (Hazard Blood Crimson) | `#F56234` (Laser Flame Ember Orange) | `#C89F72` (Darker Architectural Kraft) |
| **Comic Borders** | `#0D0D0D` (Void Black) | `#0D0D0D` (Void Black) | `#0D0D0D` (Void Black) | `#0D0D0D` (Void Black) | `#0D0D0D` (Void Black) |

---

## 6. Critical Technical Lessons & Rules

1. **Backdrop Vectorization (Never use naive disjoint K-Means rings)**:
   - When converting reference paintings to SVG, **do NOT** trace disjoint contour slices with `fill-rule="evenodd"`. That inverts solid shapes into hollow wireframe ribbons and looks like an X-ray / MRI scan.
   - **Always bridge the architecture base layer**: Dilate the structure mask (`cv2.dilate`) under the black mortar lines and cracks bounded strictly by `~sky_mask`. This ensures the solid building color sits directly beneath the black lineart so the background sky color NEVER leaks through the seams as bright halos or borders.
   - **Sample exact median OG colors from the reference**: Never guess or use washed-out pale tones. Directly calculate `np.median` on the architecture regions to match authentic Mike Mignola comic color fidelity.
   - **Viewport Pinning (`object-position: center 20%`)**: Never use `center bottom` on wide 16:9 panoramas, as laptop screens and wide monitors push the top 150–200px off-screen and slice the moon/towers in half. Use `object-position: center 20%` to preserve both the sky/celestial features and the grounded floor.
   - **Solid Foreground Ink Silhouettes**: Force the darkest ink layer to solid `#0D0D0D` with `stroke="#0D0D0D" stroke-width="0.5" stroke-linejoin="round"`.
   - **Never draw artificial arbitrary `<line>` overlays**: The artwork already contains the architectural lines, column strokes, and masonry; drawing arbitrary computer lines ruins the drawing.
2. **Font Fallback for Rupee (`₹`) Symbol**:
   - `Archivo Black` lacks the Indian Rupee (`₹`) glyph.
   - Always define font fallbacks as: `font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;` so the Rupee symbol renders cleanly without substitution glitches.
3. **Asset Cache Busting**:
   - Always append version queries to SVG image backdrops in React (e.g. `src="/paper-landscape.svg?v=2"`).

---

## 7. Showcase Pages Implementation Status

All 5 core stationery showcase categories linked from [UploadOrder.js](file:///c:/Holidays/Odyssey/frontend/src/pages/UploadOrder.js) are now **100% completed & fully harmonized**:

1. **Writing Essentials**: `/writing` ([Writing.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Writing.jsx), backdrop: `/halloween-reference-landscape.svg`)
2. **Correction & Marking**: `/stationery/correction` ([Correction.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Correction.jsx), backdrop: `/correction-landscape.svg`)
3. **Paper & Reams**: `/stationery/paper` and `/paper` ([Paper.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Paper.jsx), backdrop: `/paper-landscape.svg`)
4. **Measuring & Drawing**: `/stationery/measuring` and `/measuring` ([Measuring.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Measuring.jsx), backdrop: `/measuring-landscape.svg`)
5. **Office & Utility**: `/stationery/office` and `/office` ([Office.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Office.jsx), backdrop: `/office-landscape.svg`)
6. **Post-Apocalyptic Payment Receipt**: `/receipt` ([ReceiptPage.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/ReceiptPage.jsx), backdrop: `/receipt-backdrop-clean.svg`, full art vector: `/receipt-landscape.svg`) — *Toxic Lime, Hazard Yellow, Hot Pink & Outbreak Crimson*

---

## 8. Step-by-Step Blueprint for the Next Page
1. **Backdrop**: Vectorize target reference image using cumulative solid layering into `frontend/public/<category>-landscape.svg`.
2. **Component**: Duplicate `frontend/src/pages/Paper.jsx` (or `Correction.jsx`) to `frontend/src/pages/<PageName>.jsx`.
3. **Routing**: Register `/<page>` and `/stationery/<category>` in `frontend/src/App.js` before `/stationery/:type`.
4. **Data Catalog**: Update `CATALOG_ITEMS` (3 categories, 6 items each = 18 total items, realistic campus specifications, lore1, lore2, dynamic price tiers).
5. **Theme Harmonization**: Tune `:root` CSS variables (`--accent`, `--slate-box`, `--slate-btn`, CTA color) directly from the target landscape vector.
6. **Verification**: Run `npm run build` in `frontend/` to confirm zero compilation warnings or layout shifts.
