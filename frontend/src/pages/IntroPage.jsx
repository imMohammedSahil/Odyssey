import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ElasticMesh from "../components/ElasticMesh";
import BlobCursor from "../components/BlobCursor";
import ScrollFloat from "../components/ScrollFloat";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Titan+One&display=swap');

  :root {
    --bg-green: #9DE869;
    --text-black: #0A0A0A;
    --text-sub: #1A2215;
    --brain-pink: #FF70A6;
    --pill-dark: rgba(10, 10, 10, 0.92);
    --border-line: rgba(10, 10, 10, 0.14);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  /* 🟢 MINIMAL SLIME GREEN CANVAS */
  .od-min-root {
    background-color: var(--bg-green);
    color: var(--text-black);
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    cursor: default;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media (pointer: fine) {
    .od-min-root,
    .od-min-root * {
      cursor: none !important;
    }
  }

  /* ──────────────────────────────────────────────────────────
     TOP RIGHT "ENTER BASECAMP" PILL
  ────────────────────────────────────────────────────────── */
  .od-top-right-wrap {
    position: fixed;
    top: 28px;
    right: 32px;
    z-index: 100;
  }

  .od-top-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--pill-dark);
    color: #FFFFFF;
    border: 1px solid rgba(255, 255, 255, 0.14);
    padding: 10px 22px;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
    transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .od-top-btn:hover {
    background: #000000;
    color: #FFFFFF;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
  }

  /* ──────────────────────────────────────────────────────────
     1. HERO SECTION: FULL SCREEN
  ────────────────────────────────────────────────────────── */
  .od-hero-screen {
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 24px;
    position: relative;
    user-select: none;
  }

  .od-mesh-wrap {
    width: 100%;
    max-width: 950px;
    height: clamp(200px, 30vw, 310px);
    position: relative;
    margin: 0 auto;
    cursor: grab;
    touch-action: none;
  }

  .od-mesh-wrap:active {
    cursor: grabbing;
  }

  .od-subtitle {
    font-size: 17px;
    font-weight: 600;
    color: #171E12;
    letter-spacing: 0.04em;
    margin-top: -32px;
    position: relative;
    z-index: 10;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .od-cursor {
    display: inline-block;
    width: 8px;
    height: 16px;
    background: var(--text-black);
    animation: blinkCursor 1.1s infinite;
  }

  @keyframes blinkCursor {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* ──────────────────────────────────────────────────────────
     FALLING COMET SCROLL INDICATOR
  ────────────────────────────────────────────────────────── */
  .od-scroll-down-indicator {
    position: absolute;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 8px;
    transition: opacity 0.2s ease;
  }

  .od-scroll-down-indicator:hover {
    opacity: 0.75;
  }

  .od-scroll-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--text-black);
  }

  .od-scroll-comet-track {
    width: 14px;
    height: 52px;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }

  .od-scroll-guide-line {
    display: none;
  }

  .od-scroll-comet-stream {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -42px);
    animation: cometFall 3.4s cubic-bezier(0.45, 0.05, 0.25, 1) infinite;
    will-change: transform, opacity;
  }

  @keyframes cometFall {
    0% {
      transform: translate(-50%, -42px);
      opacity: 0;
    }
    22% {
      opacity: 1;
    }
    72% {
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 54px);
      opacity: 0;
    }
  }

  /* ──────────────────────────────────────────────────────────
     2. EDITORIAL MANIFESTO SECTION (Screenshot 2 Match)
  ────────────────────────────────────────────────────────── */
  .od-manifesto-section {
    max-width: 1140px;
    margin: 180px auto 140px;
    padding: 60px 32px 0;
  }

  .od-manifesto-text {
    font-size: clamp(32px, 5.2vw, 68px);
    font-weight: 700;
    line-height: 1.14;
    letter-spacing: -0.03em;
    color: var(--text-black);
  }

  .od-manifesto-text em {
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    letter-spacing: normal;
    color: var(--text-black);
  }

  /* ──────────────────────────────────────────────────────────
     3. MINIMALIST AISLE DIRECTORY
  ────────────────────────────────────────────────────────── */
  .od-directory-section {
    max-width: 1140px;
    margin: 0 auto 160px;
    padding: 0 32px;
  }

  .od-dir-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1.5px solid var(--border-line);
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .od-dir-title {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-sub);
  }

  .od-dir-item-wrap {
    border-bottom: 1.5px solid var(--border-line);
    transition: border-color 0.2s ease;
  }

  .od-dir-item-wrap:hover {
    border-color: var(--text-black);
  }

  .od-dir-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 0;
    cursor: pointer;
    text-decoration: none;
    transition: padding-left 0.2s ease;
  }

  .od-dir-row:hover {
    padding-left: 12px;
  }

  .od-dir-left {
    display: flex;
    align-items: baseline;
    gap: 28px;
  }

  .od-dir-num {
    font-size: 14px;
    font-weight: 600;
    color: rgba(10, 10, 10, 0.5);
  }

  .od-dir-name {
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-black);
    transition: color 0.15s ease;
  }

  .od-dir-row:hover .od-dir-name,
  .od-dir-item-wrap.is-expanded .od-dir-name {
    color: var(--brain-pink);
  }

  .od-dir-desc {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-sub);
  }

  .od-dir-arrow {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-black);
    transition: transform 0.25s ease, color 0.2s ease;
  }

  .od-dir-row:hover .od-dir-arrow {
    color: var(--brain-pink);
    transform: translate(4px, -4px);
  }

  .od-dir-item-wrap.is-expanded .od-dir-arrow {
    color: var(--brain-pink);
    transform: rotate(90deg);
  }

  /* EXPANDABLE DRAWER & DOSSIER CARD */
  .od-dir-drawer {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    opacity: 0;
    overflow: hidden;
  }

  .od-dir-drawer.is-open {
    grid-template-rows: 1fr;
    opacity: 1;
  }

  .od-dir-drawer-inner {
    min-height: 0;
  }

  .od-dir-card {
    background: #0A0A0A;
    color: #F5F5F5;
    border-radius: 18px;
    padding: 30px 34px;
    margin: 4px 0 28px 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(157, 232, 105, 0.1);
  }

  .od-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 14px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .od-card-badge-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .od-card-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #9DE869;
    box-shadow: 0 0 10px #9DE869;
    animation: odPulse 1.8s infinite;
  }

  @keyframes odPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }

  .od-card-category {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: #9DE869;
    text-transform: uppercase;
  }

  .od-card-telemetry {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.08em;
  }

  .od-card-close-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #FFFFFF;
    padding: 6px 14px;
    border-radius: 999px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
  }

  .od-card-close-btn:hover {
    background: #FF70A6;
    border-color: #FF70A6;
    color: #0A0A0A;
    transform: scale(1.04);
  }

  .od-card-overview {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.88);
    margin-bottom: 22px;
    max-width: 920px;
  }

  .od-card-specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }

  .od-spec-box {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .od-spec-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.45);
    text-transform: uppercase;
  }

  .od-spec-val {
    font-size: 13.5px;
    font-weight: 700;
    color: #9DE869;
  }

  .od-card-features {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }

  .od-feat-tag {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    padding: 5px 14px;
  }

  .od-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 18px;
  }

  .od-card-hint {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
  }

  .od-card-btn-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .od-card-secondary-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    font-weight: 700;
    padding: 9px 18px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .od-card-secondary-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #FFFFFF;
    border-color: rgba(255, 255, 255, 0.35);
  }

  .od-card-action-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #9DE869;
    border: none;
    color: #0A0A0A;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.04em;
    padding: 9px 20px;
    border-radius: 999px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .od-card-action-btn:hover {
    background: #FF70A6;
    color: #0A0A0A;
    transform: translateY(-2px);
  }

  @media (max-width: 680px) {
    .od-dir-card {
      padding: 22px 18px;
    }
    .od-card-specs-grid {
      grid-template-columns: 1fr;
    }
    .od-card-footer {
      flex-direction: column;
      align-items: flex-start;
    }
    .od-card-btn-group {
      width: 100%;
      justify-content: space-between;
    }
    .od-dir-left {
      gap: 16px;
    }
    .od-dir-pill-status {
      display: none;
    }
  }

  /* ──────────────────────────────────────────────────────────
     4. STATEMENT CTA & FOOTER
  ────────────────────────────────────────────────────────── */
  .od-cta-section {
    max-width: 1140px;
    margin: 0 auto 130px;
    padding: 0 32px;
    text-align: center;
  }

  .od-cta-btn {
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
    font-size: clamp(48px, 8vw, 96px);
    color: var(--text-black);
    background: transparent;
    border: none;
    cursor: pointer;
    line-height: 1;
    letter-spacing: -0.02em;
    transition: color 0.2s ease, transform 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 16px;
  }

  .od-cta-btn:hover {
    color: var(--brain-pink);
    transform: translateX(8px);
  }

  .od-footer {
    border-top: 1.5px solid var(--border-line);
    padding: 40px 32px;
  }

  .od-footer-inner {
    max-width: 1140px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-sub);
  }

  @media (max-width: 680px) {
    .od-top-right-wrap {
      top: 20px;
      right: 20px;
    }
    .od-top-btn {
      font-size: 12px;
      padding: 8px 16px;
    }
  }
