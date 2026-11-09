import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&display=swap');

  :root {
    --frost-blue: #EAD4BC;
    --frost-blue-light: #F7EBDC;
    --electric-cyan: #C89F72;
    --electric-cyan-hover: #D6B085;
    --void-black: #0D0D0D;
    --midnight-slate: #181513;
    --parchment: #FAF5EE;
    --slate-box: #C2A482;
    --slate-btn: #8A7059;
    --slate-btn-hover: #735A45;
    --grave-grey: #968D84;
    --pure-white: #FFFFFF;
    --accent: #C89F72;
    --accent-glow: rgba(200, 159, 114, 0.4);
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
    background: rgba(26, 23, 21, 0.88);
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
    color: var(--frost-blue);
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

  /* TOAST (BOTTOM-RIGHT COMPACT CARD) */
  .writing-toast {
    position: fixed;
    bottom: 32px;
    right: 32px;
    left: auto;
    background: var(--electric-cyan);
    color: var(--void-black);
    border: 3.5px solid var(--void-black);
    border-radius: 14px;
    padding: 16px 22px;
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    letter-spacing: 0.3px;
    box-shadow: 5px 5px 0px var(--void-black);
    z-index: 1000;
    width: auto;
    max-width: 330px;
    min-height: 64px;
    display: flex;
    align-items: center;
    line-height: 1.45;
    opacity: 0;
    transform: translateY(20px) scale(0.95);
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

const CATALOG_ITEMS = [
  // 1. STAPLING & FASTENERS
  {
    id: "stapler-kangaro-ds45l",
    category: "staplers",
    modelName: "Kangaro DS-45L Heavy Stapler",
    subtitle: "All-Steel Body • 30-Sheet Capacity • Quick Loading",
    title: "KANGARO DS-45L // DESK STAPLER",
    protocol: "FASTENER PROTOCOL // KD-01",
    basePrice: 120,
    lore1: "Heavy-duty full-strip steel mechanism engineered for high-volume lab record bundling and thesis binding, with rotating anvil for permanent or temporary pinning.",
    lore2: "Rotating precision anvil toggles between permanent clinch and temporary tacking.",
  },
  {
    id: "stapler-kangaro-no10",
    category: "staplers",
    modelName: "Kangaro No. 10 Pocket Stapler",
    subtitle: "Compact Ergonomic Frame • Integrated Staple Remover",
    title: "KANGARO NO. 10 // POCKET STAPLER",
    protocol: "FASTENER PROTOCOL // KN-02",
    basePrice: 45,
    lore1: "Pocket-sized everyday student stapler featuring a built-in tail remover, anti-jam guide channel, and reload indicator window for 10 to 15 sheet assignments.",
    lore2: "Built-in steel tail remover allows instant correction of misaligned pages.",
  },
  {
    id: "stapler-kangaro-24-6-pins",
    category: "staplers",
    modelName: "Kangaro 24/6 Staple Pins (1000s)",
    subtitle: "Chisel-Point High Carbon Steel • Rust-Resistant",
    title: "KANGARO 24/6 // CHISEL PINS (1000PK)",
    protocol: "FASTENER PROTOCOL // KP-03",
    basePrice: 25,
    lore1: "Precision-drawn galvanized high-tensile carbon steel pins with razor-sharp chisel points that pierce thick bond sheets cleanly without paper crumpling.",
    lore2: "Chisel point tips drive cleanly through multi-ply cardstock without jamming.",
  },
  {
    id: "stapler-kangaro-no10-pins",
    category: "staplers",
    modelName: "Kangaro No. 10 Staple Pins Pack",
    subtitle: "Zinc-Coated Anti-Jam Wire • 1000 Staples / Box",
    title: "KANGARO NO. 10 // MICRO PINS",
    protocol: "FASTENER PROTOCOL // KM-04",
    basePrice: 18,
    lore1: "Uniformly glued micro staple strips engineered to eliminate dry-fire misfeeds in compact pocket staplers, ideal for daily homework and exam answer booklets.",
    lore2: "Low-friction zinc coating minimizes chamber resistance in student staplers.",
  },
  {
    id: "stapler-kangaro-sr100",
    category: "staplers",
    modelName: "Kangaro SR-100 Staple Remover",
    subtitle: "Chrome Steel Jaws • Contoured Finger Grip Plates",
    title: "KANGARO SR-100 // PIN EXTRACTOR",
    protocol: "FASTENER PROTOCOL // KS-05",
    basePrice: 35,
    lore1: "Spring-loaded scissor-jaw staple extractor with polished chrome steel teeth that lift clinched pins effortlessly without tearing delicate manuscript pages.",
    lore2: "Hardened chrome pinch jaws extract buried pins without paper perforation.",
  },
  {
    id: "stapler-oddy-heavy-plier",
    category: "staplers",
    modelName: "Oddy 100-Sheet Plier Stapler",
    subtitle: "Industrial Lever Plier • Heavy Document Binding",
    title: "ODDY INDUSTRIAL // 100-SHEET PLIER",
    protocol: "FASTENER PROTOCOL // OP-06",
    basePrice: 340,
    lore1: "Commercial-grade lever-assisted plier stapler capable of piercing up to 100 ream pages simultaneously, indispensable for project dossiers and architecture portfolios.",
    lore2: "Compound mechanical leverage reduces hand fatigue on heavy bookbinds.",
  },

  // 2. ADHESIVES & TAPES
  {
    id: "adh-fevistik-15g",
    category: "adhesives",
    modelName: "Fevistik Super Glue Stick (15g)",
    subtitle: "Non-Toxic PVA Formula • Clean Rotary Dispenser",
    title: "FEVISTIK // CLEAN ROTARY GLUE STICK",
    protocol: "ADHESIVE PROTOCOL // FS-01",
    basePrice: 25,
    lore1: "Smooth-gliding solid adhesive stick offering instant paper tack without wrinkling, bubbling, or staining. Safe, acid-free, and washes out with warm water.",
    lore2: "Zero-wrinkle rotary paste provides clean bonding on envelopes and chart paper.",
  },
  {
    id: "adh-fevicol-mr-100g",
    category: "adhesives",
    modelName: "Fevicol MR Squeezy Bottle (100g)",
    subtitle: "Synthetic Resin Adhesive • Precision Applicator Tip",
    title: "FEVICOL MR // HIGH-TACK RESIN",
    protocol: "ADHESIVE PROTOCOL // FM-02",
    basePrice: 35,
    lore1: "The gold standard of craft bonding: white synthetic resin with high tensile grab, drying clear for cardboard modeling, project mounts, and woodwork mockups.",
    lore2: "Dries to a transparent, flexible bond with high structural shear strength.",
  },
  {
    id: "adh-wonder-brown-tape",
    category: "adhesives",
    modelName: "Wonder 555 Brown Packaging Tape",
    subtitle: "2-Inch Width • Heavy-Duty Kraft Carton Sealing",
    title: "WONDER 555 // 2-INCH KRAFT TAPE",
    protocol: "ADHESIVE PROTOCOL // WT-03",
    basePrice: 50,
    lore1: "Commercial-gauge 50-micron high-tack BOPP pressure-sensitive adhesive tape engineered for courier parcels, heavy book parcels, and project storage boxes.",
    lore2: "Aggressive hot-melt adhesive provides tamper-evident grip on corrugated cartons.",
  },
  {
    id: "adh-scotch-magic-tape",
    category: "adhesives",
    modelName: "Scotch Magic Tape (1-Inch Roll)",
    subtitle: "Invisible Matte Finish • Write-On Surface Dispenser",
    title: "SCOTCH MAGIC // MATTE ARCHIVAL TAPE",
    protocol: "ADHESIVE PROTOCOL // SM-04",
    basePrice: 65,
    lore1: "Disappears entirely on photocopies and document scans; matte surface accepts pen, pencil, and marker annotations without ink bleeding or flaking.",
    lore2: "Matte acetate film vanishes under office copiers and UV flatbed scanners.",
  },
  {
    id: "adh-abro-foam-tape",
    category: "adhesives",
    modelName: "Abro Double-Sided Foam Tape",
    subtitle: "High-Density Sponge Core • Permanent Structural Mount",
    title: "ABRO DUAL // STRUCTURAL FOAM TAPE",
    protocol: "ADHESIVE PROTOCOL // AF-05",
    basePrice: 40,
    lore1: "Cushioned double-sided polyethylene foam tape delivering high bond strength across uneven surfaces, posters, presentation boards, and exhibition wall charts.",
    lore2: "Cushioned EVA foam core conforms seamlessly to irregular plaster walls.",
  },
  {
    id: "adh-fevikwik-gel-3g",
    category: "adhesives",
    modelName: "Fevi Kwik Instant Gel Tube (3g)",
    subtitle: "One-Drop Cyanoacrylate • No-Drip Precision Gel",
    title: "FEVI KWIK // RAPID INSTANT GEL",
    protocol: "ADHESIVE PROTOCOL // FK-06",
    basePrice: 20,
    lore1: "Instant-setting cyanoacrylate gel formulation that bonds plastic, metal, rubber, and ceramics in 10 seconds without running or spilling across project parts.",
    lore2: "Thixotropic gel stays put on vertical surfaces for fast emergency repairs.",
  },

  // 3. DESK & FILING UTILITY
  {
    id: "org-solo-display-book",
    category: "organization",
    modelName: "Solo A4 Display Book (20 Pockets)",
    subtitle: "Anti-Glare Clear Poly Sleeves • Ultrasonic Welded",
    title: "SOLO A4 // 20-POCKET DISPLAY BOOK",
    protocol: "FILING PROTOCOL // SD-01",
    basePrice: 95,
    lore1: "Durable matte polypropylene presentation folder containing 20 high-clarity non-stick plastic sleeves that protect certificates, resumes, and project designs.",
    lore2: "Anti-static sleeves prevent toner photocopy transfer onto transparent pockets.",
  },
  {
    id: "org-solo-cobra-file",
    category: "organization",
    modelName: "Solo Cobra Clip Spring File",
    subtitle: "Spring Steel Lever Clamp • Heavy Polypropylene Spine",
    title: "SOLO COBRA // LEVER SPRING FILE",
    protocol: "FILING PROTOCOL // SC-02",
    basePrice: 65,
    lore1: "Fast-action spring steel cobra mechanism that locks up to 150 punched or unpunched sheets securely with a single thumb press, equipped with label insert spine.",
    lore2: "Heavy-duty tempered spring clamp locks documents without punch hole wear.",
  },
  {
    id: "org-oddy-binder-19mm",
    category: "organization",
    modelName: "Oddy Binder Clips 19mm (Box of 12)",
    subtitle: "Tempered Steel Jaws • Fold-Back Chrome Wire Arms",
    title: "ODDY 19MM // TEMPERED BINDER CLIPS",
    protocol: "FILING PROTOCOL // OB-03",
    basePrice: 40,
    lore1: "Classic black tempered steel clamps providing powerful spring grip for holding 50 to 80 assignment pages together without perforating or stapling paper.",
    lore2: "Detachable chrome handles fold flat for compact filing in desk drawers.",
  },
  {
    id: "org-oddy-binder-41mm",
    category: "organization",
    modelName: "Oddy Heavy Binder Clips 41mm (12Pk)",
    subtitle: "Industrial 200-Sheet Grip • High-Tension Steel",
    title: "ODDY 41MM // JUMBO BINDER CLAMPS",
    protocol: "FILING PROTOCOL // OJ-04",
    basePrice: 75,
    lore1: "Heavy-duty 41mm binder clamps built to bundle 150 to 200 sheets of lab work, architectural blueprints, or thick stacks of exam papers without slip.",
    lore2: "Reinforced high-gauge spring steel clamps massive document reams securely.",
  },
  {
    id: "org-kangaro-punch-dp52",
    category: "organization",
    modelName: "Kangaro 2-Hole Paper Punch DP-52",
    subtitle: "All-Metal Mechanism • 20-Sheet Punching Gauge",
    title: "KANGARO DP-52 // 2-HOLE DESK PUNCH",
    protocol: "FILING PROTOCOL // KP-05",
    basePrice: 110,
    lore1: "Rugged metal desktop 2-hole punch with calibrated adjustable centering guide, waste confetti tray, and hardened steel cutters that punch 20 sheets per stroke.",
    lore2: "Calibrated sliding paper guide guarantees centered 80mm hole spacing every time.",
  },
  {
    id: "org-kraft-roll-cover",
    category: "organization",
    modelName: "Brown Roll Book Cover Sheet (5-Meter)",
    subtitle: "Virgin Kraft Paper Roll • Tear-Resistant Book Wrap",
    title: "KRAFT ROLL // 5M BOOK COVERING",
    protocol: "FILING PROTOCOL // KR-06",
    basePrice: 45,
    lore1: "Heavy 90 GSM virgin kraft brown paper roll providing uniform protection for school and college notebooks, lab registers, and workshop project files.",
    lore2: "High-density kraft fibers resist corner scuffs and backpack friction wear.",
  },
];

export default function Office() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [category, setCategory] = useState("staplers");
  const [activeId, setActiveId] = useState("stapler-kangaro-ds45l");
  const [qty, setQty] = useState(1);

  // Configuration options for Stapling & Fasteners
  const [stapleGrade, setStapleGrade] = useState("Standard Carbon");
  const [staplePack, setStaplePack] = useState("Single Unit");

  // Configuration options for Adhesives & Tapes
  const [adhTack, setAdhTack] = useState("Standard Tack");
  const [adhDispenser, setAdhDispenser] = useState("Standard Studio");

  // Configuration options for Desk & Filing Utility
  const [orgGauge, setOrgGauge] = useState("Polypropylene 0.5mm");
  const [orgCapacity, setOrgCapacity] = useState("Standard 50 Pgs");

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

  if (category === "staplers") {
    let gradeAdd = 0;
    if (stapleGrade === "Chisel Anti-Jam") gradeAdd = 15;
    else if (stapleGrade === "Heavy Industrial") gradeAdd = 45;

    let packAdd = 0;
    if (staplePack === "Value Trio (3x)") packAdd = 50;
    else if (staplePack === "Workshop Crate (10x)") packAdd = 180;

    unitPrice = currentCatalog.basePrice + gradeAdd + packAdd;
    productName = `${currentCatalog.modelName} (${stapleGrade}, ${staplePack})`;
  } else if (category === "adhesives") {
    let tackAdd = 0;
    if (adhTack === "High-Tack Bond") tackAdd = 15;
    else if (adhTack === "Archival Acid-Free") tackAdd = 30;

    let packAdd = 0;
    if (adhDispenser === "Compact Pocket") packAdd = -5;
    else if (adhDispenser === "Jumbo Studio (2x)") packAdd = 25;

    unitPrice = Math.max(15, currentCatalog.basePrice + tackAdd + packAdd);
    productName = `${currentCatalog.modelName} (${adhTack}, ${adhDispenser})`;
  } else if (category === "organization") {
    let gaugeAdd = 0;
    if (orgGauge === "Reinforced 0.8mm") gaugeAdd = 25;
    else if (orgGauge === "Archival Heavy Gauge") gaugeAdd = 55;

    let capAdd = 0;
    if (orgCapacity === "Expanded 150 Pgs") capAdd = 20;
    else if (orgCapacity === "Archive 300 Pgs") capAdd = 45;

    unitPrice = currentCatalog.basePrice + gaugeAdd + capAdd;
    productName = `${currentCatalog.modelName} (${orgGauge}, ${orgCapacity})`;
  }

  const handleAdd = () => {
    if (!productName) return showToast("Select office utility spec first");
    addToCart({ name: productName, price: unitPrice, quantity: qty });
    showToast(`Added ${qty}x ${productName} to Cart`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="writing-page-shell">
        {/* RETRO-COMIC ROOFTOP SKYLINE VECTOR PANORAMA BACKDROP */}
        <div className="writing-bg-layer" aria-hidden="true">
          <img
            src="/office-landscape.svg?v=1"
            alt="Comic-Style Rooftop Skyline at Dusk Panorama"
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
            <h1 className="writing-game-main-hero">OFFICE &amp; UTILITY</h1>
            <div className="writing-center-category-tabs" aria-label="Office Categories">
              <button
                type="button"
                className={`writing-game-tab ${category === "staplers" ? "active" : ""}`}
                onClick={() => handleCategoryChange("staplers")}
              >
                STAPLING &amp; FASTENERS
              </button>
              <button
                type="button"
                className={`writing-game-tab ${category === "adhesives" ? "active" : ""}`}
                onClick={() => handleCategoryChange("adhesives")}
              >
                ADHESIVES &amp; TAPES
              </button>
              <button
                type="button"
                className={`writing-game-tab ${category === "organization" ? "active" : ""}`}
                onClick={() => handleCategoryChange("organization")}
              >
                DESK &amp; FILING
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
                {category === "staplers" && (
                  <>
                    <div className="writing-config-row">
                      <span className="writing-config-label">1. Fastener Spec:</span>
                      <div className="writing-pill-group">
                        {["Standard Carbon", "Chisel Anti-Jam", "Heavy Industrial"].map((g) => (
                          <button
                            key={g}
                            type="button"
                            className={`writing-option-pill-btn ${stapleGrade === g ? "active" : ""}`}
                            onClick={() => setStapleGrade(g)}
                          >
                            {g} {g === "Chisel Anti-Jam" ? "+₹15" : g === "Heavy Industrial" ? "+₹45" : ""}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="writing-config-row">
                      <span className="writing-config-label">2. Pack Format:</span>
                      <div className="writing-pill-group">
                        {["Single Unit", "Value Trio (3x)", "Workshop Crate (10x)"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            className={`writing-option-pill-btn ${staplePack === p ? "active" : ""}`}
                            onClick={() => setStaplePack(p)}
                          >
                            {p} {p === "Value Trio (3x)" ? "+₹50" : p === "Workshop Crate (10x)" ? "+₹180" : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {category === "adhesives" && (
                  <>
                    <div className="writing-config-row">
                      <span className="writing-config-label">1. Tack Formula:</span>
                      <div className="writing-pill-group">
                        {["Standard Tack", "High-Tack Bond", "Archival Acid-Free"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`writing-option-pill-btn ${adhTack === t ? "active" : ""}`}
                            onClick={() => setAdhTack(t)}
                          >
                            {t} {t === "High-Tack Bond" ? "+₹15" : t === "Archival Acid-Free" ? "+₹30" : ""}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="writing-config-row">
                      <span className="writing-config-label">2. Dispenser Pack:</span>
                      <div className="writing-pill-group">
                        {["Compact Pocket", "Standard Studio", "Jumbo Studio (2x)"].map((disp) => (
                          <button
                            key={disp}
                            type="button"
                            className={`writing-option-pill-btn ${adhDispenser === disp ? "active" : ""}`}
                            onClick={() => setAdhDispenser(disp)}
                          >
                            {disp} {disp === "Compact Pocket" ? "-₹5" : disp === "Jumbo Studio (2x)" ? "+₹25" : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {category === "organization" && (
                  <>
                    <div className="writing-config-row">
                      <span className="writing-config-label">1. Gauge Spec:</span>
                      <div className="writing-pill-group">
                        {["Polypropylene 0.5mm", "Reinforced 0.8mm", "Archival Heavy Gauge"].map((gauge) => (
                          <button
                            key={gauge}
                            type="button"
                            className={`writing-option-pill-btn ${orgGauge === gauge ? "active" : ""}`}
                            onClick={() => setOrgGauge(gauge)}
                          >
                            {gauge} {gauge === "Reinforced 0.8mm" ? "+₹25" : gauge === "Archival Heavy Gauge" ? "+₹55" : ""}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="writing-config-row">
                      <span className="writing-config-label">2. Capacity Tier:</span>
                      <div className="writing-pill-group">
                        {["Standard 50 Pgs", "Expanded 150 Pgs", "Archive 300 Pgs"].map((cap) => (
                          <button
                            key={cap}
                            type="button"
                            className={`writing-option-pill-btn ${orgCapacity === cap ? "active" : ""}`}
                            onClick={() => setOrgCapacity(cap)}
                          >
                            {cap} {cap === "Expanded 150 Pgs" ? "+₹20" : cap === "Archive 300 Pgs" ? "+₹45" : ""}
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
                  <span>ADD TO DISPATCH BATCH</span>
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

