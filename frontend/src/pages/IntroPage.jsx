import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ElasticMesh from "../components/ElasticMesh";
import ScrollFloat from "../components/ScrollFloat";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Titan+One&display=swap');

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
    position: absolute;
    top: 28px;
    right: 32px;
    z-index: 100;
    opacity: 0;
    transform: translateY(-8px);
    pointer-events: none;
    transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: 0.15s;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .od-top-right-wrap.is-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .od-sound-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    background: var(--pill-dark);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.14);
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
    transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    user-select: none;
  }

  .od-sound-btn:hover {
    background: #000000;
    color: #FFFFFF;
    transform: translateY(-2px) scale(1.05);
    border-color: rgba(255, 255, 255, 0.28);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
  }

  .od-sound-btn.is-active {
    color: var(--brain-pink);
    border-color: rgba(255, 112, 166, 0.45);
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

  /* ──────────────────────────────────────────────────────────
     UIVERSE HIDE-AND-SEEK LOADER (THEMED TO ODYSSEY HERO PALETTE)
  ────────────────────────────────────────────────────────── */
  .od-loader-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-green);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    pointer-events: none;
    transition: opacity 0.5s ease-out;
  }

  .od-loader-overlay.loader-fade-out {
    opacity: 0;
  }

  .loader {
    --ANIMATION-DELAY-MULTIPLIER: 70ms;
    padding: 0 16px;
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 4.8rem;
    position: relative;
  }

  .loader span {
    padding: 0 5px;
    margin: 0;
    font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 3.2rem;
    font-weight: 900;
    color: var(--brain-pink);
    -webkit-text-stroke: 1.8px var(--text-black);
    paint-order: stroke fill;
    text-shadow:
      1px 1px 0px var(--text-black),
      2px 2px 0px var(--text-black),
      3px 3px 0px var(--text-black),
      4px 4px 0px var(--text-black),
      5px 5px 0px var(--text-black),
      6px 6px 0px var(--text-black),
      7px 8px 0px rgba(10, 10, 10, 0.35),
      8px 10px 8px rgba(0, 0, 0, 0.3),
      11px 15px 18px rgba(0, 0, 0, 0.2);
    transform: translateY(4.8rem);
    animation: hideAndSeek 1s alternate infinite cubic-bezier(0.86, 0, 0.07, 1);
    display: inline-block;
    line-height: 1;
    user-select: none;
  }

  .loader .l {
    animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 0);
  }
  .loader .o {
    animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 1);
  }
  .loader .a {
    animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 2);
  }
  .loader .d {
    animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 3);
  }
  .loader .ispan {
    animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 4);
  }
  .loader .n {
    animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 5);
  }
  .loader .g {
    animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 6);
  }

  .letter {
    width: fit-content;
    height: 4.8rem;
    display: flex;
    align-items: center;
  }

  .i {
    margin-inline: 4px;
  }

  @keyframes hideAndSeek {
    0% {
      transform: translateY(4.8rem);
    }
    100% {
      transform: translateY(0rem);
    }
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
    opacity: 0;
    transform: translateY(12px);
    pointer-events: none;
    transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: 0.05s;
  }

  .od-subtitle.is-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
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
    transform: translateX(-50%) translateY(12px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 8px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: 0.28s;
  }

  .od-scroll-down-indicator.is-visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
  }

  .od-scroll-down-indicator.is-visible:hover {
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
    border-bottom: 2px dashed rgba(10, 10, 10, 0.3);
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
    border-bottom: 2px dashed rgba(10, 10, 10, 0.22);
    transition: border-color 0.2s ease, border-bottom 0.2s ease;
  }

  .od-dir-item-wrap:hover {
    border-bottom: 2px dashed #0A0A0A;
  }

  .od-dir-item-wrap.is-expanded {
    border-bottom: 2.5px solid #0A0A0A;
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
    font-weight: 700;
    color: rgba(10, 10, 10, 0.5);
    transition: color 0.15s ease, -webkit-text-stroke 0.15s ease;
  }

  .od-dir-row:hover .od-dir-num {
    color: #FF1A8C;
  }

  .od-dir-name {
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-black);
    transition: color 0.15s ease, -webkit-text-stroke 0.15s ease, text-shadow 0.15s ease;
  }

  .od-dir-row:hover .od-dir-name {
    color: #FF1A8C;
    -webkit-text-stroke: 3px #0A0A0A;
    paint-order: stroke fill;
    text-shadow:
      -1.2px -1.2px 0 #0A0A0A,
       1.2px -1.2px 0 #0A0A0A,
      -1.2px  1.2px 0 #0A0A0A,
       1.2px  1.2px 0 #0A0A0A,
      -1.8px  0     0 #0A0A0A,
       1.8px  0     0 #0A0A0A,
       0     -1.8px 0 #0A0A0A,
       0      1.8px 0 #0A0A0A;
  }

  .od-dir-desc {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-sub);
  }

  .od-dir-toggle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid #0A0A0A;
    background: #FFFFFF;
    color: #0A0A0A;
    box-shadow: 3px 3px 0px #0A0A0A;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  }

  .od-dir-toggle svg {
    display: block;
    width: 14px;
    height: 14px;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: center;
  }

  .od-dir-row:hover .od-dir-toggle {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0px #0A0A0A;
    background: #FF1A8C;
    color: #FFFFFF;
  }

  .od-dir-item-wrap.is-expanded .od-dir-toggle {
    background: #FF1A8C;
    color: #FFFFFF;
    box-shadow: 2px 2px 0px #0A0A0A;
  }

  .od-dir-item-wrap.is-expanded .od-dir-toggle svg {
    transform: rotate(45deg);
  }

  /* MINIMALIST EXPANDABLE INFO (MATCHES GREEN BACKGROUND) */
  .od-dir-drawer {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
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

  /* COMIC NEOMORPHISM BOXES */
  .od-comic-box-wrap {
    padding: 6px 0 28px 44px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-width: 860px;
  }

  .od-comic-card {
    background: #FFFFFF;
    color: #0A0A0A;
    border: 2.5px solid #0A0A0A;
    border-radius: 16px;
    padding: 18px 22px;
    box-shadow: 4px 4px 0px #0A0A0A;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.6;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .od-comic-card:hover {
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0px #0A0A0A;
  }

  .od-comic-tag-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .od-comic-chip {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #0A0A0A;
    padding: 6px 14px;
    border: 2px solid #0A0A0A;
    border-radius: 999px;
    box-shadow: 3px 3px 0px #0A0A0A;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #FFFFFF;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .od-comic-chip:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0px #0A0A0A;
  }

  .od-comic-chip.pink {
    background: #FF70A6;
  }

  .od-comic-chip.yellow {
    background: #FFE853;
  }

  .od-comic-chip.white {
    background: #FFFFFF;
  }

  @media (max-width: 680px) {
    .od-comic-box-wrap {
      padding: 4px 0 22px 0;
    }
    .od-dir-left {
      gap: 16px;
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
    font-family: 'Bangers', cursive;
    font-style: normal;
    font-size: clamp(52px, 8.5vw, 108px);
    letter-spacing: 0.05em;
    color: var(--text-black);
    background: transparent;
    border: none;
    cursor: pointer;
    line-height: 1;
    transition: color 0.15s ease, transform 0.15s ease, text-shadow 0.15s ease, -webkit-text-stroke 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 16px;
  }

  .od-cta-btn:hover {
    color: #FF1A8C;
    -webkit-text-stroke: 3.5px #0A0A0A;
    paint-order: stroke fill;
    text-shadow: 4px 4px 0px #0A0A0A;
    transform: translateX(8px) rotate(-1deg);
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
  const [openAisle, setOpenAisle] = useState(null);
  const [loadingState, setLoadingState] = useState("loading"); // "loading" | "revealing" | "ready"
  const [showRest, setShowRest] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Oscillate the hideAndSeek loader, then reveal Odyssey left-to-right
    const minLoadTimer = setTimeout(() => {
      setLoadingState("revealing");
      setTimeout(() => {
        setLoadingState("ready");
        // Smoothly glide in subtitle & CTA after Odyssey finishes letter-by-letter arrival
        setTimeout(() => {
          setShowRest(true);
        }, 850);
      }, 400);
    }, 3200);

    return () => clearTimeout(minLoadTimer);
  }, []);

  const toggleAisle = (num) => {
    setOpenAisle((prev) => (prev === num ? null : num));
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
      if (window.lenis) {
        window.lenis.scrollTo(el, { duration: 2.4 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const directory = [
    {
      num: "01",
      name: "Report & Thesis Print Lab",
      desc: "1200 DPI Duplex · Wire-O Spiral · Frosted Covers",
      info: "High-speed duplex laser thesis printing calibrated for university defenses. Finished with Wire-O binding, thermal tape, and scratch-resistant frosted covers.",
      tags: [
        { label: "1200 DPI Duplex", variant: "pink" },
        { label: "Wire-O Metal Spiral", variant: "yellow" },
        { label: "Frosted Shield Covers", variant: "white" },
      ],
    },
    {
      num: "02",
      name: "Writing Weaponry",
      desc: "Archival 0.5mm Gel · Drafting Pencils · Highlighters",
      info: "Japanese micro-tip archival gel inks, balanced drafting leads, and quick-drying highlighters designed to eliminate sleeve smudging during marathon exams.",
      tags: [
        { label: "0.5mm Archival Gel", variant: "pink" },
        { label: "Knurled Drafting Lead", variant: "yellow" },
        { label: "Zero Smudge Mediums", variant: "white" },
      ],
    },
    {
      num: "03",
      name: "Parchment & Paper Reams",
      desc: "75 & 80 GSM High-Brightness A4 · Sticky Memos",
      info: "High-brightness chlorine-free bond paper reams with zero-bleed opacity for double-sided prints, lab notes, and blueprint schematics.",
      tags: [
        { label: "75 & 80 GSM Bond", variant: "pink" },
        { label: "98% ISO High-White", variant: "yellow" },
        { label: "A4 & A3 Formats", variant: "white" },
      ],
    },
    {
      num: "04",
      name: "Measuring & Drafting",
      desc: "Steel Non-Slip Rulers · Geometry Kits · Cutting Mats",
      info: "Laser-etched stainless steel scales, heavy brass compass rigs, and 5-ply self-healing cutting mats with ±0.1mm drafting tolerance.",
      tags: [
        { label: "±0.1mm Precision", variant: "pink" },
        { label: "5-Ply Self-Healing", variant: "yellow" },
        { label: "Solid Brass Rig", variant: "white" },
      ],
    },
    {
      num: "05",
      name: "Raven Offering Altar",
      desc: "Contactless Mobile QR · Automated Receipt Sync",
      info: "Contactless UPI terminal for campus dues clearance, automated ghost ledger sync, and instant cryptographic submission tokens.",
      tags: [
        { label: "Dynamic UPI QR", variant: "pink" },
        { label: "Zero-Fee Student Rate", variant: "yellow" },
        { label: "Instant Ledger Sync", variant: "white" },
      ],
    },
    {
      num: "06",
      name: "Archival Folio Receipts",
      desc: "Code 128 Barcode Verification · Express Desk 04 Pickup",
      info: "Optical Code 128 barcode receipts for queue tracking and express dispatch verification at Desk 04 express locker.",
      tags: [
        { label: "Code 128 Barcode", variant: "pink" },
        { label: "Express Desk 04", variant: "yellow" },
        { label: "Live Queue Telemetry", variant: "white" },
      ],
    },
  ];

  return (
    <>
      <style>{styles}</style>

      <div className="od-min-root">
        {/* ── TOP RIGHT CONTROLS: SOUND TOGGLE & ENTER BASECAMP PILL ── */}
        <div className={`od-top-right-wrap ${showRest ? "is-visible" : ""}`}>
          <button
            className={`od-sound-btn ${soundEnabled ? "is-active" : ""}`}
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
          >
            {soundEnabled ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
            <span>{soundEnabled ? "SOUND ON" : "SOUND OFF"}</span>
          </button>

          <button className="od-top-btn" onClick={() => handleNavigate("/student")}>
            ENTER BASECAMP →
          </button>
        </div>

        {/* ── 1. HERO SCREEN WITH 3D ELASTIC MESH ── */}
        <section className="od-hero-screen">
          {/* ✦ SEAMLESS CUTOFF LOADER STAGE (Subaashbala hideAndSeek) ✦ */}
          {loadingState !== "ready" && (
            <div className={`od-loader-overlay ${loadingState === "revealing" ? "loader-fade-out" : ""}`}>
              <div className="loader">
                <span className="l letter">L</span>
                <span className="o letter">O</span>
                <span className="a letter">A</span>
                <span className="d letter">D</span>
                <span className="ispan letter i">I</span>
                <span className="n letter">N</span>
                <span className="g letter">G</span>
              </div>
            </div>
          )}

          <div className="od-mesh-wrap">
            {loadingState === "ready" && (
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
            )}
          </div>

          <div className={`od-subtitle ${showRest ? "is-visible" : ""}`}>
            Survive the deadline. <span className="od-cursor" />
          </div>

          {/* Falling Comet Scroll Indicator */}
          <button className={`od-scroll-down-indicator ${showRest ? "is-visible" : ""}`} onClick={scrollToNext} aria-label="Scroll down">
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
            <span className="od-dir-title">THE EXPEDITION KIT</span>
          </div>

          <div>
            {directory.map((item) => {
              const isExpanded = openAisle === item.num;

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

                    <span className="od-dir-toggle">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1.5V12.5M1.5 7H12.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>

                  {/* Classic Comic Neomorphic Box & Tags */}
                  <div
                    className={`od-dir-drawer ${isExpanded ? "is-open" : ""}`}
                    aria-hidden={!isExpanded}
                  >
                    <div className="od-dir-drawer-inner">
                      <div className="od-comic-box-wrap">
                        <div className="od-comic-card">
                          {item.info}
                        </div>
                        {item.tags && (
                          <div className="od-comic-tag-group">
                            {item.tags.map((tag, idx) => (
                              <span key={idx} className={`od-comic-chip ${tag.variant}`}>
                                ★ {tag.label}
                              </span>
                            ))}
                          </div>
                        )}
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
      </div>
    </>
  );
}
