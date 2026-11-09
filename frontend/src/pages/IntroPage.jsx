import React from "react";
import { useNavigate } from "react-router-dom";
import ElasticMesh from "../components/ElasticMesh";
import BlobCursor from "../components/BlobCursor";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

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
    color: var(--bg-green);
    transform: translateY(-2px) scale(1.02);
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
    max-width: 1320px;
    height: clamp(250px, 36vw, 440px);
    position: relative;
    margin: 0 auto;
    cursor: grab;
    touch-action: none;
  }

  .od-mesh-wrap:active {
    cursor: grabbing;
  }

  .od-subtitle {
    font-size: clamp(16px, 1.6vw, 20px);
    font-weight: 600;
    color: #171E12;
    letter-spacing: 0.04em;
    margin-top: -12px;
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
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 100%;
    background: rgba(10, 10, 10, 0.18);
  }

  .od-scroll-comet-stream {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -42px);
    animation: cometFall 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    will-change: transform, opacity;
  }

  @keyframes cometFall {
    0% {
      transform: translate(-50%, -42px);
      opacity: 0;
    }
    18% {
      opacity: 1;
    }
    70% {
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
    margin: 80px auto 140px;
    padding: 0 32px;
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

  .od-dir-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 0;
    border-bottom: 1.5px solid var(--border-line);
    cursor: pointer;
    text-decoration: none;
    transition: padding-left 0.2s ease, border-color 0.2s ease;
  }

  .od-dir-row:hover {
    padding-left: 12px;
    border-color: var(--text-black);
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

  .od-dir-row:hover .od-dir-name {
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
    transition: transform 0.2s ease, color 0.2s ease;
  }

  .od-dir-row:hover .od-dir-arrow {
    color: var(--brain-pink);
    transform: translate(4px, -4px);
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
    .od-mesh-wrap {
      height: clamp(220px, 45vw, 300px);
    }
    .od-subtitle {
      font-size: 15px;
      margin-top: -6px;
    }
  }
`;

export default function IntroPage() {
  const navigate = useNavigate();

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
    { num: "01", name: "Report & Thesis Print Lab", desc: "1200 DPI Duplex · Wire-O Spiral · Frosted Covers", route: "/printing" },
    { num: "02", name: "Writing Weaponry", desc: "Archival 0.5mm Gel · Drafting Pencils · Highlighters", route: "/writing" },
    { num: "03", name: "Parchment & Paper Reams", desc: "75 & 80 GSM High-Brightness A4 · Sticky Memos", route: "/paper" },
    { num: "04", name: "Measuring & Drafting", desc: "Steel Non-Slip Rulers · Geometry Kits · Cutting Mats", route: "/measuring" },
    { num: "05", name: "Raven Offering Altar", desc: "Contactless Mobile QR · Automated Receipt Sync", route: "/ritual-offering" },
    { num: "06", name: "Archival Folio Receipts", desc: "Code 128 Barcode Verification · Express Desk 04 Pickup", route: "/student" },
  ];

  return (
    <>
      <style>{styles}</style>

      <div className="od-min-root">
        {/* ── LIQUID METAL BLOB CURSOR ── */}
        <BlobCursor
          material="chrome"
          color="#3B82F6"
          blend="normal"
          size={140}
          morph={0}
          morphSpeed={0.4}
          depth={1}
          trail={16}
          lag={0.55}
          goo={1}
          stretch={0.6}
          wobble={1}
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
              inflate={1.1}
              stiffness={0.45}
              wobble={0.65}
              grabRadius={80}
              stretch={0.6}
              press={0.6}
              shadow={0.5}
              intro={true}
              theme="dark"
              scale={1.08}
            />
          </div>

          <div className="od-subtitle">
            Survive the deadline. <span className="od-cursor" />
          </div>

          {/* Falling Comet Scroll Indicator */}
          <button className="od-scroll-down-indicator" onClick={scrollToNext} aria-label="Scroll down">
            <span className="od-scroll-text">Scroll</span>
            <div className="od-scroll-comet-track">
              <div className="od-scroll-guide-line" />
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
          <p className="od-manifesto-text">
            We’re Odyssey, a <em>campus survival armory</em> that prints project theses, stocks precision stationery, 
            and settles dues at the raven altar. <em>Deadlines that feel like child’s play. Tools that give you 
            your sleep back.</em> Survive the deadline
            <span className="od-dot" style={{ fontSize: "1.1em" }}>.</span>
          </p>
        </section>

        {/* ── 3. MINIMALIST AISLE DIRECTORY ── */}
        <section className="od-directory-section">
          <div className="od-dir-header">
            <span className="od-dir-title">Requisition Aisles</span>
            <span className="od-dir-title">Desk 04 Telemetry</span>
          </div>

          <div>
            {directory.map((item) => (
              <div
                key={item.num}
                className="od-dir-row"
                onClick={() => handleNavigate(item.route)}
              >
                <div className="od-dir-left">
                  <span className="od-dir-num">{item.num}</span>
                  <div>
                    <h3 className="od-dir-name">{item.name}</h3>
                    <p className="od-dir-desc">{item.desc}</p>
                  </div>
                </div>

                <span className="od-dir-arrow">↗</span>
              </div>
            ))}
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
