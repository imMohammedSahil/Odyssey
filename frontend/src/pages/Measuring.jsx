import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&display=swap');

  :root {
    --frost-blue: #DBBC9D;
    --frost-blue-light: #F7EAD9;
    --electric-cyan: #F56234;
    --electric-cyan-hover: #FF784E;
    --void-black: #0D0D0D;
    --midnight-slate: #1E1119;
    --parchment: #F9F9F3;
    --slate-box: #AA726D;
    --slate-btn: #8A5954;
    --slate-btn-hover: #71433F;
    --grave-grey: #9E888B;
    --pure-white: #FFFFFF;
    --accent: #F56234;
    --accent-glow: rgba(245, 98, 52, 0.45);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .writing-page-shell {
    width: 100vw;
    height: 100vh;
    background-color: var(--midnight-slate);
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--parchment);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* 100% PURE VECTOR BACKDROP */
  .writing-bg-layer {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    background-color: var(--midnight-slate);
  }

  .writing-bg-vector {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
    display: block;
  }

  /* TOP HEADER BAR */
  .writing-header-bar {
    width: 100%;
    padding: 16px 28px 8px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    z-index: 50;
    flex-shrink: 0;
  }

  .writing-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .writing-btn-pill {
    background: var(--void-black);
    color: var(--pure-white);
    border: 3px solid var(--void-black);
    border-radius: 9999px;
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    padding: 8px 18px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.4);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .writing-btn-pill:hover {
    transform: translate(-1.5px, -1.5px);
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);
    background: #1C1F26;
  }

  .writing-btn-pill:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  }

  .writing-cart-pill {
    background: var(--electric-cyan);
    color: var(--void-black);
    border-color: var(--void-black);
  }

  .writing-cart-pill:hover {
    background: var(--electric-cyan-hover);
  }

  /* GAME CENTER STAGE (HILL CLIMB RACING CAROUSEL STYLE) */
  .writing-game-stage {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 20;
    padding: 0 20px;
    margin-top: -10px;
  }

  /* GAME HEADLINE */
  .writing-game-headline {
    text-align: center;
    margin-bottom: 12px;
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .writing-game-main-hero {
    font-family: 'Titan One', cursive;
    font-size: 34px;
    color: var(--pure-white);
    letter-spacing: 1px;
    line-height: 1.1;
    text-shadow: 4px 4px 0px var(--void-black), -2px -2px 0px var(--void-black), 2px -2px 0px var(--void-black), -2px 2px 0px var(--void-black);
  }

  /* CAROUSEL CONTAINER (PREV, ACTIVE, NEXT) */
  .writing-carousel-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    width: 100%;
    max-width: 1100px;
  }

  /* CAROUSEL NAV ARROW BUTTONS */
  .writing-nav-arrow-btn {
    width: 58px;
    height: 58px;
    background: rgba(13, 13, 13, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: var(--frost-blue);
    border: 3.5px solid var(--void-black);
    border-radius: 50%;
    font-family: 'Archivo Black', sans-serif;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px 0px var(--void-black);
    cursor: pointer;
    transition: transform 0.12s ease, background 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
    user-select: none;
    flex-shrink: 0;
  }

  .writing-nav-arrow-btn:hover {
    background: var(--electric-cyan);
    color: var(--void-black);
    transform: scale(1.08) translate(-1px, -1px);
    box-shadow: 5px 5px 0px var(--void-black);
  }

  .writing-nav-arrow-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--void-black);
  }

  /* MAIN ACTIVE CARD (LOCKED FIXED HEIGHT: 505px) */
  .writing-active-glass-card {
    width: 660px;
    height: 505px;
    min-height: 505px;
    max-height: 505px;
    background: rgba(30, 17, 25, 0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 4px solid var(--void-black);
    border-radius: 20px;
    box-shadow: 6px 6px 0px var(--void-black);
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  /* TIER 1: HEADER BLOCK */
  .writing-card-title-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 4px;
  }

  .writing-card-model-name {
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 26px;
    color: var(--pure-white);
    letter-spacing: -0.5px;
    line-height: 1.1;
    text-shadow: 2px 2px 0px var(--void-black);
  }

  .writing-card-subtitle {
    font-size: 13px;
    font-weight: 800;
    color: var(--frost-blue);
    letter-spacing: 0.3px;
  }

  .writing-counter-badge {
    display: inline-flex;
    align-items: center;
    background: rgba(13, 13, 13, 0.6);
    border: 2px solid var(--frost-blue);
    border-radius: 6px;
    padding: 3px 8px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--pure-white);
    letter-spacing: 0.5px;
  }

  .writing-unit-price-badge {
    background: var(--electric-cyan);
    color: var(--void-black);
    border: 2px solid var(--void-black);
    border-radius: 6px;
    padding: 3px 10px;
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    box-shadow: 2px 2px 0px var(--void-black);
    white-space: nowrap;
  }

  /* TIER 2: COMIC DOSSIER BOX */
  .writing-card-dossier-box {
    background: var(--slate-box);
    border: 3.5px solid var(--void-black);
    border-radius: 10px;
    padding: 14px 18px 16px;
    box-shadow: 4px 4px 0px var(--void-black);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 116px;
    min-height: 116px;
    box-sizing: border-box;
  }

  .writing-dossier-lore {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--void-black);
    line-height: 1.45;
    margin: 0;
  }

  .writing-dossier-tagline {
    font-size: 12px;
    font-weight: 800;
    color: var(--void-black);
    background: rgba(0, 0, 0, 0.08);
    border: 1.5px solid var(--void-black);
    border-radius: 4px;
    padding: 4px 10px;
    display: inline-block;
    align-self: flex-start;
    margin-top: 4px;
  }

  /* TIER 3: CONFIG OPTIONS BOX */
  .writing-config-section {
    background: rgba(13, 13, 13, 0.6);
    border: 3.5px solid var(--void-black);
    border-radius: 10px;
    padding: 12px 14px;
    box-shadow: 4px 4px 0px var(--void-black);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    height: 126px;
    min-height: 126px;
    box-sizing: border-box;
  }

  .writing-config-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .writing-config-row::-webkit-scrollbar {
    display: none;
  }

  .writing-config-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--frost-blue);
    letter-spacing: 0.4px;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .writing-pill-group {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .writing-pill-group::-webkit-scrollbar {
    display: none;
  }

  .writing-option-pill-btn {
    background: var(--slate-btn);
    color: var(--parchment);
    border: 2px solid var(--void-black);
    border-radius: 6px;
    padding: 5px 8px;
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    cursor: pointer;
    box-shadow: 2px 2px 0px var(--void-black);
    transition: all 0.1s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .writing-option-pill-btn:hover {
    background: var(--slate-btn-hover);
    transform: translateY(-1px);
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-option-pill-btn.active {
    background: var(--void-black);
    color: var(--electric-cyan);
    border-color: var(--void-black);
    box-shadow: 2px 2px 0px var(--void-black);
  }

  /* TIER 4: DISPATCH COMMAND BAR */
  .writing-action-dispatch-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 8px;
  }

  .writing-stepper-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .writing-stepper-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 10.5px;
    color: #DBBC9D;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .writing-stepper-comic-box {
    display: flex;
    align-items: center;
    background: rgba(13, 13, 13, 0.85);
    border: 3px solid var(--void-black);
    border-radius: 8px;
    padding: 3px 6px;
    box-shadow: 3px 3px 0px var(--void-black);
    gap: 6px;
  }

  .writing-stepper-step-btn {
    width: 28px;
    height: 28px;
    background: var(--slate-btn);
    color: var(--parchment);
    border: 2px solid var(--void-black);
    border-radius: 6px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.1s ease, background 0.1s ease;
    user-select: none;
  }

  .writing-stepper-step-btn:hover {
    background: var(--slate-btn-hover);
    transform: scale(1.05);
  }

  .writing-stepper-step-btn:active {
    transform: scale(0.95);
  }

  .writing-stepper-val {
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    color: var(--pure-white);
    min-width: 24px;
    text-align: center;
  }

  .writing-add-to-cart-hero-btn {
    flex: 1;
    background: var(--electric-cyan);
    color: var(--void-black);
    border: 3.5px solid var(--void-black);
    border-radius: 8px;
    padding: 12px 18px;
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--void-black);
    transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
  }

  .writing-add-to-cart-hero-btn:hover {
    background: var(--electric-cyan-hover);
    transform: translate(-1.5px, -1.5px);
    box-shadow: 5px 5px 0px var(--void-black);
  }

  .writing-add-to-cart-hero-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--void-black);
  }

  /* CENTER CATEGORY TABS */
  .writing-center-category-tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .writing-game-tab {
    background: rgba(13, 13, 13, 0.7);
    color: var(--frost-blue);
    border: 3px solid var(--void-black);
    border-radius: 9999px;
    padding: 6px 16px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.12s ease;
    box-shadow: 4px 4px 0px var(--void-black);
  }

  .writing-game-tab:hover {
    color: var(--pure-white);
    background: rgba(30, 30, 30, 0.85);
    box-shadow: 4px 4px 0px var(--void-black);
  }

  .writing-game-tab.active {
    background: var(--frost-blue);
    color: var(--void-black);
    border-color: var(--void-black);
    box-shadow: 3px 3px 0px var(--void-black);
    transform: translateY(-1px);
  }

  /* TOAST (CENTERED COMIC CARD) */
  .writing-toast {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translate(-50%, 20px) scale(0.95);
    background: var(--electric-cyan);
    color: var(--void-black);
    border: 3.5px solid var(--void-black);
    border-radius: 14px;
    padding: 16px 26px;
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    letter-spacing: 0.3px;
    text-align: center;
    box-shadow: 5px 5px 0px var(--void-black);
    z-index: 1000;
    width: auto;
    max-width: 360px;
    min-height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.45;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .writing-toast.visible {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
    pointer-events: auto;
  }

  @media (max-width: 768px) {
    .writing-carousel-row {
      gap: 8px;
    }
    .writing-nav-arrow-btn {
      width: 44px;
      height: 44px;
      font-size: 20px;
    }
    .writing-active-glass-card {
      padding: 18px 16px;
    }
    .writing-card-model-name {
      font-size: 20px;
    }
    .writing-game-main-hero {
      font-size: 26px;
    }
  }
`;

const CATALOG_ITEMS = [
  // 1. DRAFTING & GEOMETRY SETS
  {
    id: "geom-camlin-exam",
    category: "geometry",
    modelName: "Camlin Exam Geometry Box",
    subtitle: "Rust-Resistant Die-Cast Instruments • 9-Piece Set",
    title: "CAMLIN EXAM // MATHEMATICAL SET",
    protocol: "CAMLIN PROTOCOL // CE-01",
    basePrice: 90,
    lore1: "Classic high-precision zinc die-cast mathematical compass and divider with self-centering mechanism, paired with distortion-free 15cm ruler and transparent set squares.",
    lore2: "Self-centering gear compass engineered for drift-free geometrical arcs during exams.",
  },
  {
    id: "geom-classmate-archimedes",
    category: "geometry",
    modelName: "Classmate Archimedes Set",
    subtitle: "Die-Cast Ergonomic Arm Compass • Optical Polymer",
    title: "CLASSMATE ARCHIMEDES // DRAFTING SET",
    protocol: "ARCHIMEDES PROTOCOL // CA-02",
    basePrice: 120,
    lore1: "Engineered with patented gear interlocking arms that eliminate needle slippage, bundled with anti-scratch crystal-clear optical acrylic measuring scales.",
    lore2: "Interlocking gear mechanism guarantees zero wobble when drawing high-radius arcs.",
  },
  {
    id: "geom-maped-study",
    category: "geometry",
    modelName: "Maped Study Precision Compass",
    subtitle: "Soft-Grip Universal Adapter • Steel Legged",
    title: "MAPED STUDY // ERGONOMIC COMPASS",
    protocol: "MAPED PROTOCOL // MS-03",
    basePrice: 110,
    lore1: "Ergonomic shockproof thumb wheel compass with universal adapter accommodating technical pens, fineliners, and graphite wooden pencils.",
    lore2: "Universal pen adapter accepts technical inking pens and fine pigment markers.",
  },
  {
    id: "geom-faber-drawing",
    category: "geometry",
    modelName: "Faber-Castell Math Box",
    subtitle: "Optical Clear Acrylic • Beveled Inking Edges",
    title: "FABER-CASTELL // PRECISION MATH BOX",
    protocol: "FABER PROTOCOL // FC-04",
    basePrice: 140,
    lore1: "Comprehensive academic drafting kit featuring beveled inking edges that prevent technical fluid capillary creeping underneath scales during ink rendering.",
    lore2: "Beveled optical acrylic edges prevent ink bleeding onto parchment sheets.",
  },
  {
    id: "geom-camlin-scholar",
    category: "geometry",
    modelName: "Camlin Scholar Instrument Tin",
    subtitle: "Heavyweight Metal Tin • Velvet Flocked Tray",
    title: "CAMLIN SCHOLAR // DRAFTING TIN",
    protocol: "SCHOLAR PROTOCOL // CS-05",
    basePrice: 105,
    lore1: "Vintage protective tin enclosure with shock-absorbing contoured flocked slots, securing brass needle points and delicate millimeter calipers from impact.",
    lore2: "Contoured velvet-flocked interior secures needles against backpack shock.",
  },
  {
    id: "geom-staedtler-noris",
    category: "geometry",
    modelName: "Staedtler Noris Math Set",
    subtitle: "German Engineering Calibration • Anti-Glare",
    title: "STAEDTLER NORIS // GERMAN SPEC SET",
    protocol: "NORIS PROTOCOL // SN-06",
    basePrice: 180,
    lore1: "Strict DIN-standard instrument set with laser-photoetched metric and imperial divisions, featuring friction-joint compass and hardened steel points.",
    lore2: "Strict DIN-standard calibrations deliver laboratory-grade dimensional accuracy.",
  },

  // 2. ENGINEERING SCALES & PROTRACTORS
  {
    id: "scale-omega-triangular",
    category: "scales",
    modelName: "Omega 30cm Triangular Scale",
    subtitle: "Architectural 1:10 to 1:500 Color-Coded Grooves",
    title: "OMEGA ARCHITECTURAL // 1:500 TRI-SCALE",
    protocol: "SCALE PROTOCOL // OT-01",
    basePrice: 160,
    lore1: "Three-sided triangular engineering rule featuring 6 distinct architectural reduction ratios (1:10, 1:20, 1:25, 1:50, 1:100, 1:500) color-coded for instant drafting recognition.",
    lore2: "Color-coded precision grooved facets accelerate blueprint reduction drafting.",
  },
  {
    id: "scale-doms-steel-30cm",
    category: "scales",
    modelName: "Doms 30cm Stainless Steel Rule",
    subtitle: "Deep Acid-Etched Markings • Zero Slip Backing",
    title: "DOMS INDUSTRIAL // 30CM STEEL RULE",
    protocol: "STEEL PROTOCOL // DS-02",
    basePrice: 45,
    lore1: "Tempered rustproof stainless steel rule with acid-etched permanent millimeter and 0.5mm subdivisions, featuring an imperial-to-metric conversion table on the reverse.",
    lore2: "Acid-etched metric markings will never wear away from friction or solvent exposure.",
  },
  {
    id: "scale-camlin-360-protractor",
    category: "scales",
    modelName: "Camlin 360° Circular Protractor",
    subtitle: "15cm Diameter • Bi-Directional Degree Scales",
    title: "CAMLIN 360 // FULL CIRCLE PROTRACTOR",
    protocol: "AZIMUTH PROTOCOL // CP-03",
    basePrice: 55,
    lore1: "Full circular 360-degree clear optical protractor with crosshair centering target and bi-directional 1-degree divisions for navigation and surveyor coordinate plotting.",
    lore2: "Crosshair reticle centering target enables rapid radial survey plotting.",
  },
  {
    id: "scale-omega-flex-ruler",
    category: "scales",
    modelName: "Omega 30cm Shatter-Proof Ruler",
    subtitle: "Ultra-Flexible Polymer • Snap-Resistant Body",
    title: "OMEGA FLEX // SHATTERPROOF RULER",
    protocol: "POLYMER PROTOCOL // OF-04",
    basePrice: 25,
    lore1: "Bends up to 180° without cracking or permanent deformation; ideal for drawing curves across bound laboratory records and curved binder pages.",
    lore2: "180-degree flexible polymer eliminates accidental backpack ruler snaps.",
  },
  {
    id: "scale-isomars-aluminum",
    category: "scales",
    modelName: "Isomars Aluminum Tri-Scale",
    subtitle: "Solid Extruded Anodized Body • Laser Etched",
    title: "ISOMARS PRO // SOLID ALUMINUM SCALE",
    protocol: "ISOMARS PROTOCOL // IA-05",
    basePrice: 240,
    lore1: "Extruded aerospace-grade anodized aluminum body providing substantial physical heft, ground edges, and ultra-crisp white laser markings on black anodized facets.",
    lore2: "Aerospace aluminum body provides zero flex and lifelong edge fidelity.",
  },
  {
    id: "scale-faber-pocket-steel",
    category: "scales",
    modelName: "Faber-Castell 15cm Pocket Steel",
    subtitle: "Pocket Clip • Matte Anti-Glare Satin Chrome",
    title: "FABER POCKET // 15CM STEEL CALIPER",
    protocol: "POCKET PROTOCOL // FP-06",
    basePrice: 35,
    lore1: "Convenient shirt-pocket 15cm steel rule with removable sliding depth gauge clip and non-glare satin finish for rapid workshop inspection.",
    lore2: "Removable slide clip doubles as a rapid depth caliper gauge.",
  },

  // 3. SET SQUARES, T-SQUARES & CURVES
  {
    id: "draft-omega-set-squares",
    category: "drafting",
    modelName: "Omega 10-Inch Set Squares (Pair)",
    subtitle: "45° & 60° Beveled Inking Edges • Acrylic",
    title: "OMEGA PAIR // 45° & 60° SET SQUARES",
    protocol: "SQUARE PROTOCOL // OS-01",
    basePrice: 95,
    lore1: "Paired 45-degree and 60-degree drafting triangles featuring precision-milled inking bevels along each ruling edge to prevent ink bleeding under the tool.",
    lore2: "Milled inking edge steps elevate ruling lip above ink line to prevent smudging.",
  },
  {
    id: "draft-isomars-french-curves",
    category: "drafting",
    modelName: "Isomars French Curves (Set of 3)",
    subtitle: "Clear Optical Acrylic • Complex Spline Profiles",
    title: "ISOMARS CURVE // FRENCH SPLINE SET",
    protocol: "CURVE PROTOCOL // IF-02",
    basePrice: 85,
    lore1: "Set of three smooth acrylic templates with varied logarithmic and hyperbolic curve profiles, indispensable for mechanical drafting, machine design, and fashion CAD.",
    lore2: "Three logarithmic templates guide smooth transition curves for machine design.",
  },
  {
    id: "draft-omega-t-square",
    category: "drafting",
    modelName: "Omega 60cm Drafting T-Square",
    subtitle: "Polished Hardwood Blade • Clear Acrylic Edge",
    title: "OMEGA T-SQUARE // 60CM WOOD DRAFT",
    protocol: "DRAFT PROTOCOL // OW-03",
    basePrice: 190,
    lore1: "Seasoned teakwood stock securely fastened to a hardwood blade with clear transparent acrylic guide edges, aligning perfectly against standard drafting boards.",
    lore2: "Solid seasoned hardwood stock fits snug against student drafting boards.",
  },
  {
    id: "draft-helix-flex-curve",
    category: "drafting",
    modelName: "Helix Flexible Curve Ruler 50cm",
    subtitle: "Lead Core Form-Retaining • Inking Lip",
    title: "HELIX SPLINE // 50CM FLEXIBLE CURVE",
    protocol: "SPLINE PROTOCOL // HF-04",
    basePrice: 160,
    lore1: "Lead core enclosed in high-flexibility vinyl instantly contours to any irregular curve and retains shape rigidly until manually reset.",
    lore2: "Shape-retaining lead core holds exact spline curvature for symmetrical replication.",
  },
  {
    id: "draft-isomars-circle-master",
    category: "drafting",
    modelName: "Isomars Circle Master Template",
    subtitle: "36 Circular Cutouts (1mm to 35mm) • Riser Nubs",
    title: "ISOMARS MASTER // CIRCLE TEMPLATE",
    protocol: "TEMPLATE PROTOCOL // IC-05",
    basePrice: 70,
    lore1: "Flexible green transparent stencil with 36 calibrated circle cutouts from 1mm up to 35mm with molded ink risers to keep drawing surfaces clean.",
    lore2: "Molded bottom risers prevent capillary ink bleed onto drawing paper.",
  },
  {
    id: "draft-omega-adj-triangle",
    category: "drafting",
    modelName: "Omega Adjustable Triangle",
    subtitle: "8-Inch Heavy Acrylic • Brass Locking Screw",
    title: "OMEGA BEVEL // ADJUSTABLE TRIANGLE",
    protocol: "ANGLE PROTOCOL // OA-06",
    basePrice: 220,
    lore1: "Heavy-gauge transparent acrylic drafting triangle with integrated protractor quadrant and solid knurled brass locking screw for fixed angle slopes.",
    lore2: "Solid knurled brass thumb screw locks incline angles with zero drift.",
  },
];

export default function Measuring() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [category, setCategory] = useState("geometry");
  const [activeId, setActiveId] = useState("geom-camlin-exam");
  const [qty, setQty] = useState(1);

  // Configuration options for Geometry Sets
  const [geomGrade, setGeomGrade] = useState("Standard Student");
  const [geomLead, setGeomLead] = useState("0.5mm Fine");

  // Configuration options for Scales & Protractors
  const [scaleLength, setScaleLength] = useState("30cm Standard");
  const [scaleGraduation, setScaleGraduation] = useState("Dual Metric & Imperial");

  // Configuration options for Drafting Curves & Set Squares
  const [draftEdge, setDraftEdge] = useState("Inking Beveled Edge");
  const [draftPack, setDraftPack] = useState("Standard Studio");

  const [toast, setToast] = useState({ show: false, message: "" });
  const toastTimeoutRef = useRef(null);

  const categoryItems = CATALOG_ITEMS.filter((item) => item.category === category);
  const currentIndex = categoryItems.findIndex((item) => item.id === activeId);
  const currentCatalog = categoryItems[currentIndex >= 0 ? currentIndex : 0];

  const prevIndex = (currentIndex - 1 + categoryItems.length) % categoryItems.length;
  const nextIndex = (currentIndex + 1) % categoryItems.length;
  const prevItem = categoryItems[prevIndex];
  const nextItem = categoryItems[nextIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(-1);
      } else if (e.key === "ArrowLeft") {
        setActiveId(prevItem.id);
      } else if (e.key === "ArrowRight") {
        setActiveId(nextItem.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, prevItem, nextItem]);

  const showToast = (message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const firstItem = CATALOG_ITEMS.find((item) => item.category === newCat);
    if (firstItem) setActiveId(firstItem.id);
  };

  // Dynamic pricing calculations
  let productName = "";
  let unitPrice = currentCatalog.basePrice;

  if (category === "geometry") {
    let gradeAdd = 0;
    if (geomGrade === "Pro Engineering") gradeAdd = 40;
    else if (geomGrade === "Archival Metal") gradeAdd = 90;

    let leadAdd = 0;
    if (geomLead === "0.7mm Medium") leadAdd = 10;
    else if (geomLead === "2.0mm Heavy Drafting") leadAdd = 20;

    unitPrice = currentCatalog.basePrice + gradeAdd + leadAdd;
    productName = `${currentCatalog.modelName} (${geomGrade}, ${geomLead})`;
  } else if (category === "scales") {
    let lenMultiplier = 0;
    if (scaleLength === "15cm Pocket") lenMultiplier = -10;
    else if (scaleLength === "45cm Long") lenMultiplier = 35;

    let gradAdd = 0;
    if (scaleGraduation === "Dual Metric & Imperial") gradAdd = 15;
    else if (scaleGraduation === "Anti-Glare Matte") gradAdd = 25;

    unitPrice = Math.max(20, currentCatalog.basePrice + lenMultiplier + gradAdd);
    productName = `${currentCatalog.modelName} (${scaleLength}, ${scaleGraduation})`;
  } else if (category === "drafting") {
    let edgeAdd = 0;
    if (draftEdge === "Inking Beveled Edge") edgeAdd = 30;
    else if (draftEdge === "Smoky Anti-Glare") edgeAdd = 50;

    let packAdd = 0;
    if (draftPack === "Reinforced Steel Core") packAdd = 45;
    else if (draftPack === "Master Engineering Set") packAdd = 95;

    unitPrice = currentCatalog.basePrice + edgeAdd + packAdd;
    productName = `${currentCatalog.modelName} (${draftEdge}, ${draftPack})`;
  }

  const handleAdd = () => {
    if (!productName) return showToast("Select drafting spec first");
    addToCart({ name: productName, price: unitPrice, quantity: qty });
    showToast(`Added ${qty}x ${productName} to Cart`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="writing-page-shell">
        {/* RETRO-COMIC APOCALYPTIC VORTEX VECTOR PANORAMA BACKDROP */}
        <div className="writing-bg-layer" aria-hidden="true">
          <img
            src="/measuring-landscape.svg?v=1"
            alt="Apocalyptic Ruins Beneath the Dark Vortex Panorama"
            className="writing-bg-vector"
          />
        </div>

        {/* TOP RETRO-COMIC HEADER BAR */}
        <header className="writing-header-bar">
          <div className="writing-header-actions">
            <button
              type="button"
              className="writing-btn-pill"
              onClick={() => navigate(-1)}
            >
              ← BACK TO BASE
            </button>
            <Link to="/cart" className="writing-btn-pill writing-cart-pill">
              CART ({cartItems ? cartItems.length : 0})
            </Link>
          </div>
        </header>

        {/* HILL CLIMB RACING STYLE GAME CAROUSEL STAGE */}
        <main className="writing-game-stage">
          {/* HERO HEADLINE & CENTER CATEGORY SELECTOR */}
          <div className="writing-game-headline">
            <h1 className="writing-game-main-hero">MEASURING &amp; DRAWING</h1>
            <div className="writing-center-category-tabs" aria-label="Measuring Categories">
              <button
                type="button"
                className={`writing-game-tab ${category === "geometry" ? "active" : ""}`}
                onClick={() => handleCategoryChange("geometry")}
              >
                GEOMETRY SETS
              </button>
              <button
                type="button"
                className={`writing-game-tab ${category === "scales" ? "active" : ""}`}
                onClick={() => handleCategoryChange("scales")}
              >
                SCALES &amp; RULES
              </button>
              <button
                type="button"
                className={`writing-game-tab ${category === "drafting" ? "active" : ""}`}
                onClick={() => handleCategoryChange("drafting")}
              >
                SET SQUARES &amp; CURVES
              </button>
            </div>
          </div>

          {/* 3-PIECE CAROUSEL ROW (ARROW - GLASS CARD - ARROW) */}
          <div className="writing-carousel-row">
            {/* LEFT ARROW */}
            <button
              type="button"
              className="writing-nav-arrow-btn"
              onClick={() => setActiveId(prevItem.id)}
              aria-label={`Previous: ${prevItem.modelName}`}
            >
              ←
            </button>

            {/* CENTER ACTIVE GLASSMORPHISM SHOWCASE */}
            <div className="writing-active-glass-card">
              {/* TIER 1: PRODUCT TITLE & PRICE */}
              <div className="writing-card-title-block">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <h2 className="writing-card-model-name">{currentCatalog.modelName}</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span className="writing-counter-badge">{currentIndex + 1} / {categoryItems.length}</span>
                    <span className="writing-unit-price-badge">₹{unitPrice} / UNIT</span>
                  </div>
                </div>
                <span className="writing-card-subtitle">{currentCatalog.subtitle}</span>
              </div>

              {/* TIER 2: COMIC DOSSIER BOX */}
              <div className="writing-card-dossier-box">
                <p className="writing-dossier-lore">{currentCatalog.lore1}</p>
                {currentCatalog.lore2 && (
                  <p className="writing-dossier-tagline">{currentCatalog.lore2}</p>
                )}
              </div>

              {/* TIER 3: STRUCTURED CONFIGURATIONS */}
              <div className="writing-config-section">
                {category === "geometry" && (
                  <>
                    <div className="writing-config-row">
                      <span className="writing-config-label">1. Set Grade:</span>
                      <div className="writing-pill-group">
                        {["Standard Student", "Pro Engineering", "Archival Metal"].map((g) => (
                          <button
                            key={g}
                            type="button"
                            className={`writing-option-pill-btn ${geomGrade === g ? "active" : ""}`}
                            onClick={() => setGeomGrade(g)}
                          >
                            {g} {g === "Pro Engineering" ? "+₹40" : g === "Archival Metal" ? "+₹90" : ""}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="writing-config-row">
                      <span className="writing-config-label">2. Lead / Pin:</span>
                      <div className="writing-pill-group">
                        {["0.5mm Fine", "0.7mm Medium", "2.0mm Heavy Drafting"].map((l) => (
                          <button
                            key={l}
                            type="button"
                            className={`writing-option-pill-btn ${geomLead === l ? "active" : ""}`}
                            onClick={() => setGeomLead(l)}
                          >
                            {l} {l === "0.7mm Medium" ? "+₹10" : l === "2.0mm Heavy Drafting" ? "+₹20" : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {category === "scales" && (
                  <>
                    <div className="writing-config-row">
                      <span className="writing-config-label">1. Format:</span>
                      <div className="writing-pill-group">
                        {["15cm Pocket", "30cm Standard", "45cm Long"].map((len) => (
                          <button
                            key={len}
                            type="button"
                            className={`writing-option-pill-btn ${scaleLength === len ? "active" : ""}`}
                            onClick={() => setScaleLength(len)}
                          >
                            {len} {len === "15cm Pocket" ? "-₹10" : len === "45cm Long" ? "+₹35" : ""}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="writing-config-row">
                      <span className="writing-config-label">2. Precision:</span>
                      <div className="writing-pill-group">
                        {["Metric Only", "Dual Metric & Imperial", "Anti-Glare Matte"].map((grad) => (
                          <button
                            key={grad}
                            type="button"
                            className={`writing-option-pill-btn ${scaleGraduation === grad ? "active" : ""}`}
                            onClick={() => setScaleGraduation(grad)}
                          >
                            {grad} {grad === "Dual Metric & Imperial" ? "+₹15" : grad === "Anti-Glare Matte" ? "+₹25" : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {category === "drafting" && (
                  <>
                    <div className="writing-config-row">
                      <span className="writing-config-label">1. Edge Spec:</span>
                      <div className="writing-pill-group">
                        {["Clear Acrylic", "Inking Beveled Edge", "Smoky Anti-Glare"].map((ed) => (
                          <button
                            key={ed}
                            type="button"
                            className={`writing-option-pill-btn ${draftEdge === ed ? "active" : ""}`}
                            onClick={() => setDraftEdge(ed)}
                          >
                            {ed} {ed === "Inking Beveled Edge" ? "+₹30" : ed === "Smoky Anti-Glare" ? "+₹50" : ""}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="writing-config-row">
                      <span className="writing-config-label">2. Rigidity:</span>
                      <div className="writing-pill-group">
                        {["Standard Studio", "Reinforced Steel Core", "Master Engineering Set"].map((pk) => (
                          <button
                            key={pk}
                            type="button"
                            className={`writing-option-pill-btn ${draftPack === pk ? "active" : ""}`}
                            onClick={() => setDraftPack(pk)}
                          >
                            {pk} {pk === "Reinforced Steel Core" ? "+₹45" : pk === "Master Engineering Set" ? "+₹95" : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* TIER 4: DISPATCH COMMAND BAR */}
              <div className="writing-action-dispatch-row">
                <div className="writing-stepper-wrapper">
                  <span className="writing-stepper-label">UNITS</span>
                  <div className="writing-stepper-comic-box">
                    <button
                      type="button"
                      className="writing-stepper-step-btn"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="writing-stepper-val">{qty}</span>
                    <button
                      type="button"
                      className="writing-stepper-step-btn"
                      onClick={() => setQty(qty + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="writing-add-to-cart-hero-btn"
                  onClick={handleAdd}
                >
                  <span>⚡ ADD TO DISPATCH BATCH</span>
                  <span>[ ₹{unitPrice * qty} ]</span>
                </button>
              </div>
            </div>

            {/* RIGHT ARROW */}
            <button
              type="button"
              className="writing-nav-arrow-btn"
              onClick={() => setActiveId(nextItem.id)}
              aria-label={`Next: ${nextItem.modelName}`}
            >
              →
            </button>
          </div>
        </main>

        {/* TOAST POPUP */}
        <div className={`writing-toast ${toast.show ? "visible" : ""}`} role="status">
          {toast.message}
        </div>
      </div>
    </>
  );
}

