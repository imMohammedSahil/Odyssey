import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&display=swap');

  :root {
    --moon-lavender: #D2A9E8;
    --moon-lavender-light: #EBD4FB;
    --pumpkin-orange: #FFA012;
    --pumpkin-orange-hover: #FFB338;
    --void-black: #0D0D0D;
    --night-purple: #2D114D;
    --parchment: #F9F9F3;
    --lilac-box: #C899EB;
    --lilac-btn: #B078DD;
    --lilac-btn-hover: #9E62CE;
    --grave-grey: #A8B3B8;
    --pure-white: #FFFFFF;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .writing-page-shell {
    width: 100vw;
    height: 100vh;
    background-color: #2D114D;
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
    background-color: #2D114D;
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
    color: var(--moon-lavender);
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

  /* MAIN ACTIVE GLASSMORPHISM CARD (LOCKED FIXED HEIGHT) */
  .writing-active-glass-card {
    width: 660px;
    height: 505px;
    min-height: 505px;
    max-height: 505px;
    max-width: 92vw;
    background: rgba(28, 12, 44, 0.86);
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
    color: var(--moon-lavender-light);
    border: 2px solid rgba(210, 169, 232, 0.5);
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
    border-bottom: 2px solid rgba(210, 169, 232, 0.25);
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
    color: var(--moon-lavender);
    letter-spacing: 0.4px;
    text-shadow: 1px 1px 0px var(--void-black);
  }

  /* TIER 2: COMIC LILAC PRODUCT INFO BOX */
  .writing-card-dossier-box {
    background: var(--lilac-box);
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

  /* TIER 3: STRUCTURED CONFIGURATIONS (LILAC MATCH + FIXED HEIGHT) */
  .writing-config-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    height: 126px;
    min-height: 126px;
    box-sizing: border-box;
    background: var(--lilac-box);
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
    width: 100%;
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
  }

  .writing-option-pill-btn {
    background: var(--lilac-btn);
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
  }

  .writing-option-pill-btn:hover {
    background: var(--lilac-btn-hover);
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
  }

  .writing-ink-chip-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--lilac-btn);
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
  }

  .writing-ink-chip-btn:hover {
    background: var(--lilac-btn-hover);
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

  .writing-ink-chip-btn.active .writing-ink-chip-dot.is-black {
    border: 2px solid var(--moon-lavender);
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
    color: #A8B3B8;
    letter-spacing: 0.5px;
  }

  .writing-stepper-ctrl {
    display: flex;
    align-items: center;
    background: rgba(18, 8, 30, 0.85);
    border: 3px solid var(--void-black);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-step-btn {
    background: #25123D;
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
    border-color: var(--moon-lavender);
    box-shadow: 4px 4px 0px var(--void-black);
  }

  .writing-game-tab.active {
    background: var(--moon-lavender);
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
      width: 100%;
      max-width: 420px;
      padding: 16px;
    }
  }
`;

const CATALOG_ITEMS = [
  // 1. CORRECTION (Whitener & Tape)
  {
    id: "corr-tape-kokuyo",
    category: "correction",
    modelName: "Kokuyo Beetle Tape",
    subtitle: "5mm × 6m Instant Dry Redaction",
    title: "KOKUYO TAPE // DRY SHIELD",
    protocol: "KOKUYO PROTOCOL // KT-01",
    basePrice: 30,
    lore1: "Ultra-thin tear-resistant polymer film engineered for instant dry application with zero drying wait time, leaving clean white surfaces ready for immediate ball or gel overwriting.",
    lore2: "Instant zero-dry-time tape with zero ghostly shadow on high-resolution photocopy scans.",
  },
  {
    id: "corr-whitener-pen",
    category: "correction",
    modelName: "Camlin Whitener Pen",
    subtitle: "0.8mm Fine Metal Needle Point",
    title: "CAMLIN METAL-TIP // FLUID PEN",
    protocol: "CAMLIN PROTOCOL // CW-02",
    basePrice: 20,
    lore1: "Pressurized valve-controlled squeeze barrel housing high-opacity titanium white fluid, designed with a micro-steel needle ball for pinpoint erasure of single mathematical figures and typos.",
    lore2: "Surgical pinpoint needle tip tailored for microscopic equation edits.",
  },
  {
    id: "corr-faber-tape",
    category: "correction",
    modelName: "Faber Retractable Tape",
    subtitle: "Refillable Push-Button Applicator",
    title: "FABER RETRACTABLE // TAPE-03",
    protocol: "CASTELL PROTOCOL // FC-03",
    basePrice: 45,
    lore1: "Retractable push-button cassette mechanism shielding tape head from pocket debris, loaded with flexible swivel applicator for seamless curve tracking along ruled notebook lines.",
    lore2: "Tactical swivel head flexes smoothly over misaligned handwritten text.",
  },
  {
    id: "corr-fluid-bottle",
    category: "correction",
    modelName: "Kores Chalk-White Bottle",
    subtitle: "15ml Quick-Dry Applicator Sponge",
    title: "KORES BOTTLE // RAPID DRY",
    protocol: "KORES PROTOCOL // KB-04",
    basePrice: 25,
    lore1: "Classic high-yield solvent-based fluid bottle with precision triangular applicator brush, offering ultra-dense high-contrast coverage to obliterate heavy permanent marker ink in a single pass.",
    lore2: "Dense opaque chalk formula built to obliterate persistent permanent ink stains.",
  },
  {
    id: "corr-tombow-mono",
    category: "correction",
    modelName: "Tombow Mono Air Tape",
    subtitle: "Air Touch Ultra-Light Glide System",
    title: "TOMBOW MONO // AIR-05",
    protocol: "TOMBOW PROTOCOL // TM-05",
    basePrice: 55,
    lore1: "Proprietary Air Touch technology drastically reduces pull resistance until the very end of the roll, preventing tape peel-back or tearing under rapid deadline exam conditions.",
    lore2: "Zero-drag effortless glide prevents tape rupture under frantic test conditions.",
  },
  {
    id: "corr-pentel-zl",
    category: "correction",
    modelName: "Pentel Micro Correct ZL",
    subtitle: "Multi-Surface Fine Tip Correction",
    title: "PENTEL MICRO // ZL-06",
    protocol: "PENTEL PROTOCOL // PZ-06",
    basePrice: 35,
    lore1: "Heavy-duty steel point coupled with anti-clogging formula that writes smoothly over thermal receipts, printed test papers, and heavy GSM engineering sheets without gumming up.",
    lore2: "Anti-clogging German valve mechanism built for heavy GSM test papers.",
  },

  // 2. MARKERS (Permanent & Whiteboard)
  {
    id: "mark-camlin-perm",
    category: "marker",
    modelName: "Camlin Permanent Marker",
    subtitle: "Alcohol-Based Waterproof Ink",
    title: "CAMLIN PERM // BULLET & CHISEL",
    protocol: "CAMLIN PROTOCOL // CP-01",
    basePrice: 15,
    lore1: "High-density Japanese acrylic fiber tip delivering deep UV-resistant waterproof ink across plastics, glassware, metal casings, and cardboard without fading or smearing.",
    lore2: "Indelible weather-proof ink bonded for laboratory glass and project packaging.",
  },
  {
    id: "mark-reynolds-bold",
    category: "marker",
    modelName: "Reynolds Bold Permanent",
    subtitle: "Chisel Tip Heavy Industrial Ink",
    title: "REYNOLDS BOLD // INDUSTRIAL",
    protocol: "REYNOLDS PROTOCOL // RB-02",
    basePrice: 18,
    lore1: "Extra-wide chisel felt nib offering dual line widths from 1.5mm fine outlines to 4.5mm broad stroke poster banners, loaded with dense carbon pitch black pigment.",
    lore2: "High-cadence broad stroke marker calibrated for competition poster presentations.",
  },
  {
    id: "mark-camlin-wb",
    category: "marker",
    modelName: "Camlin Whiteboard Marker",
    subtitle: "Easy Wipe High-Visibility Marker",
    title: "CAMLIN DRY-ERASE // WB-03",
    protocol: "WHITEBOARD PROTOCOL // CW-03",
    basePrice: 25,
    lore1: "Non-toxic low-odor dry erase formulation that wipes cleanly off melamine and magnetic boards without ghosting residue, delivering ultra-bold vibrant lines for seminar rooms.",
    lore2: "Zero-ghosting dry wipe formula leaving classrooms gleaming white.",
  },
  {
    id: "mark-luxor-wb",
    category: "marker",
    modelName: "Luxor Whiteboard Bullet",
    subtitle: "Dense Cap-Off Safe Dry Erase",
    title: "LUXOR WB // BULLET-04",
    protocol: "LUXOR PROTOCOL // LW-04",
    basePrice: 25,
    lore1: "24-hour cap-off preservation prevents tip dehydration during marathon lecture hall sessions, paired with a reinforced bullet tip that resists crushing under heavy whiteboard pressure.",
    lore2: "24-hour anti-dry cap-off resilience engineered for marathon academic lectures.",
  },
  {
    id: "mark-dual-metallic",
    category: "marker",
    modelName: "Dual-Tip Multi Marker",
    subtitle: "Fine + Broad Double Head",
    title: "DUAL-HEAD // MULTI-SURFACE",
    protocol: "METALLIC PROTOCOL // DH-05",
    basePrice: 40,
    lore1: "Dual-ended barrel featuring a 0.5mm micro-detail bullet on one end and a 3.0mm wedge chisel on the other, built for technical flowcharts and rapid schematic annotations.",
    lore2: "Versatile twin nib layout eliminates switching markers mid-sketch.",
  },
  {
    id: "mark-sharpie-fine",
    category: "marker",
    modelName: "Sharpie Extreme Pro",
    subtitle: "Original Permanent Exam Marker",
    title: "SHARPIE EXTREME // PRO-06",
    protocol: "SHARPIE PROTOCOL // SF-06",
    basePrice: 50,
    lore1: "Iconic fine point permanent marker formulated with quick-drying, fade-resistant ink certified for enduring extreme weather conditions, moist test surfaces, and heavy handling.",
    lore2: "Certified extreme-endurance ink impervious to UV fading and chemical moisture.",
  },

  // 3. HIGHLIGHTERS
  {
    id: "hl-stabilo-boss",
    category: "highlighter",
    modelName: "Stabilo Boss Original",
    subtitle: "German 4-Hour Anti-Dry-Out Chisel",
    title: "STABILO BOSS // ORIGINAL",
    protocol: "STABILO PROTOCOL // SB-01",
    basePrice: 30,
    lore1: "Classic 4-hour cap-off anti-dry technology with dual-width chisel tip (2mm + 5mm), engineered with vibrant water-based fluorescent ink that will not bleed through thin textbook sheets.",
    lore2: "Legendary German 4-hour anti-dry resilience with zero bleed-through on textbook paper.",
  },
  {
    id: "hl-faber-textliner",
    category: "highlighter",
    modelName: "Faber Textliner 48",
    subtitle: "Super-Fluorescent Universal Tip",
    title: "FABER TEXTLINER // 48-02",
    protocol: "TEXTLINER PROTOCOL // FT-02",
    basePrice: 25,
    lore1: "Special polyester chisel tip marks in 3 line widths (5mm, 2mm, 1mm) using lightfast water-based ink that is completely photocopy and facsimile neutral for clear study reproduction.",
    lore2: "Photocopy-neutral fluorescent luminosity guarantees clear digital scanning.",
  },
  {
    id: "hl-luxor-pastel",
    category: "highlighter",
    modelName: "Luxor Pastel Soft Glow",
    subtitle: "Subtle Eye-Soothing Pastel Tint",
    title: "LUXOR PASTEL // SOFT GLOW",
    protocol: "LUXOR PROTOCOL // LP-03",
    basePrice: 20,
    lore1: "Gentle milk-toned pastel ink formulated to reduce retinal glare during midnight study marathons, highlighting crucial definitions without masking or overwhelming tiny subscript characters.",
    lore2: "Anti-glare soothing pastel tone designed for exhausting late-night cram sessions.",
  },
  {
    id: "hl-kokuyo-beetle",
    category: "highlighter",
    modelName: "Kokuyo Beetle 3-Way",
    subtitle: "Japanese 3-Way Horned Chisel",
    title: "KOKUYO BEETLE // 3-WAY",
    protocol: "KOKUYO PROTOCOL // KB-04",
    basePrice: 65,
    lore1: "Revolutionary horned beetle nib allows users to highlight text, draw fine underlines, or create double border guides without rotating the pen barrel, maximizing study speed.",
    lore2: "Horned Japanese 3-in-1 tip enables instantaneous underlining without barrel rotation.",
  },
  {
    id: "hl-zebra-mildliner",
    category: "highlighter",
    modelName: "Zebra Mildliner Twin",
    subtitle: "Chisel & Bullet Twin Marker",
    title: "ZEBRA MILDLINER // TWIN-05",
    protocol: "MILDLINER PROTOCOL // ZM-05",
    basePrice: 95,
    lore1: "Twin-tip construction featuring a broad chisel and fine bullet nib filled with translucent water-resistant pigment ink that creates zero smudging over fresh rollerball and gel notes.",
    lore2: "Zero-smudge translucent pigment engineered specifically for fresh gel pen ink.",
  },
  {
    id: "hl-multipack",
    category: "highlighter",
    modelName: "Campus Neon 5-Pack",
    subtitle: "5 Fluorescent Highlighters Set",
    title: "NEON PROTOCOL // 5-COLOR PACK",
    protocol: "MULTI-PACK PROTOCOL // MP-06",
    basePrice: 100,
    lore1: "All-in-one tactical exam highlighter bundle containing Yellow, Green, Pink, Blue, and Orange neon markers in a hard transparent snap-lock comic shell for total campus preparedness.",
    lore2: "Complete tactical color-coding arsenal in a rugged transparent snap-lock box.",
  },
];

const MARKER_COLORS = [
  { name: "Black", hex: "#0D0D0D" },
  { name: "Blue", hex: "#1D4ED8" },
  { name: "Red", hex: "#DC2626" },
  { name: "Green", hex: "#16A34A" },
];

const HIGHLIGHTER_COLORS = [
  { name: "Yellow", hex: "#EAB308" },
  { name: "Green", hex: "#22C55E" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Blue", hex: "#38BDF8" },
  { name: "Orange", hex: "#F97316" },
];

function Correction() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [category, setCategory] = useState("correction");
  const [activeId, setActiveId] = useState("corr-tape-kokuyo");

  // Options
  const [corrOption, setCorrOption] = useState("Standard (5mm)");
  const [markerTip, setMarkerTip] = useState("Bullet");
  const [markerColor, setMarkerColor] = useState("Black");
  const [hlMode, setHlMode] = useState("Single");
  const [hlColor, setHlColor] = useState("Yellow");

  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "" });
  const toastTimeoutRef = useRef(null);

  const categoryItems = CATALOG_ITEMS.filter((item) => item.category === category);
  const currentCatalog = CATALOG_ITEMS.find((item) => item.id === activeId) || categoryItems[0] || CATALOG_ITEMS[0];
  const currentIndex = categoryItems.findIndex((item) => item.id === currentCatalog.id);

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

  if (category === "correction") {
    productName = `${currentCatalog.modelName} (${corrOption})`;
  } else if (category === "marker") {
    if (markerTip === "Bold" || markerTip === "Chisel") unitPrice = Math.max(unitPrice, 18);
    productName = `${currentCatalog.modelName} (${markerTip} Tip, ${markerColor})`;
  } else if (category === "highlighter") {
    if (hlMode === "Pack") {
      unitPrice = 100;
      productName = `${currentCatalog.modelName} (5-Color Multi-Pack)`;
    } else {
      productName = `${currentCatalog.modelName} (${hlColor})`;
    }
  }

  const grandTotal = unitPrice * (qty || 1);

  const handleAdd = () => {
    if (!productName) return showToast("Select tool first");
    addToCart({ name: productName, price: unitPrice, quantity: qty });
    showToast(`Added ${qty}x ${productName} to Survival Loadout`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="writing-page-shell">
        {/* 100% PURE VECTOR BACKDROP */}
        <div className="writing-bg-layer" aria-hidden="true">
          <img
            src="/correction-landscape.svg?v=2"
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
            <h1 className="writing-game-main-hero">PURGE &amp; MARK</h1>
            <div className="writing-center-category-tabs" aria-label="Tool Categories">
              <button
                type="button"
                className={`writing-game-tab ${category === "correction" ? "active" : ""}`}
                onClick={() => handleCategoryChange("correction")}
              >
                CORRECTION
              </button>
              <button
                type="button"
                className={`writing-game-tab ${category === "marker" ? "active" : ""}`}
                onClick={() => handleCategoryChange("marker")}
              >
                MARKERS
              </button>
              <button
                type="button"
                className={`writing-game-tab ${category === "highlighter" ? "active" : ""}`}
                onClick={() => handleCategoryChange("highlighter")}
              >
                HIGHLIGHTERS
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
              <div className={`writing-config-section ${category === "correction" ? "compact" : ""}`}>
                {category === "correction" && (
                  <div className="writing-config-stacked">
                    <span className="writing-config-label">1. Applicator Spec</span>
                    <div className="writing-pill-group">
                      {["Standard (5mm)", "Pocket Mini", "Pro Refill (10m)"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`writing-option-pill-btn ${corrOption === opt ? "active" : ""}`}
                          onClick={() => setCorrOption(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {category === "marker" && (
                  <>
                    <div className="writing-config-row">
                      <span className="writing-config-label">1. Nib Profile</span>
                      <div className="writing-pill-group">
                        {[
                          { id: "Bullet", label: "Bullet Tip (Fine)" },
                          { id: "Chisel", label: "Chisel Tip (Bold)" },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            className={`writing-option-pill-btn ${markerTip === t.id ? "active" : ""}`}
                            onClick={() => setMarkerTip(t.id)}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="writing-config-row">
                      <span className="writing-config-label">2. Pigment Spectrum</span>
                      <div className="writing-ink-chips-row">
                        {MARKER_COLORS.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            className={`writing-ink-chip-btn ${markerColor === c.name ? "active" : ""}`}
                            onClick={() => setMarkerColor(c.name)}
                          >
                            <span
                              className={`writing-ink-chip-dot ${c.name === "Black" ? "is-black" : ""}`}
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {category === "highlighter" && (
                  <>
                    <div className="writing-config-row">
                      <span className="writing-config-label">1. Issue Mode</span>
                      <div className="writing-pill-group">
                        {[
                          { id: "Single", label: "Single Chisel" },
                          { id: "Pack", label: "5-Color Pack (₹100)" },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            className={`writing-option-pill-btn ${hlMode === m.id ? "active" : ""}`}
                            onClick={() => setHlMode(m.id)}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hlMode === "Single" ? (
                      <div className="writing-config-row">
                        <span className="writing-config-label">2. Neon Hue</span>
                        <div className="writing-ink-chips-row">
                          {HIGHLIGHTER_COLORS.map((c) => (
                            <button
                              key={c.name}
                              type="button"
                              className={`writing-ink-chip-btn ${hlColor === c.name ? "active" : ""}`}
                              onClick={() => setHlColor(c.name)}
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
                    ) : (
                      <div className="writing-config-row">
                        <span className="writing-config-label">2. Included Neon Shades</span>
                        <div className="writing-ink-chips-row">
                          {HIGHLIGHTER_COLORS.map((c) => (
                            <span
                              key={c.name}
                              className="writing-ink-chip-btn"
                              style={{ cursor: "default" }}
                            >
                              <span
                                className="writing-ink-chip-dot"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span>{c.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
                  ADD TO LOADOUT • ₹{grandTotal}
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

        {/* TOAST POPUP (SMOOTH TRANSITION) */}
        <div
          className={`writing-toast ${toast.show ? "visible" : ""}`}
          aria-live="polite"
        >
          {toast.message}
        </div>
      </div>
    </>
  );
}

export default Correction;

