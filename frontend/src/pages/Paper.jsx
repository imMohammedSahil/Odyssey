import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&display=swap');

  :root {
    --frost-blue: #B5C8DC;
    --frost-blue-light: #D3DEE9;
    --pumpkin-orange: #FFA012;
    --pumpkin-orange-hover: #FFB338;
    --void-black: #0D0D0D;
    --midnight-slate: #172B33;
    --parchment: #F9F9F3;
    --slate-box: #B5C8DC;
    --slate-btn: #729BBF;
    --slate-btn-hover: #5D85A7;
    --grave-grey: #8FA2B0;
    --pure-white: #FFFFFF;
    --accent: #B5C8DC;
    --accent-glow: rgba(181, 200, 220, 0.35);
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
    object-position: center bottom;
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
    font-family: 'Archivo Black', sans-serif;
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
    background: var(--pumpkin-orange);
    color: var(--void-black);
    border-color: var(--void-black);
  }

  .writing-cart-pill:hover {
    background: var(--pumpkin-orange-hover);
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
    background: var(--pumpkin-orange);
    color: var(--void-black);
    transform: scale(1.08) translate(-1px, -1px);
    box-shadow: 5px 5px 0px var(--void-black);
  }

  .writing-nav-arrow-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--void-black);
  }

  /* MAIN ACTIVE GLASSMORPHISM CARD (LOCKED FIXED HEIGHT: 505px) */
  .writing-active-glass-card {
    width: 660px;
    height: 505px;
    min-height: 505px;
    max-height: 505px;
    max-width: 92vw;
    background: rgba(18, 36, 48, 0.86);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 4px solid var(--void-black);
    border-radius: 20px;
    box-shadow: 6px 6px 0px var(--void-black);
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  /* TIER 1: HEADER BLOCK */
  .writing-counter-badge {
    background: rgba(13, 13, 13, 0.85);
    color: var(--frost-blue-light);
    border: 2px solid rgba(181, 200, 220, 0.5);
    border-radius: 6px;
    padding: 4px 10px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    letter-spacing: 0.8px;
    box-shadow: 2px 2px 0px var(--void-black);
    user-select: none;
  }

  .writing-unit-price-badge {
    background: var(--pumpkin-orange);
    color: var(--void-black);
    border: 2px solid var(--void-black);
    border-radius: 6px;
    padding: 4px 12px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 13px;
    box-shadow: 2px 2px 0px var(--void-black);
  }

  .writing-card-title-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-bottom: 2px solid rgba(181, 200, 220, 0.25);
    padding-bottom: 10px;
  }

  .writing-card-model-name {
    font-family: 'Archivo Black', sans-serif;
    font-size: 26px;
    color: var(--pure-white);
    letter-spacing: 0.5px;
    line-height: 1.1;
    text-shadow: 2px 2px 0px var(--void-black);
  }

  .writing-card-subtitle {
    font-size: 13px;
    font-weight: 800;
    color: var(--frost-blue);
    letter-spacing: 0.4px;
    text-shadow: 1px 1px 0px var(--void-black);
  }

  /* TIER 2: COMIC SLATE PRODUCT DOSSIER BOX */
  .writing-card-dossier-box {
    background: var(--slate-box);
    color: var(--void-black);
    border: 3.5px solid var(--void-black);
    border-radius: 10px;
    box-shadow: 4px 4px 0px var(--void-black);
    padding: 14px 18px 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    height: 116px;
    min-height: 116px;
    box-sizing: border-box;
  }

  .writing-dossier-lore {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    color: var(--void-black);
    line-height: 1.45;
  }

  .writing-dossier-tagline {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5px;
    font-weight: 800;
    color: var(--void-black);
    background: var(--pumpkin-orange);
    border: 2px solid var(--void-black);
    border-radius: 6px;
    padding: 4px 10px;
    display: inline-block;
    line-height: 1.4;
  }

  /* TIER 3: STRUCTURED CONFIGURATIONS (LOCKED HEIGHT: 126px or 94px compact) */
  .writing-config-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    height: 126px;
    min-height: 126px;
    box-sizing: border-box;
    background: var(--slate-box);
    border: 3.5px solid var(--void-black);
    border-radius: 10px;
    box-shadow: 4px 4px 0px var(--void-black);
    padding: 14px 18px;
  }

  .writing-config-section.compact {
    height: 94px;
    min-height: 94px;
    gap: 8px;
    padding: 10px 18px;
  }

  .writing-config-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    flex-wrap: nowrap;
    white-space: nowrap;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .writing-config-row::-webkit-scrollbar {
    display: none;
  }

  .writing-config-stacked {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }

  .writing-config-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--void-black);
    letter-spacing: 0.6px;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .writing-pill-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
    white-space: nowrap;
  }

  .writing-option-pill-btn {
    background: var(--slate-btn);
    color: var(--void-black);
    border: 2px solid var(--void-black);
    border-radius: 6px;
    padding: 6px 12px;
    font-family: 'Archivo Black', sans-serif;
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
    color: var(--pumpkin-orange);
    border-color: var(--void-black);
    box-shadow: 2px 2px 0px var(--void-black);
  }

  /* COLOR CHIPS WITH LABELS */
  .writing-ink-chips-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .writing-ink-chips-row::-webkit-scrollbar {
    display: none;
  }

  .writing-ink-chip-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--slate-btn);
    border: 2px solid var(--void-black);
    border-radius: 6px;
    padding: 5px 8px;
    font-size: 11px;
    font-weight: 800;
    color: var(--void-black);
    cursor: pointer;
    box-shadow: 2px 2px 0px var(--void-black);
    transition: all 0.1s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .writing-ink-chip-btn:hover {
    background: var(--slate-btn-hover);
    transform: translateY(-1px);
  }

  .writing-ink-chip-btn.active {
    border-color: var(--void-black);
    background: var(--void-black);
    color: var(--pumpkin-orange);
    box-shadow: 2px 2px 0px var(--void-black);
  }

  .writing-ink-chip-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1.5px solid var(--void-black);
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .writing-ink-chip-btn.active .writing-ink-chip-dot.is-dark {
    border: 2px solid var(--frost-blue);
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
    color: #8FA2B0;
    letter-spacing: 0.5px;
  }

  .writing-stepper-ctrl {
    display: flex;
    align-items: center;
    background: rgba(10, 24, 34, 0.85);
    border: 3px solid var(--void-black);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-step-btn {
    background: #172F40;
    color: var(--pumpkin-orange);
    border: none;
    width: 36px;
    height: 42px;
    font-size: 18px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s ease, color 0.1s ease;
  }

  .writing-step-btn:hover {
    background: var(--pumpkin-orange);
    color: var(--void-black);
  }

  .writing-step-val {
    min-width: 34px;
    text-align: center;
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    color: var(--pure-white);
  }

  .writing-game-cta-btn {
    flex: 1;
    background: var(--pumpkin-orange);
    color: var(--void-black);
    border: 3px solid var(--void-black);
    border-radius: 8px;
    padding: 12px 18px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--void-black);
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
    text-align: center;
  }

  .writing-game-cta-btn:hover {
    transform: translate(-1.5px, -1.5px);
    box-shadow: 5px 5px 0px var(--void-black);
    background: var(--pumpkin-orange-hover);
  }

  .writing-game-cta-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--void-black);
  }

  /* CENTER CATEGORY TABS */
  .writing-center-category-tabs {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 6px;
    user-select: none;
  }

  .writing-game-tab {
    background: rgba(13, 13, 13, 0.72);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: var(--parchment);
    border: 3px solid var(--void-black);
    border-radius: 9999px;
    padding: 8px 22px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    letter-spacing: 0.8px;
    cursor: pointer;
    box-shadow: 3px 3px 0px var(--void-black);
    transition: all 0.12s ease;
    user-select: none;
  }

  .writing-game-tab:hover {
    transform: translateY(-2px);
    color: var(--pure-white);
    border-color: var(--frost-blue);
    box-shadow: 4px 4px 0px var(--void-black);
  }

  .writing-game-tab.active {
    background: var(--frost-blue);
    color: var(--void-black);
    border-color: var(--void-black);
    box-shadow: 3px 3px 0px var(--void-black);
    transform: translateY(-1px);
  }

  /* TOAST (BOTTOM-RIGHT COMIC POPUP WITH SMOOTH FADE & SLIDE) */
  .writing-toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: var(--pumpkin-orange);
    color: var(--void-black);
    border: 3.5px solid var(--void-black);
    border-radius: 12px;
    padding: 12px 22px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 13px;
    letter-spacing: 0.4px;
    box-shadow: 5px 5px 0px var(--void-black);
    z-index: 1000;
    max-width: 440px;
    line-height: 1.4;
    opacity: 0;
    transform: translateY(24px) scale(0.95);
    pointer-events: none;
    transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .writing-toast.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
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

