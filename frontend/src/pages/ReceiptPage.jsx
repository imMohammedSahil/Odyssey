import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

  body, html {
    margin: 0;
    padding: 0;
    background: #000000;
    overflow-x: hidden;
  }

  .rcpt-root {
    min-height: 100vh;
    width: 100vw;
    background: #000000;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
  }

  /* ── 100% PURE VECTOR BACKDROP CANVAS LAYERS ── */
  .rcpt-bg-layer {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
    background: #000000;
    contain: strict;
  }

  .rcpt-bg-vector {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  /* ✦ WAVE 1: INK OUTLINES & EMERALD UNDERCOAT BLEED (LEADS THE WAVE) */
  .rcpt-bg-ink {
    z-index: 2;
    filter: contrast(1.5) brightness(1.25) drop-shadow(0 0 25px rgba(95, 226, 145, 0.45));
    transition: clip-path 6.8s cubic-bezier(0.22, 0.95, 0.32, 1), opacity 0.4s ease-out;
  }

  .rcpt-bg-ink.hidden-veil {
    clip-path: circle(0% at 55.56% 34.86%);
    opacity: 0;
  }

  .rcpt-bg-ink.blooming {
    opacity: 1;
    clip-path: circle(165% at 55.56% 34.86%);
  }

  .rcpt-bg-ink.revealed {
    clip-path: circle(180% at 55.56% 34.86%);
    opacity: 0; /* Fades out smoothly into full final painting */
    transition: opacity 1s ease;
  }

  /* ✦ WAVE 2: FULL SATURATED OIL / COLOR PAINTING (FOLLOWS WITH RICH TONES) */
  .rcpt-bg-color {
    z-index: 3;
    transition: clip-path 7.6s cubic-bezier(0.25, 0.96, 0.35, 1) 0.35s, opacity 0.5s ease-out;
  }

  .rcpt-bg-color.hidden-veil {
    clip-path: circle(0% at 55.56% 34.86%);
    opacity: 0;
  }

  .rcpt-bg-color.blooming {
    opacity: 1;
    clip-path: circle(165% at 55.56% 34.86%);
  }

  .rcpt-bg-color.revealed {
    clip-path: circle(180% at 55.56% 34.86%);
    opacity: 1;
  }

  /* Ambient depth vignette */
  .rcpt-bg-vignette {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 4;
    background: radial-gradient(circle at 55.56% 34.86%, rgba(2, 11, 7, 0.05) 0%, rgba(0, 0, 0, 0.72) 100%);
    opacity: 0;
    transition: opacity 3s ease 2s;
  }

  .rcpt-bg-vignette.active {
    opacity: 1;
  }

  /* ── ORGANIC WAND SPARK FLAME (CLICK 1 & ANCHOR) ── */
  .wand-spark-layer {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
    overflow: hidden;
    contain: strict;
  }

  .wand-spark-layer.tease {
    animation: realisticFlameTease 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .wand-spark-layer.ignited {
    opacity: 1;
    animation: flamePulse 2s infinite ease-in-out;
  }

  .wand-spark-vector {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  @keyframes realisticFlameTease {
    0% {
      opacity: 0;
      transform: scale(0.65);
      filter: brightness(2.2);
    }
    18% {
      opacity: 1;
      transform: scale(1.04);
      filter: brightness(1.7);
    }
    38% {
      opacity: 0.9;
      transform: scale(0.99);
      filter: brightness(1.3);
    }
    55% {
      opacity: 1;
      transform: scale(1.02);
      filter: brightness(1.6);
    }
    75% {
      opacity: 0.85;
      transform: scale(0.98);
      filter: brightness(1.2);
    }
    100% {
      opacity: 0;
      transform: scale(0.85);
      filter: brightness(0.4);
    }
  }

  @keyframes flamePulse {
    0%, 100% {
      filter: brightness(1.2) drop-shadow(0 0 25px rgba(114, 255, 165, 0.7));
    }
    50% {
      filter: brightness(1.5) drop-shadow(0 0 45px rgba(95, 226, 145, 0.95));
    }
  }

  /* ── SLOW LIVING CANVAS PAINTERLY BLEED RIPPLE ── */
  .painterly-wash-wave {
    position: fixed;
    left: 55.56%;
    top: 34.86%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 5;
    border-radius: 50%;
    animation: slowPaintExpansion 7.5s cubic-bezier(0.22, 0.95, 0.32, 1) forwards;
  }

  @keyframes slowPaintExpansion {
    0% {
      width: 12px;
      height: 12px;
      opacity: 1;
      border: 4px solid #ffffff;
      box-shadow: 0 0 45px #72ffa5, inset 0 0 25px #5fe291;
    }
    15% {
      opacity: 0.95;
      border: 6px solid #72ffa5;
      box-shadow: 0 0 80px #5fe291, 0 0 140px #1d6d44;
    }
    55% {
      opacity: 0.75;
      border: 5px solid rgba(114, 255, 165, 0.75);
      box-shadow: 0 0 120px rgba(95, 226, 145, 0.6), 0 0 220px rgba(29, 109, 68, 0.4);
    }
    85% {
      opacity: 0.35;
      border: 2px solid rgba(114, 255, 165, 0.3);
      box-shadow: 0 0 140px rgba(95, 226, 145, 0.2);
    }
    100% {
      width: 290vw;
      height: 290vw;
      opacity: 0;
      border: 1px solid transparent;
      box-shadow: 0 0 180px transparent;
    }
  }

  /* ── AWWWARDS MAGNETIC CURSOR FOLLOWER PILL ── */
  .awwwards-cursor-pill {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    background: rgba(2, 11, 7, 0.85);
    border: 1.5px solid #5fe291;
    border-radius: 9999px;
    box-shadow: 0 0 24px rgba(95, 226, 145, 0.35), 0 8px 30px rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #e8fff0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transform: translate(-50%, -50%);
    transition: opacity 0.4s ease, border-color 0.25s ease, background 0.25s ease, transform 0.1s ease-out;
  }

  .awwwards-cursor-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #5fe291;
    box-shadow: 0 0 8px #5fe291;
    animation: dotPulse 1.2s infinite ease-in-out;
  }

  @keyframes dotPulse {
    0%, 100% { transform: scale(0.9); opacity: 0.7; }
    50% { transform: scale(1.4); opacity: 1; }
  }

  /* Top Return Button */
  .rcpt-nav-back {
    position: fixed;
    top: 24px;
    left: 24px;
    z-index: 50;
    background: rgba(2, 11, 7, 0.85);
    border: 1.5px solid #5fe291;
    color: #e8fff0;
    padding: 9px 18px;
    border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 3px 3px 0px #020804;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .rcpt-nav-back:hover {
    background: #145a37;
    transform: translate(-1px, -1px);
  }
`;

export default function ReceiptPage() {
  const navigate = useNavigate();

  // 0 = pitch black | 1 = sparked (waiting click 2) | 2 = slow canvas painting | 3 = fully revealed
  const [stage, setStage] = useState(0);
  const [sparkKey, setSparkKey] = useState(0);
  const [showSpark, setShowSpark] = useState(false);

  // Smooth Awwwards cursor follower
  const cursorRef = useRef(null);
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    let animId;
    const onMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const updateCursor = () => {
      // Smooth lerp for silky feel
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.16;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.16;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener("mousemove", onMouseMove);
    animId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleScreenClick = (e) => {
    if (e.target.closest(".rcpt-nav-back")) return;

    if (stage === 0) {
      // ✦ FIRST CLICK: Organic vector flame flares precisely at wand tip, then dims to black
      setShowSpark(true);
      setSparkKey((prev) => prev + 1);
      setTimeout(() => {
        setShowSpark(false);
        setStage(1); // Ready for click 2
      }, 950);
    } else if (stage === 1) {
      // ✦ SECOND CLICK: Slow living canvas painting begins originating from the spark
      setStage(2);
      setTimeout(() => {
        setStage(3); // Fully painted & settled
      }, 7600);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rcpt-root" onClick={handleScreenClick}>
        
        {/* WAVE 1: Inked outlines & light wash bleeding out first */}
        <div
          className={`rcpt-bg-layer rcpt-bg-ink ${
            stage === 0 || stage === 1
              ? "hidden-veil"
              : stage === 2
              ? "blooming"
              : "revealed"
          }`}
          aria-hidden="true"
        >
          <img
            src="/wizard-enchanted-greenlight.svg"
            alt="Enchanted Greenlight Inked Canvas"
            className="rcpt-bg-vector"
          />
        </div>

        {/* WAVE 2: Full saturated gothic color painting expanding right behind */}
        <div
          className={`rcpt-bg-layer rcpt-bg-color ${
            stage === 0 || stage === 1
              ? "hidden-veil"
              : stage === 2
              ? "blooming"
              : "revealed"
          }`}
          aria-hidden="true"
        >
          <img
            src="/wizard-enchanted-greenlight.svg"
            alt="Enchanted Greenlight Color Canvas"
            className="rcpt-bg-vector"
          />
        </div>

        {/* Ambient depth vignette */}
        <div className={`rcpt-bg-vignette ${stage >= 2 ? "active" : ""}`} aria-hidden="true" />

        {/* Click 1: Precise Organic Vector Flame Tease at Wand Tip */}
        {showSpark && (
          <div key={sparkKey} className="wand-spark-layer tease" aria-hidden="true">
            <img
              src="/wand-spark-flame.svg"
              alt="Organic Wand Spark Flame"
              className="wand-spark-vector"
            />
          </div>
        )}

        {/* Click 2+: Permanent Vector Flame Anchor while painting spreads */}
        {stage >= 2 && (
          <div className="wand-spark-layer ignited" aria-hidden="true">
            <img
              src="/wand-spark-flame.svg"
              alt="Organic Wand Spark Flame"
              className="wand-spark-vector"
            />
          </div>
        )}

        {/* Click 2: Slow Living Canvas Paint Bleed Ripple (7.5s) */}
        {stage === 2 && <div className="painterly-wash-wave" aria-hidden="true" />}

        {/* Awwwards Cursor Follower Pill (Only shown before second click) */}
        {stage < 2 && (
          <div ref={cursorRef} className="awwwards-cursor-pill">
            <span className="awwwards-cursor-dot" />
            {stage === 0 ? "CLICK TO ENTER" : "CLICK AGAIN"}
          </div>
        )}

        {/* Minimal Nav to Return */}
        <button
          onClick={() => navigate("/student")}
          className="rcpt-nav-back"
        >
          ← BACK TO HOME
        </button>
      </div>
    </>
  );
}
