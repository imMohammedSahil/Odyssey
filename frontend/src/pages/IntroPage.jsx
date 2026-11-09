import React, { useState, useEffect } from "react";
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
    font-weight: 700;
    color: rgba(10, 10, 10, 0.5);
    transition: color 0.15s ease, -webkit-text-stroke 0.15s ease;
  }

  .od-dir-row:hover .od-dir-num,
  .od-dir-item-wrap.is-expanded .od-dir-num {
    color: #FF1A8C;
    -webkit-text-stroke: 1.6px #0A0A0A;
    paint-order: stroke fill;
    text-shadow:
      -1px -1px 0 #0A0A0A,
       1px -1px 0 #0A0A0A,
      -1px  1px 0 #0A0A0A,
       1px  1px 0 #0A0A0A;
  }

  .od-dir-name {
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-black);
    transition: color 0.15s ease, -webkit-text-stroke 0.15s ease, text-shadow 0.15s ease;
  }

  .od-dir-row:hover .od-dir-name,
  .od-dir-item-wrap.is-expanded .od-dir-name {
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

  .od-dir-arrow {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-black);
    transition: transform 0.25s ease, color 0.2s ease, -webkit-text-stroke 0.2s ease;
  }

  .od-dir-row:hover .od-dir-arrow {
    color: #FF1A8C;
    -webkit-text-stroke: 1.4px #0A0A0A;
    paint-order: stroke fill;
    transform: translate(4px, -4px);
  }

  .od-dir-item-wrap.is-expanded .od-dir-arrow {
    color: #FF1A8C;
    -webkit-text-stroke: 1.4px #0A0A0A;
    paint-order: stroke fill;
    transform: rotate(90deg);
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
  const [openAisle, setOpenAisle] = useState(null);

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
      el.scrollIntoView({ behavior: "smooth" });
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

                    <span className={`od-dir-arrow ${isExpanded ? "is-open" : ""}`}>↗</span>
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