const NOTE_COLORS = [
  { name: "Yellow", hex: "#FFE815" },
  { name: "Neon Green", hex: "#43E97B" },
  { name: "Pink", hex: "#FF65A3" },
  { name: "Ice Cyan", hex: "#38F9D7" },
  { name: "Orange", hex: "#FF9F43" },
];

const CATALOG_ITEMS = [
  // 1. NOTEBOOKS & LONGBOOKS
  {
    id: "pulp-classmate-pulse",
    category: "notebook",
    modelName: "Classmate Pulse Ruled",
    subtitle: "70 GSM High-Opacity Woodfree Paper",
    title: "CLASSMATE PULSE // RULED BOOK",
    protocol: "CLASSMATE PROTOCOL // CP-01",
    basePrice: 40,
    lore1: "High-opacity 70 GSM elemental chlorine-free woodfree paper with ozone-treated bright white ruled pages, preventing fountain and gel ink feathering during marathon lectures.",
    lore2: "Surgical ruling with micro-margin guides calibrated for rapid note-taking.",
  },
  {
    id: "pulp-youva-long",
    category: "notebook",
    modelName: "Navneet Youva Long Book",
    subtitle: "21cm x 29.7cm Long Format Dossier",
    title: "NAVNEET YOUVA // LONG FORMAT",
    protocol: "NAVNEET PROTOCOL // NY-02",
    basePrice: 60,
    lore1: "Extended ergonomic length specifically tailored for complex multi-line mathematical proofs and laboratory derivations, reinforced with heavy pin binding.",
    lore2: "Reinforced spine engineered to withstand endless transit inside packed campus backpacks.",
  },
  {
    id: "pulp-hardbound-journal",
    category: "notebook",
    modelName: "Archival Hardbound Book",
    subtitle: "Stitched Flat-Lay Archival Spine",
    title: "HARDBOUND PROTOCOL // ARCHIVAL",
    protocol: "BINDER PROTOCOL // HB-03",
    basePrice: 120,
    lore1: "Sturdy composite rigid cover wrapped in matte water-resistant lamination, featuring stitched thread binding that lays 180° completely flat on examination desks.",
    lore2: "Stitched 180-degree flat-lay spine eliminates annoying page bounce while writing.",
  },
  {
    id: "pulp-sundaram-king",
    category: "notebook",
    modelName: "Sundaram King Size Book",
    subtitle: "18cm x 24cm Wove Crown Notebook",
    title: "SUNDARAM // KING SIZE RULED",
    protocol: "SUNDARAM PROTOCOL // SK-04",
    basePrice: 50,
    lore1: "Generously sized square-spine notebook offering wide margin spacing for side annotations, formula callouts, and rapid professor reference tagging.",
    lore2: "Wide margin buffers dedicated for rapid lecture footnotes and exam revisions.",
  },
  {
    id: "pulp-practical-record",
    category: "notebook",
    modelName: "Practical Lab Record",
    subtitle: "One Side Ruled • One Side Blank Diagram",
    title: "PRACTICAL LAB // EXPERIMENT RECORD",
    protocol: "LABORATORY PROTOCOL // PR-05",
    basePrice: 75,
    lore1: "Split alternating format designed for chemistry, physics, and biology laboratory submissions: heavy blank cartridge sheet on the left for schematics, ruled on the right.",
    lore2: "Laboratory standard dual-faced layout certified for scientific faculty grading.",
  },
  {
    id: "pulp-unruled-doodler",
    category: "notebook",
    modelName: "Luxor Matrix Blank Doodler",
    subtitle: "Pure Unrestricted Cartridge Pages",
    title: "LUXOR MATRIX // UNRULED SKETCH",
    protocol: "CARTOGRAPHY PROTOCOL // LM-06",
    basePrice: 65,
    lore1: "Unrestricted boundary-free unruled layout crafted from smooth heavyweight opaque stock, optimized for system architecture flowcharts, mind maps, and rapid mechanical sketching.",
    lore2: "Pure uninterrupted canvas ready for freeform algorithm schematics.",
  },

  // 2. SPIRAL & WIREBOUND
  {
    id: "spiral-pulse-multi",
    category: "spiral",
    modelName: "Pulse 6-Subject Wirebound",
    subtitle: "Twin-Wire Steel Loops + Poly Dividers",
    title: "PULSE 6-SUBJECT // WIRE DIVISION",
    protocol: "SUBJECT PROTOCOL // SW-01",
    basePrice: 100,
    lore1: "Multi-subject heavy twin-wire bound dossier equipped with repositionable frosted polymer tab dividers and inner document storage pockets for entire semester modules.",
    lore2: "Twin-wire steel loops prevent snags while flipping between different subjects.",
  },
  {
    id: "spiral-steno-pad",
    category: "spiral",
    modelName: "Navneet Top Steno Spiral",
    subtitle: "Ambidextrous Top-Bound Perforated Pad",
    title: "NAVNEET STENO // TOP SPIRAL PAD",
    protocol: "SHORTHAND PROTOCOL // NT-02",
    basePrice: 55,
    lore1: "Top-mounted spiral binding designed for left-and-right hand ambidextrous ease, micro-perforated along the top margin for instant snag-free sheet tearing.",
    lore2: "Top-mounted wire loop clears wrist fatigue during long shorthand sprints.",
  },
  {
    id: "spiral-solo-exec",
    category: "spiral",
    modelName: "Solo Executive PP Spiral",
    subtitle: "Waterproof Polypropylene Rigid Cover",
    title: "SOLO EXEC // ALL-WEATHER PP",
    protocol: "POLYMER PROTOCOL // SP-03",
    basePrice: 110,
    lore1: "Rigid shatterproof polymer cover impervious to rain droplets and spilled cafeteria beverages, encasing high-grade silk-finish writing stock.",
    lore2: "Impervious polymer casing built to survive outdoor campus spills.",
  },
  {
    id: "spiral-perfo-notepad",
    category: "spiral",
    modelName: "Perfo-Sheet Project Pad",
    subtitle: "Laser Micro-Perforated Clean Tear-Out",
    title: "PERFO-SHEET // PROJECT MEMO PAD",
    protocol: "TEAR-OFF PROTOCOL // PS-04",
    basePrice: 45,
    lore1: "Laser-cut micro-perforations ensure detached project leaves leave zero ragged edges or paper shreds when ripped out for professor submission.",
    lore2: "Laser micro-perforations ensure neat, clean assignment tear-outs.",
  },
  {
    id: "spiral-dot-matrix",
    category: "spiral",
    modelName: "Modular Dot Grid Journal",
    subtitle: "5mm Faint Isometric Matrix Scaffold",
    title: "DOT-MATRIX // MODULAR JOURNAL",
    protocol: "ISOMETRIC PROTOCOL // DM-05",
    basePrice: 95,
    lore1: "Engineered with faint grey 5mm isometric dot matrix grid for effortless balance between neat handwriting, tabular code alignment, and UI wireframing.",
    lore2: "Subtle 5mm dot grid provides clean scaffolding for UI wireframes and data tables.",
  },
  {
    id: "spiral-kraft-eco",
    category: "spiral",
    modelName: "Kraft Nature Eco Spiral",
    subtitle: "400 GSM Unbleached Board Cover",
    title: "KRAFT NATURE // ECO WIREBOUND",
    protocol: "ECOLOGY PROTOCOL // KN-06",
    basePrice: 70,
    lore1: "Heavy 400 GSM unbleached kraft board cover enclosing eco-certified natural shade paper, offering high tooth and friction for tactile graphite and rollerball glide.",
    lore2: "High-friction tooth surface engineered for expressive ink absorption.",
  },

  // 3. REAMS, NOTES & SHEETS
  {
    id: "ream-jk-copier",
    category: "reams",
    modelName: "JK Copier A4 Ream (75 GSM)",
    subtitle: "500 Sheets • ColorLok Fast-Dry Tech",
    title: "JK COPIER // A4 75 GSM 500-REAM",
    protocol: "ROTARY PROTOCOL // JK-01",
    basePrice: 340,
    lore1: "The universal campus benchmark: 500 sheets of precision rotary-cut 75 GSM multipurpose paper featuring ColorLok tech for bolder blacks and vibrant laser or inkjet printing.",
    lore2: "Jam-free high-speed rotary cut engineered for high-volume thesis print runs.",
  },
  {
    id: "ream-bilt-matrix",
    category: "reams",
    modelName: "Bilt Matrix 80 GSM Ream",
    subtitle: "500 Sheets • Dual-Side Opaque Sheet",
    title: "BILT MATRIX // 80 GSM PRO REAM",
    protocol: "MATRIX PROTOCOL // BM-02",
    basePrice: 390,
    lore1: "Heavyweight 80 GSM ultra-white ream with superior opacity that prevents dual-side show-through on intensive color charts, diagrams, and double-sided academic papers.",
    lore2: "Ultra-dense fiber structure completely prevents dual-sided bleed-through.",
  },
  {
    id: "ream-postit-neon",
    category: "reams",
    modelName: "Post-it Neon Sticky Notes",
    subtitle: "3x3 Square Memo Pads • 100 Sheets",
    title: "POST-IT NEON // 3x3 SQUARE NOTES",
    protocol: "ADHESIVE PROTOCOL // PN-03",
    basePrice: 40,
    lore1: "Pressure-sensitive repositionable adhesive strip bonds reliably to computer monitors, textbooks, and glass doors without leaving gummy residue upon removal.",
    lore2: "Repositionable adhesive sticks firm and removes clean with zero residue.",
  },
  {
    id: "ream-page-flags",
    category: "reams",
    modelName: "Post-it Index Page Flags",
    subtitle: "5 Neon Colors • 100 Film Strips",
    title: "PAGE FLAGS // HIGH-VIS TAB STRIPS",
    protocol: "INDEXING PROTOCOL // PF-04",
    basePrice: 60,
    lore1: "Semi-transparent waterproof plastic index markers allowing text underneath to remain readable while flagging critical syllabus chapters and revision bookmarks.",
    lore2: "Translucent film tabs keep page references instantly accessible during exams.",
  },
  {
    id: "ream-graph-folio",
    category: "reams",
    modelName: "Engineering Graph Folio",
    subtitle: "50 Loose Sheets • 1mm Grid Cartridge",
    title: "ENGINEERING // GRAPH SHEET FOLIO",
    protocol: "CARTESIAN PROTOCOL // EG-05",
    basePrice: 40,
    lore1: "High-accuracy millimeter grid printed in subtle non-reproducing cyan ink, calibrated for accurate electronic circuit plots, coordinate geometry, and mechanical tolerance maps.",
    lore2: "Precision 1mm millimeter lines printed in optical non-reproducing cyan ink.",
  },
  {
    id: "ream-exam-sheets",
    category: "reams",
    modelName: "Ruled Exam Test Sheets",
    subtitle: "100 Loose Folio Sheets • Punched Margin",
    title: "EXAM-READY // RULED FOLIO SHEETS",
    protocol: "EXAMINATION PROTOCOL // ES-06",
    basePrice: 50,
    lore1: "Pre-punched twin binder margin holes on 70 GSM ruled folio sheets, formatted to standard university examination specifications for immediate answer sheet filing.",
    lore2: "Pre-punched margin layout formatted for immediate project binder filing.",
  },
];