`;

export default function IntroPage() {
  const navigate = useNavigate();
  const [expandedAisles, setExpandedAisles] = useState({});

  const toggleAisle = (num) => {
    setExpandedAisles((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  const closeAisle = (num) => {
    setExpandedAisles((prev) => ({
      ...prev,
      [num]: false,
    }));
  };

  const handleNavigate = (path = "/student") => {
    sessionStorage.setItem("role", "student");
    if (!sessionStorage.getItem("user")) {
      sessionStorage.setItem("user", "PETER PARKER");
    }
    navigate(path);
  };

  const scrollToNext = () => {
    const el = document.getElementById("manifesto-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const directory = [
    {
      num: "01",
      name: "Report & Thesis Print Lab",
      desc: "1200 DPI Duplex · Wire-O Spiral · Frosted Covers",
      category: "HIGH-DENSITY HARDWARE // AISLE 01",
      telemetry: "DESK 04 DUPLEX ENGINE · ONLINE",
      overview:
        "Calibrated specifically for university thesis defenses and engineering blueprint submissions. High-density duplex laser rendering guarantees razor-sharp mathematical formulae, circuit schematics, and rich black text without show-through.",
      specs: [
        { label: "RESOLUTION", value: "1200 × 1200 DPI Laser" },
        { label: "BINDING RIG", value: "Wire-O Metal / Thermal Spine" },
        { label: "QUEUE TIME", value: "3–5 Min Avg / 100 Pgs" },
      ],
      features: [
        "Single & Duplex Monochrome/Color",
        "80–100 GSM Acid-Free Archival Bond",
        "Translucent Frosted Shield Covers",
        "Edge-to-Edge Vector Output",
      ],
      actionLabel: "Enter Print Lab",
      route: "/printing",
    },
    {
      num: "02",
      name: "Writing Weaponry",
      desc: "Archival 0.5mm Gel · Drafting Pencils · Highlighters",
      category: "TACTILE INSTRUMENTS // AISLE 02",
      telemetry: "DISPENSER MATRIX · IN STOCK",
      overview:
        "Selected for marathon exam halls and uninterrupted drafting sessions. Featuring micro-precision needle tips with low-viscosity Japanese gel ink formulations that dry in under 1.2 seconds to eliminate sleeve smudge.",
      specs: [
        { label: "MICRO TIPS", value: "0.38mm & 0.5mm Archival" },
        { label: "INK SYSTEM", value: "Waterproof / Non-Fading" },
        { label: "DRAFTING LEADS", value: "HB & 2B Polymer-Infused" },
      ],
      features: [
        "Knurled Ergonomic Metal Grips",
        "Zero-Bleed Chisel Highlighters",
        "Balanced Low-Center Pencils",
        "Micro-Point Correction Mediums",
      ],
      actionLabel: "Enter Writing Aisle",
      route: "/writing",
    },
    {
      num: "03",
      name: "Parchment & Paper Reams",
      desc: "75 & 80 GSM High-Brightness A4 · Sticky Memos",
      category: "FIBER & MEDIA // AISLE 03",
      telemetry: "RAW STOCK REPOSITORY · CALIBRATED",
      overview:
        "Engineered elemental chlorine-free bond paper. Offers superior opacity for dense double-sided printing, blueprint sketching, and lab documentation with zero ink feathering.",
      specs: [
        { label: "BASIS WEIGHT", value: "75 GSM & 80 GSM Bond" },
        { label: "WHITENESS", value: "98% ISO High-Reflectance" },
        { label: "DIMENSIONS", value: "Standard A4 & A3 Formats" },
      ],
      features: [
        "500-Sheet Moisture-Sealed Reams",
        "Ultra-Smooth Matte Calendering",
        "Repositionable Pastel Tab Flags",
        "Archival Acid-Free Longevity",
      ],
      actionLabel: "Enter Paper Aisle",
      route: "/paper",
    },
    {
      num: "04",
      name: "Measuring & Drafting",
      desc: "Steel Non-Slip Rulers · Geometry Kits · Cutting Mats",
      category: "METROLOGY & RIGS // AISLE 04",
      telemetry: "PRECISION CALIPER · ±0.1MM TOLERANCE",
      overview:
        "Heavyweight laser-etched stainless steel measuring rules, 5-ply self-healing cutting mats, and precision brass geometry sets built for architects, engineers, and physical model fabricators.",
      specs: [
        { label: "ACCURACY", value: "±0.1mm Laser Engraved" },
        { label: "CUTTING PAD", value: "5-Ply Self-Healing Polymer" },
        { label: "COMPASS RIG", value: "Heavy Solid Brass Core" },
      ],
      features: [
        "30cm & 60cm Non-Slip Backed Rulers",
        "Precision Set Squares & Protractors",
        "Heavy-Duty A3 & A4 Cutting Mats",
        "Dual-Metric / Imperial Scale Grids",
      ],
      actionLabel: "Enter Drafting Aisle",
      route: "/measuring",
    },
    {
      num: "05",
      name: "Raven Offering Altar",
      desc: "Contactless Mobile QR · Automated Receipt Sync",
      category: "TRANSACTION CRYPT // AISLE 05",
      telemetry: "INSTANT SETTLEMENT · SYNCHRONIZED",
      overview:
        "The sacred checkout altar for campus dues redemption. Instant dynamic UPI QR reconciliation with automated ledger dispatch. Clears submission locks and prints your encrypted cryptographic checkout token.",
      specs: [
        { label: "CLEARANCE", value: "< 1.8s Instant Reconcile" },
        { label: "PROTOCOL", value: "Dynamic QR + Campus ID" },
        { label: "LEDGER SYNC", value: "Automated Campus Sync" },
      ],
      features: [
        "Contactless Mobile QR Payment",
        "Instant Dues & Thesis Clearance",
        "Zero-Fee Campus Student Rate",
        "Direct Barcode Folio Generation",
      ],
      actionLabel: "Visit Raven Altar",
      route: "/ritual-offering",
    },
    {
      num: "06",
      name: "Archival Folio Receipts",
      desc: "Code 128 Barcode Verification · Express Desk 04 Pickup",
      category: "DISPATCH LOGISTICS // AISLE 06",
      telemetry: "DISPATCH QUEUE · CODE 128 ACTIVE",
      overview:
        "Your cryptographic footprint at Desk 04. Scan or verify your Code 128 barcode slip to collect finished spiral thesis copies, review transaction history, and check real-time machine queue status.",
      specs: [
        { label: "VERIFICATION", value: "Code 128 Optical Barcode" },
        { label: "COLLECTION", value: "Express Desk 04 Counter" },
        { label: "DISPATCH TRACK", value: "Real-Time Print Telemetry" },
      ],
      features: [
        "Physical Thermal Receipt Format",
        "Instant Cloud Folio Backup",
        "Live Queue ETA Indicators",
        "One-Touch Re-Print Dispatch",
      ],
      actionLabel: "Open Folio Counter",
      route: "/student",
    },
  ];

  return (
    <>
      <style>{styles}</style>

      <div className="od-min-root">
        {/* ── LIQUID METAL BLOB CURSOR ── */}
        <BlobCursor
          material="chrome"
          color="#FF70A6"
          blend="normal"
          size={42}
          morph={0}
          morphSpeed={0.4}
          depth={1}
          trail={12}
          lag={0.35}
          goo={1}
          stretch={0.4}
          wobble={0.8}
          drip={0}
          shine={1}
          splash={true}
          splashCount={6}
          splashSpeed={0.5}
          splashSize={0.5}
          splashGravity={0}
          regrow={0.5}
          shadow={false}
          hideCursor={true}
        />

        {/* ── TOP RIGHT ENTER BASECAMP PILL ── */}
        <div className="od-top-right-wrap">
          <button className="od-top-btn" onClick={() => handleNavigate("/student")}>
            ENTER BASECAMP →
          </button>
        </div>

        {/* ── 1. HERO SCREEN WITH 3D ELASTIC MESH ── */}
        <section className="od-hero-screen">
          <div className="od-mesh-wrap">
            <ElasticMesh
              text="Odyssey"
              fontFamily="'Titan One', 'Archivo Black', cursive, sans-serif"
              fontWeight={900}
              color="#FF70A6"
              material="balloon"
              inflate={1.02}
              stiffness={0.46}
              wobble={0.6}
              grabRadius={80}
              stretch={0.6}
              press={0.6}
              shadow={0.5}
              intro={true}
              theme="dark"
            />
          </div>

          <div className="od-subtitle">
            Survive the deadline. <span className="od-cursor" />
          </div>

          {/* Falling Comet Scroll Indicator */}
          <button className="od-scroll-down-indicator" onClick={scrollToNext} aria-label="Scroll down">
            <span className="od-scroll-text">Scroll</span>
            <div className="od-scroll-comet-track">
              <div className="od-scroll-comet-stream">
                <svg
                  width="12"
                  height="40"
                  viewBox="0 0 12 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="cometGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.05" />
                      <stop offset="35%" stopColor="#0A0A0A" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#0A0A0A" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 5.5 0 L 6.5 0 C 6.5 14, 8.2 26, 8.5 33 C 8.7 37, 7.2 40, 6 40 C 4.8 40, 3.3 37, 3.5 33 C 3.8 26, 5.5 14, 5.5 0 Z"
                    fill="url(#cometGrad)"
                  />
                </svg>
              </div>
            </div>
          </button>
        </section>

        {/* ── 2. EDITORIAL MANIFESTO SECTION (Screenshot 2 Match) ── */}
        <section className="od-manifesto-section" id="manifesto-section">
          <ScrollFloat
            containerClassName="od-manifesto-scroll-wrap"
            textClassName="od-manifesto-text"
            effect="float"
            splitBy="lines"
            direction="up"
            order="start"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.16}
            distance={60}
            stretch={1}
            smoothing={0.2}
          >
            I’m Odyssey, a campus survival armory that prints project theses, stocks precision stationery, and settles dues at the raven altar. Deadlines that feel like child’s play. Tools that give you your sleep back. Survive the deadline.
          </ScrollFloat>
        </section>

        {/* ── 3. MINIMALIST AISLE DIRECTORY ── */}
        <section className="od-directory-section">
          <div className="od-dir-header">
            <span className="od-dir-title">Requisition Aisles</span>
          </div>

          <div>
            {directory.map((item) => {
              const isExpanded = !!expandedAisles[item.num];

              return (
                <div
                  key={item.num}
                  className={`od-dir-item-wrap ${isExpanded ? "is-expanded" : ""}`}
                >
                  <div
                    className="od-dir-row"
                    onClick={() => toggleAisle(item.num)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleAisle(item.num);
                      }
                    }}
                  >
                    <div className="od-dir-left">
                      <span className="od-dir-num">{item.num}</span>
                      <div>
                        <h3 className="od-dir-name">{item.name}</h3>
                        <p className="od-dir-desc">{item.desc}</p>
                      </div>
                    </div>

                    <span className={`od-dir-arrow ${isExpanded ? "is-open" : ""}`}>↗</span>
                  </div>

                  {/* Expandable Info Dossier Drawer */}
                  <div
                    className={`od-dir-drawer ${isExpanded ? "is-open" : ""}`}
                    aria-hidden={!isExpanded}
                  >
                    <div className="od-dir-drawer-inner">
                      <div className="od-dir-card">
                        <div className="od-card-top">
                          <div className="od-card-badge-wrap">
                            <span className="od-card-dot" />
                            <span className="od-card-category">{item.category}</span>
                            <span className="od-card-telemetry">· {item.telemetry}</span>
                          </div>
                          <button
                            className="od-card-close-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              closeAisle(item.num);
                            }}
                            aria-label={`Close ${item.name} info`}
                          >
                            <span>CLOSE</span>
                            <span>✕</span>
                          </button>
                        </div>

                        <p className="od-card-overview">{item.overview}</p>

                        <div className="od-card-specs-grid">
                          {item.specs.map((sp, idx) => (
                            <div key={idx} className="od-spec-box">
                              <span className="od-spec-label">{sp.label}</span>
                              <span className="od-spec-val">{sp.value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="od-card-features">
                          {item.features.map((feat, idx) => (
                            <span key={idx} className="od-feat-tag">
                              ✓ {feat}
                            </span>
                          ))}
                        </div>

                        <div className="od-card-footer">
                          <span className="od-card-hint">
                            Click to collapse or leave open while browsing next aisles.
                          </span>
                          <div className="od-card-btn-group">
                            <button
                              className="od-card-secondary-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                closeAisle(item.num);
                              }}
                            >
                              Close
                            </button>
                            <button
                              className="od-card-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate(item.route);
                              }}
                            >
                              {item.actionLabel} →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. STATEMENT CTA & FOOTER ── */}
        <section className="od-cta-section">
          <button className="od-cta-btn" onClick={() => handleNavigate("/student")}>
            Enter Basecamp →
          </button>
        </section>

        <footer className="od-footer">
          <div className="od-footer-inner">
            <div>
              Odyssey · Desk 04 Online · All rights reserved.
            </div>
            <div>
              Campus survival armory
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
