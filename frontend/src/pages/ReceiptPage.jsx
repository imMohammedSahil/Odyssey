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

  /* ── 100% PURE VECTOR BACKDROP ── */
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

  /* Arcane Bloom Expansion originating precisely from Wand Flame (55.56% X, 34.86% Y) */
  .rcpt-bg-layer.hidden-veil {
    clip-path: circle(0% at 55.56% 34.86%);
    opacity: 0;
  }

  .rcpt-bg-layer.blooming {
    opacity: 1;
    clip-path: circle(160% at 55.56% 34.86%);
    transition: clip-path 2.4s cubic-bezier(0.12, 0.9, 0.25, 1), opacity 0.5s ease-out;
  }

  .rcpt-bg-layer.revealed {
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
    z-index: 2;
    background: radial-gradient(circle at 55.56% 34.86%, rgba(2, 11, 7, 0.08) 0%, rgba(0, 0, 0, 0.75) 100%);
    opacity: 0;
    transition: opacity 2s ease;
  }

  .rcpt-bg-vignette.active {
    opacity: 1;
  }

  /* ── REALISTIC ORGANIC WAND SPARK FLAME (CLICK 1) ── */
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
      transform: scale(0.6);
      filter: brightness(2.5) drop-shadow(0 0 6px #ffffff);
    }
    14% {
      opacity: 1;
      transform: scale(1.08);
      filter: brightness(1.9) drop-shadow(0 0 24px #72ffa5);
    }
    28% {
      opacity: 0.88;
      transform: scale(0.96);
      filter: brightness(1.4) drop-shadow(0 0 16px #5fe291);
    }
    45% {
      opacity: 1;
      transform: scale(1.03);
      filter: brightness(1.7) drop-shadow(0 0 22px #72ffa5);
    }
    65% {
      opacity: 0.85;
      transform: scale(0.97);
      filter: brightness(1.2);
    }
    100% {
      opacity: 0;
      transform: scale(0.78);
      filter: brightness(0.4) drop-shadow(0 0 0px transparent);
    }
  }

  @keyframes flamePulse {
    0%, 100% {
      filter: brightness(1.2) drop-shadow(0 0 25px rgba(114, 255, 165, 0.6));
    }
    50% {
      filter: brightness(1.5) drop-shadow(0 0 45px rgba(95, 226, 145, 0.9));
    }
  }

  /* ── COLOR EXPANSION WAVE (CLICK 2) ── */
  .wand-bloom-wave {
    position: fixed;
    left: 55.56%;
    top: 34.86%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 5;
    border-radius: 50%;
    animation: expandWave 2.4s cubic-bezier(0.12, 0.9, 0.25, 1) forwards;
  }

  @keyframes expandWave {
    0% {
      width: 10px;
      height: 10px;
      opacity: 1;
      border: 4px solid #ffffff;
      box-shadow: 0 0 40px #72ffa5, inset 0 0 20px #5fe291;
    }
    35% {
      opacity: 0.9;
      border: 6px solid #72ffa5;
      box-shadow: 0 0 90px #5fe291, 0 0 160px #1d6d44;
    }
    100% {
      width: 280vw;
      height: 280vw;
      opacity: 0;
      border: 2px solid transparent;
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

  // 0 = pitch black | 1 = sparked (waiting click 2) | 2 = blooming | 3 = fully revealed
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
      // ✦ SECOND CLICK: Flame ignites & color bloom paints outward from the wand
      setStage(2);
      setTimeout(() => {
        setStage(3); // Fully painted & revealed
      }, 2400);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rcpt-root" onClick={handleScreenClick}>
        {/* 100% PURE VECTOR BACKDROP (Radial Bloom Transition from Wand Tip) */}
        <div
          className={`rcpt-bg-layer ${
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
            alt="Enchanted Greenlight Pure Vector Backdrop"
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

        {/* Click 2+: Permanent Vector Flame Anchor while blooming */}
        {stage >= 2 && (
          <div className="wand-spark-layer ignited" aria-hidden="true">
            <img
              src="/wand-spark-flame.svg"
              alt="Organic Wand Spark Flame"
              className="wand-spark-vector"
            />
          </div>
        )}

        {/* Click 2: Arcane Color Expansion Shockwave */}
        {stage >= 2 && <div className="wand-bloom-wave" aria-hidden="true" />}

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