export default function Paper() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [category, setCategory] = useState("notebook");
  const [activeId, setActiveId] = useState("pulp-classmate-pulse");
  const [qty, setQty] = useState(1);

  // Category 1: Notebook state
  const [notebookRuling, setNotebookRuling] = useState("Ruled");
  const [notebookSize, setNotebookSize] = useState("King");
  const [notebookPages, setNotebookPages] = useState("200");

  // Category 2: Spiral state
  const [spiralPages, setSpiralPages] = useState("200 Pages");

  // Category 3: Reams & Notes state
  const [sheetPackType, setSheetPackType] = useState("Standard Pack");
  const [sheetColor, setSheetColor] = useState("Yellow");

  const [toast, setToast] = useState({ show: false, message: "" });
  const toastTimeoutRef = useRef(null);

  const categoryItems = CATALOG_ITEMS.filter((item) => item.category === category);
  const currentIndex = categoryItems.findIndex((item) => item.id === activeId);
  const currentCatalog = categoryItems[currentIndex] || categoryItems[0];

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

  let productName = "";
  let unitPrice = currentCatalog.basePrice;

  if (category === "notebook") {
    // Dynamic pricing based on standard university book tiers
    if (notebookSize === "Small") {
      unitPrice = notebookPages === "200" ? 40 : 20;
    } else if (notebookSize === "King") {
      unitPrice = notebookPages === "200" ? 60 : 30;
    } else if (notebookSize === "Long") {
      if (notebookPages === "100") unitPrice = 40;
      else if (notebookPages === "200") unitPrice = 60;
      else unitPrice = 130;
    }
    productName = `${currentCatalog.modelName} (${notebookSize}, ${notebookRuling}, ${notebookPages} Pages)`;
  } else if (category === "spiral") {
    if (spiralPages === "100 Pages") unitPrice = 50;
    else if (spiralPages === "200 Pages") unitPrice = 100;
    else if (spiralPages === "300 Pages") unitPrice = 150;
    productName = `${currentCatalog.modelName} (${spiralPages})`;
  } else if (category === "reams") {
    if (currentCatalog.id === "ream-jk-copier" || currentCatalog.id === "ream-bilt-matrix") {
      if (sheetPackType === "2-Ream Bundle") unitPrice = Math.round(unitPrice * 1.95);
      else if (sheetPackType === "5-Ream Box") unitPrice = Math.round(unitPrice * 4.75);
      productName = `${currentCatalog.modelName} (${sheetPackType})`;
    } else if (currentCatalog.id === "ream-postit-neon") {
      productName = `${currentCatalog.modelName} (${sheetColor})`;
    } else {
      productName = `${currentCatalog.modelName} (${sheetPackType})`;
    }
  }

  const handleAdd = () => {
    if (!productName) return showToast("Select paper spec first");
    addToCart({ name: productName, price: unitPrice, quantity: qty });
    showToast(`Added ${qty}x ${productName} to Cart`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="writing-page-shell">
        {/* 100% PURE VECTOR BACKDROP */}
        <div className="writing-bg-layer" aria-hidden="true">
          <img
            src="/paper-landscape.svg?v=1"
            alt=""
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
              title="Return to base (Esc)"
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
            <h1 className="writing-game-main-hero">PULP &amp; PARCHMENT</h1>
            <div className="writing-center-category-tabs" aria-label="Paper Categories">
              <button
                type="button"
                className={`writing-game-tab ${category === "notebook" ? "active" : ""}`}
                onClick={() => handleCategoryChange("notebook")}
              >
                NOTEBOOKS
              </button>
              <button
                type="button"
                className={`writing-game-tab ${category === "spiral" ? "active" : ""}`}
                onClick={() => handleCategoryChange("spiral")}
              >
                SPIRAL BOUND
              </button>
              <button
                type="button"
                className={`writing-game-tab ${category === "reams" ? "active" : ""}`}
                onClick={() => handleCategoryChange("reams")}
              >
                REAMS &amp; NOTES
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
              title={`Previous: ${prevItem.modelName} (← key)`}
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
              <div className={`writing-config-section ${category === "spiral" ? "compact" : ""}`}>
                {category === "notebook" && (
                  <>
                    <div className="writing-config-row">
                      <span className="writing-config-label">1. Ruling:</span>
                      <div className="writing-pill-group">
                        {["Ruled", "Unruled"].map((r) => (
                          <button
                            key={r}
                            type="button"
                            className={`writing-option-pill-btn ${notebookRuling === r ? "active" : ""}`}
                            onClick={() => setNotebookRuling(r)}
                          >
                            {r}
                          </button>
                        ))}
                      </div>

                      <span className="writing-config-label" style={{ marginLeft: "10px" }}>2. Size:</span>
                      <div className="writing-pill-group">
                        {["Small", "King", "Long"].map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`writing-option-pill-btn ${notebookSize === s ? "active" : ""}`}
                            onClick={() => {
                              setNotebookSize(s);
                              if (s !== "Long" && notebookPages === "300") {
                                setNotebookPages("200");
                              }
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="writing-config-row">
                      <span className="writing-config-label">3. Volume:</span>
                      <div className="writing-pill-group">
                        {(notebookSize === "Long" ? ["100", "200", "300"] : ["100", "200"]).map((pg) => (
                          <button
                            key={pg}
                            type="button"
                            className={`writing-option-pill-btn ${notebookPages === pg ? "active" : ""}`}
                            onClick={() => setNotebookPages(pg)}
                          >
                            {pg} Pages {notebookSize === "Small" ? (pg === "100" ? "₹20" : "₹40") : notebookSize === "King" ? (pg === "100" ? "₹30" : "₹60") : (pg === "100" ? "₹40" : pg === "200" ? "₹60" : "₹130")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {category === "spiral" && (
                  <div className="writing-config-row">
                    <span className="writing-config-label">1. Volume Spec:</span>
                    <div className="writing-pill-group">
                      {[
                        { id: "100 Pages", label: "100 Pages (₹50)" },
                        { id: "200 Pages", label: "200 Pages (₹100)" },
                        { id: "300 Pages", label: "300 Pages (₹150)" },
                      ].map((sp) => (
                        <button
                          key={sp.id}
                          type="button"
                          className={`writing-option-pill-btn ${spiralPages === sp.id ? "active" : ""}`}
                          onClick={() => setSpiralPages(sp.id)}
                        >
                          {sp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {category === "reams" && (
                  <>
                    <div className="writing-config-row">
                      <span className="writing-config-label">1. Issue Pack:</span>
                      <div className="writing-pill-group">
                        {currentCatalog.id.includes("copier") || currentCatalog.id.includes("matrix") ? (
                          ["Single Ream (500s)", "2-Ream Bundle", "5-Ream Box"].map((p) => (
                            <button
                              key={p}
                              type="button"
                              className={`writing-option-pill-btn ${sheetPackType === p ? "active" : ""}`}
                              onClick={() => setSheetPackType(p)}
                            >
                              {p}
                            </button>
                          ))
                        ) : (
                          ["Standard Pack", "Double Duo Pack", "Classroom Box"].map((p) => (
                            <button
                              key={p}
                              type="button"
                              className={`writing-option-pill-btn ${sheetPackType === p ? "active" : ""}`}
                              onClick={() => setSheetPackType(p)}
                            >
                              {p}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="writing-config-row">
                      <span className="writing-config-label">2. Memo Hue:</span>
                      <div className="writing-ink-chips-row">
                        {NOTE_COLORS.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            className={`writing-ink-chip-btn ${sheetColor === c.name ? "active" : ""}`}
                            onClick={() => setSheetColor(c.name)}
                          >
                            <span
                              className="writing-ink-chip-dot"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
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
                  <span className="writing-stepper-label">QTY:</span>
                  <div className="writing-stepper-ctrl">
                    <button
                      type="button"
                      className="writing-step-btn"
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="writing-step-val">{qty}</span>
                    <button
                      type="button"
                      className="writing-step-btn"
                      onClick={() => setQty((prev) => prev + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="writing-game-cta-btn"
                  onClick={handleAdd}
                >
                  ADD TO CART • ₹{unitPrice * qty}
                </button>
              </div>
            </div>

            {/* RIGHT ARROW */}
            <button
              type="button"
              className="writing-nav-arrow-btn"
              onClick={() => setActiveId(nextItem.id)}
              aria-label={`Next: ${nextItem.modelName}`}
              title={`Next: ${nextItem.modelName} (→ key)`}
            >
              →
            </button>
          </div>
        </main>

        {/* RETRO-COMIC DISPATCH TOAST */}
        <aside
          role="status"
          aria-live="polite"
          className={`writing-toast ${toast.show ? "visible" : ""}`}
        >
          {toast.message}
        </aside>
      </div>
    </>
  );
}

