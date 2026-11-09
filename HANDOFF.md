# 🕹️ Odyssey Neo-Brutalist Arcade Showcase — Master Handoff

## 1. Quick Launch & Project Context
- **Stack**: React 19 + Create React App (`frontend/`, Port 3000) | Express + MongoDB (`backend/`, Port 5000)
- **Launch Command**: Run `.\start.bat` in the project root to start both backend & frontend dev servers simultaneously.
- **Base Student Route**: `/student` ([UploadOrder.js](file:///c:/Holidays/Odyssey/frontend/src/pages/UploadOrder.js))
- **Live Showcase Pages Completed**:
  1. **Writing Essentials**: `/writing` ([Writing.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Writing.jsx), backdrop: `/halloween-reference-landscape.svg`) — *Toxic Lime & Seafoam Green*
  2. **Correction & Marking**: `/stationery/correction` ([Correction.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Correction.jsx), backdrop: `/correction-landscape.svg`) — *Twilight Purple & Pumpkin Orange*
  3. **Paper & Reams**: `/stationery/paper` and `/paper` ([Paper.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Paper.jsx), backdrop: `/paper-landscape.svg`) — *Midnight Slate & Electric Cyan*
  4. **Payment Gateway & Checkout**: `/payment` ([PaymentPage.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/PaymentPage.jsx), backdrops: `/graveyard-gate-landscape.svg?v=24` & `/grim-reaper-ritual-board.svg?v=1`) — *Gothic Steel Slate, Void Black, Fiery Crimson & Occult Emerald*
  5. **Order Receipt & Confirmation**: `/receipt` ([ReceiptPage.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/ReceiptPage.jsx)) — *Clean Dossier Confirmation*
  6. **Cart Terminal**: `/cart` ([CartPage.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/CartPage.jsx)) — *Order Manifest & Checkout Dispatch*

---

## 2. Payment Gateway Architecture (`/payment`)

The payment gateway has been transformed into a fully interactive gothic ritual shrine:

```
+-----------------------------------------------------------------------------------+
|  ODYSSEY GATEWAY                              [ 2 Items • ₹150 ]  [← BACK TO CART] |
|                                                                                   |
|                 /\  (Hooded Grim Reaper - Glowing Mint Eyes)                      |
|                /  \                                                               |
|        [⛓️]   /======\   (Weathered Timber Notice Board)        [🕯️]              |
|        [🏮]   |  📜  |  <--- Torn Parchment Scroll with dynamic UPI QR            |
|               | (QR) |       framed by red occult circle & triquetra sigil        |
|               +------+                                                            |
|               | MAKE YOUR OFFERING                                                |
|               | TO COMPLETE THE RITUAL                                            |
|               | ✦ Present your tribute through the sacred sigil below. ✦           |
|         _____/________\______ (Cobblestone base & leather grimoire)               |
|        (  Cobblestone Road leading to Moonlit Gothic Cemetery Gate  )             |
+-----------------------------------------------------------------------------------+
```

### Components & Technical Specifications

| Layer / Element | Implementation & Visual Details |
| :--- | :--- |
| **Vector Backdrop** | Pure SVG `/graveyard-gate-landscape.svg?v=28` (`1024×576`, viewBox `0 0 1024 576`). Deep moody gothic atmosphere, multi-tiered realistic optical lantern bloom & ground cast, dark gothic slate masonry (`#1D262B`), selective under-eave shadow (`#111619`), gothic church spire in mist, moonlit cobblestones. |
| **Grim Reaper Shrine Asset** | Pure SVG `/grim-reaper-ritual-board.svg?v=5` (`935×1024`, viewBox `0 0 935 1024`). Minimized (`max-width: 300px`, `max-height: 46vh`) on path verge (`~37%` screen width). Seamlessly color-graded with the moonlit gothic graveyard palette: deeper dark timber, darkened slate-moss boulders, atmospheric antique vellum, matched lantern fire, and soft ground mist feathering. |
| **Dynamic Scannable UPI QR** | Generated client-side via `qrcode` SVG for the exact current cart total (`₹{total}`). Formatted as `upi://pay?pa=odysseycampus@upi&pn=Odyssey%20Campus%20Print&am=${total}&cu=INR`. Mounted at `left: 39.36%`, `top: 37.89%`, `width: 22.89%`, `height: 19.92%` with `mix-blend-mode: multiply` onto the torn parchment. |
| **Occult Ritual Sigil** | Sacred red circle with Celtic triquetra crest, celestial radial hash marks, and astrological runes (`#A8281E` / `#D93B2F`). |
| **Carved Relief Typography** | Wood-carved relief text: *"MAKE YOUR OFFERING"* (`#B8281E`), *"TO COMPLETE THE RITUAL"* (`#DDD0BF`), and subtitle *"✦ Present your tribute through the sacred sigil below. ✦"* (`#A6947D`). |
| **Heraldry & Emblems** | Left crimson banner behind lantern chains; right crimson banner etched with the Odyssey campus printer emblem in antique gold (`#D8C4A9`). Ancient grimoire on the bottom left ledge. |
| **Living Animations** | 1. **Grounded & Planted**: Fixed securely onto the cobblestones with deep contact shadow (no bobbing/floating in the air).<br>2. **Pulsing Green Eyes**: `@keyframes reaperEyePulse` (`#38E54D` emerald eye glow).<br>3. **Atmospheric Fire**: `@keyframes ritualFlameGlow` flickering lantern & candle flames.<br>4. **Static Inked UPI QR**: Inked directly onto parchment with zero hover disruption (no scale, no spinning dashed aura, no tooltips). Ready for seamless mobile camera scan. |
| **Minimalist Interaction** | Zero floating bottom bars or clutter. Clicking the parchment scroll, QR code, or carved plaque directly initiates the ritual offering ceremony (`TRIBUTE ACCEPTED • ENTERING THE SANCTUARY`) and commits order data to localStorage & backend before navigating to `/receipt`. |

---

## 3. Core Architecture & Strict Layout Rules (Zero Layout Shift)

Every arcade showcase page follows an identical locked geometry to eliminate layout shift:

| Element | Geometry / Styling Constraints |
| :--- | :--- |
| **Main Glass Card (Catalog)** | Width: `660px`, Height: locked at `505px` (`min-height: 505px, max-height: 505px`), `border: 4px solid #0D0D0D`, `box-shadow: 6px 6px 0px #000`, `backdrop-filter: blur(20px)`. |
| **Ritual Shrine Stage (Payment)** | Max-width: `600px`, `aspect-ratio: 935 / 1024`, `max-height: 78vh`, centered on the cobblestone road. Zero layout shift across viewport resize. |
| **Carousel Row (Catalog)** | 3-column layout: Left Circular Arrow (`58×58px`, `border: 3.5px solid #0D0D0D`, `box-shadow: 4px 4px 0px #0D0D0D`) + Center Active Card + Right Circular Arrow (`58×58px`). |
| **Keyboard Navigation** | `ArrowLeft` / `ArrowRight` cycles through current category items; `Escape` returns to previous page / basecamp (`navigate(-1)`). |
| **Top Action Pills** | Minimal top-right action pills (`← BACK TO BASE` and `CART (N)`) with hard offset comic drop shadows (`3px 3px 0px rgba(0,0,0,0.4)`). |
| **Category Switcher** | Centered hero title (`Titan One`, `34px`) with pill tabs directly beneath it (`tab1`, `tab2`, `tab3`). Active tab gets solid accent background with black text. |

---

## 4. The 4-Tier Card Visual Hierarchy

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

## 5. Toast Notification Specs
- **Position**: `fixed, bottom: 28px; right: 28px; z-index: 1000`.
- **Styling**: `3.5px solid #0D0D0D`, `5px 5px 0px #0D0D0D`, `border-radius: 12px`, `padding: 12px 22px`.
- **Animation**: CSS toggle `.visible` (`opacity: 0 & translateY(24px)` -> `opacity: 1 & translateY(0)`).
- **Timeout**: `4500ms` auto-dismiss with `useRef` cleanup.

---

## 6. Palette Harmonization Table

| Role | Toxic Green Page ([Writing.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Writing.jsx)) | Purple Twilight Page ([Correction.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Correction.jsx)) | Blood Crimson Graveyard Page ([Paper.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Paper.jsx)) | Gothic Steel Slate & Grim Shrine ([PaymentPage.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/PaymentPage.jsx)) |
| :--- | :--- | :--- | :--- | :--- |
| **Background Fill** | `#019E70` (Seafoam Green) | `#2D114D` (Night Purple) | `#140507` (Gothic Velvet Abyss) | `#192024` / `#4C585E` (Night Mist) |
| **Glass Card Fill** | `rgba(10, 24, 18, 0.84)` | `rgba(28, 12, 44, 0.86)` | `rgba(18, 10, 12, 0.88)` | Transparent shrine floating over road |
| **Memo / Dossier Box**| `#CCFB9A` (Moon Lime) | `#C899EB` (Twilight Lilac) | `#C4A8AC` (Weathered Stone Mauve) | `#EFE0CA` (Torn Parchment Scroll) |
| **Option Button Fill**| `#B2F069` | `#B078DD` | `#886E71` (hover `#72585B`) | `#B8281E` (Crimson Occult Sigil) |
| **Primary Action CTA**| `#9DE869` (Toxic Lime) | `#FFA012` (Pumpkin Orange) | `#FF3B47` (Hazard Blood Crimson) | `#D93B2F` (Parchment Click Confirmation) |
| **Comic Borders** | `#0D0D0D` (Void Black) | `#0D0D0D` (Void Black) | `#0D0D0D` (Void Black) | `#0D0D0D` (Void Black) |

---

## 7. Critical Technical Lessons & Rules

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
   - Always append version queries to SVG image backdrops in React (e.g. `src="/graveyard-gate-landscape.svg?v=24"`, `src="/grim-reaper-ritual-board.svg?v=1"`).
6. **Windows Sandbox Git Execution**:
   - Git operations modifying `.git` (`git add`, `git commit`) require `BypassSandbox: true` on Windows due to filesystem permission locks. Run code modifications and tests inside the standard sandbox, and commit with bypass sandbox.

---

## 8. Python Vectorizer Scripts Inventory

| Script | Purpose & Output |
| :--- | :--- |
| [vectorize_payment_gothic_chapel.py](file:///c:/Holidays/Odyssey/vectorize_payment_gothic_chapel.py) | Generates `frontend/public/graveyard-gate-landscape.svg`. Multi-tiered lantern lights, midnight slate masonry, moonlit cobblestones. |
| [vectorize_grim_reaper_board.py](file:///c:/Holidays/Odyssey/vectorize_grim_reaper_board.py) | Generates `frontend/public/grim-reaper-ritual-board.svg`. Hooded Grim Reaper, rustic notice board, torn parchment, red sigil, flames, and glowing eyes. |
| [build_widescreen_graveyard_svg.py](file:///c:/Holidays/Odyssey/build_widescreen_graveyard_svg.py) | Wide-screen aspect ratio scaling for cemetery landscape assets. |
| [build_seamless_mignola.py](file:///c:/Holidays/Odyssey/build_seamless_mignola.py) | Seamless comic ink line extraction utility. |

---

## 9. Next Steps & Extension Roadmap
1. **Measuring & Drawing** (`/stationery/measuring`, [Measuring.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Measuring.jsx)):
   - Link route to student basecamp; verify `/measuring-landscape.svg` backdrop.
2. **Office & Utility** (`/stationery/office`, [Office.jsx](file:///c:/Holidays/Odyssey/frontend/src/pages/Office.jsx)):
   - Link route to student basecamp; verify `/office-landscape.svg` backdrop.
3. **Sound Effects / Haptics** (Optional):
   - Add subtle audio feedback (e.g., chime or stone scrape sound) when clicking the sacred parchment to offer tribute.

---

## 11. Global Liquid Metal 3D Cursor Architecture (`BlobCursor.jsx`, `App.js`)

A continuous liquid Three.js chrome blob cursor runs globally across the entire application:

```
[ Router: useLocation() ]
          │ (pathname)
          ▼
[ getCursorConfig(pathname) ]
  ├── Color & Material (Chrome, Pearl, Jelly, Ink)
  ├── Fluid Viscosity (Size, Wobble, Stretch, Goo, Lag)
  ├── Ectoplasmic Breathing (Morph, MorphSpeed)
  └── Droplet Bursts (SplashCount, SplashSpeed, SplashSize)
          │
          ▼
[ <BlobCursor key={pathname} ... /> ] (Instant re-mount & uniform updates on route change)
```

### Route-to-Cursor Color & Physics Manifest

| Route | Theme / Atmosphere | Cursor Hex & Specs | Visual Alignment |
| :--- | :--- | :--- | :--- |
| **`/` (Intro Screen)** | Comic Neon & Retro Slate | `#FF70A6` (Brain Pink Chrome, `size: 42`, `trail: 12`) | Matches retro comic action & Bangers CTA |
| **`/printing`** | Deep Seafoam Print Lab | `#00E599` (Electric Mint Emerald Chrome) | Matches Print Lab `#019E70` backdrop |
| **`/writing`** | Writing Weaponry Armory | `#45B89E` (Seafoam Jade Chrome) | Matches Toxic Lime & Seafoam catalog cards |
| **`/paper`** | Paper & Reams Crypt | `#FF3B47` (Electric Crimson Chrome) | Matches Gothic Velvet Abyss & hazard tags |
| **`/measuring`** | Measuring & Drafting Lab | `#F56234` (Electric Amber Chrome) | Matches precision drafting bronze palette |
| **`/stationery/correction`** | Twilight Night Correction | `#FFA012` (Pumpkin Orange Chrome) | High-contrast flame over `#2D114D` night purple |
| **`/stationery/office`** | Midnight Slate Office Desk | `#C89F72` (Desert Bronze Gold Chrome) | Matches `#181513` midnight office slate |
| **`/student` (Basecamp)** | Comic Zombie Armory | `#FF70A6` (Brain Pink Chrome, `wobble: 0.85`, `stretch: 0.48`, `splashCount: 7`) | Maximum contrast against `#9DE869` hero background |
| **`/payment`** | Gothic Cemetery Midnight | `#FF2A1B` (Fiery Lantern Ember Chrome, `morph: 0.35`, `morphSpeed: 0.45`, `splashCount: 8`, `stretch: 0.52`) | Matches glowing iron lantern, red candles & occult sigils |
| **`/ritual-offering`** | Occult Crypt Altar | `#BE2E2E` (Occult Crimson Blood Chrome, `size: 44`, `trail: 13`) | Matches dark occult altar atmosphere |
| **`/cart` & `/profile`** | Campus Dispatch & ID Terminal | `#FF70A6` (Brain Pink Chrome) | Matches brand neon pink identity |
| **`/admin`** | Telemetry Control | `#7C5CFC` (Cyber Violet Chrome) | Matches terminal administrative dashboard |

### Anti-Selection Protection:
- Rapid double/triple clicking to burst droplets triggers zero unwanted browser text selection (`BlobCursor.css` applies `user-select: none`, and `BlobCursor.jsx` intercepts non-input `e.detail > 1` mousedown events).

---

## 12. Requisition Aisles Directory ("THE EXPEDITION KIT") (`IntroPage.jsx`)

The introductory home page features an interactive disclosure mechanism:
1. **Single-Accordion Expandable Aisles**: Clicking an aisle title or vector toggle button (`+` rotating 45° to `×`) smoothly reveals inline comic-neomorphic cards and chips on the clean green canvas. Opening one aisle automatically closes any previously expanded aisle.
2. **Typography & Outline**: Titles and aisle numbers feature neon pink (`#FF1A8C`) text with a rounded 3px black stroke (`paint-order: stroke fill`) strictly on `:hover`.
3. **Divider Lines**: High-precision 2px dashed coupon perforated divider lines.
4. **Hero CTA**: Google Font **Bangers** comic action styling with neon pink hover and hard black drop shadow. Positioned absolutely at the top right of the hero screen so it never tracks page scroll.
5. **Footer Cleanup**: Bottom telemetry and copyright text removed for a focused, clean layout.

---

## 13. Payment Gateway Grounding & Perspective Alignment (`PaymentPage.jsx`)
- **Backdrop Geometry**: `object-position: center center` on `/graveyard-gate-landscape.svg?v=28` preserves true vertical perspective.
- **Midground Shrine Placement**: `.pay-center-container` is anchored via `flex: 1` with `padding: 0 0 3.5vh max(24px, calc(37% - 150px))` and `margin-bottom: -16px`, placing the Grim Reaper board recessed into the cobblestone path without foreground distortion.


---

## 14. Order Receipt Architecture (`/receipt`, `ReceiptPage.jsx`)

The receipt fold is a hybrid vector-DOM architecture:

```
[ Hero Fold (100vh) - Wizard Greenlight Door Vector + 3-Click Paint Spill Canvas ]
                                  │
                                  ▼
[ 240px Breathing Spacer into Below-the-Fold Dark Void ]
                                  │
                                  ▼
+-------------------------------------------------------------------------------+
|  [raven-receipt-top.svg] (Hooded Raven Perched on Carved Wooden Scroll Rod)   |
|         \===[ Bronze Collar ]===[ Rod ]===[ Bronze Collar ]===/               |
|                              (Talons Gripping Rod)                            |
|                            [ Seamless Paper Flap #daead4 ]                    |
+-------------------------------------------------------------------------------+
|  ODYSSEY CAMPUS PRINT ARCHIVES                                                |
|  CAMPUS ORDER RECEIPT                                                         |
|  ===========================================================================  |
|  [ ORDER REFERENCE ]                   #6af13cef00a93c9f1ffd140f [ COPY ]     |
|  [ SANCTUM STATUS  ]                   [ IN PRINT QUEUE ]                     |
|  [ PICKUP COUNTER  ]                   Basecamp Counter A (Library Vault)     |
|  [ RECORDED AT     ]                   11/9/2026, 8:54:31 AM                  |
|  ---------------------------------------------------------------------------  |
|  [ ORDER MANIFEST (N Items) ]                                                 |
|    • Kokuyo Beetle Tape (Standard 5mm)                                   ₹30  |
|    • A5 Hardcover Grid Journal                                           ₹90  |
|  ---------------------------------------------------------------------------  |
|  [ TOTAL OFFERING PAID ]                                                ₹150  |
|  UPI Scanned (odysseycampus@upi)                                              |
|  ||| | |||| || ||| ||||| | ||| || |||| (Pure CSS Thermal Barcode)             |
|  * ODY-6AF13CEF00A9 *                                                         |
|  [ PRINT RECEIPT ]                         [ RETURN TO BASECAMP ]             |
|  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  |
|  (Thermal Paper Sawtooth Jagged Tear Edge - clip-path polygon)                |
+-------------------------------------------------------------------------------+
```

### Technical Specs & Solved Edge Cases:
1. **Hero Reveal**: Dynamic canvas fluid spill mask unblurs `/wizard-enchanted-greenlight.svg` on click (`stage = 4` for dev preview).
2. **Raven Header SVG**: `frontend/public/raven-receipt-top.svg` generated by `build_raven_head_svg.py` from `Hooded Crow Perched on Parchment Scroll.png`. Scaled with `width: calc(100% * (1024 / 554))` so the parchment flap aligns seamlessly with `.rcpt-ticket-card`.
3. **Dynamic Receipt Body**: 100% pure CSS/HTML flexbox (`.rcpt-ticket-card`, `#daead4` to `#d1e2cb` gradient). No rigid SVG coordinate slicing: expands automatically for arbitrary item counts with zero text clipping or horizontal squishing.
4. **Thermal Sawtooth Tear**: Bottom edge uses pure CSS polygon clip-path for authentic thermal paper tear.
5. **Print-Ready**: `@media print` and `window.print()` support.
6. **Custom Claw Painting**: User can paint the claw fingers directly in `Hooded Crow Perched on Parchment Scroll.png` or `raven-receipt-top.svg` in any image/vector editor (Figma/Paint).

