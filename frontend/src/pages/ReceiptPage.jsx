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

  /* ── ORGANIC PAINT SPILL CANVAS MASK (Single fluid wave spreading randomly) ── */
  .rcpt-paint-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    pointer-events: none;
    display: block;
  }

  /* Ambient depth vignette */
  .rcpt-bg-vignette {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
    background: radial-gradient(circle at 55.56% 34.86%, rgba(2, 11, 7, 0.05) 0%, rgba(0, 0, 0, 0.72) 100%);
    opacity: 0;
    transition: opacity 3s ease 1s;
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
      transform: scale(0.7);
    }
    18% {
      opacity: 1;
      transform: scale(1.02);
    }
    38% {
      opacity: 0.92;
      transform: scale(0.99);
    }
    55% {
      opacity: 1;
      transform: scale(1.01);
    }
    75% {
      opacity: 0.88;
      transform: scale(0.98);
    }
    100% {
      opacity: 0;
      transform: scale(0.85);
    }
  }

  @keyframes flamePulse {
    0%, 100% {
      opacity: 0.95;
      transform: scale(1.0);
    }
    50% {
      opacity: 1.0;
      transform: scale(1.02);
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

  // 0 = pitch black | 1 = sparked (waiting click 2) | 2 = paint spill flowing | 3 = fully revealed
  const [stage, setStage] = useState(0);
  const [sparkKey, setSparkKey] = useState(0);
  const [showSpark, setShowSpark] = useState(false);

  // Awwwards cursor follower
  const cursorRef = useRef(null);
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Canvas ref for the organic fluid paint spill
  const canvasRef = useRef(null);

  useEffect(() => {
    let animId;
    const onMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const updateCursor = () => {
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

  // ✦ SINGLE ORGANIC PAINT SPILL FLOW (LIQUID WATERCOLOR ACROSS BLACK SHEET)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (stage < 2) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (stage < 2) {
      // Solid black sheet
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return () => window.removeEventListener("resize", resizeCanvas);
    }

    if (stage === 2) {
      // Calculate the exact screen coordinates of the wand spark point (928, 328) taking object-fit: cover into account
      const imgAspect = 1672 / 941;
      const screenAspect = canvas.width / canvas.height;
      let renderW, renderH, offsetX, offsetY;

      if (screenAspect > imgAspect) {
        renderW = canvas.width;
        renderH = canvas.width / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height - renderH) / 2;
      } else {
        renderH = canvas.height;
        renderW = canvas.height * imgAspect;
        offsetX = (canvas.width - renderW) / 2;
        offsetY = 0;
      }

      const originX = offsetX + (928 / 1672) * renderW;
      const originY = offsetY + (328 / 941) * renderH;

      // Max radius to cover all screen corners comfortably
      const maxDist = Math.hypot(
        Math.max(originX, canvas.width - originX),
        Math.max(originY, canvas.height - originY)
      ) * 1.35;

      // Low-amplitude, buttery-smooth organic liquid lobes (NO sharp saw-teeth or jagged spikes)
      const numRays = 180;
      const rays = [];
      for (let i = 0; i < numRays; i++) {
        const theta = (i / numRays) * Math.PI * 2;
        // Gentle, rolling low-amplitude variation (±12% total max swing)
        const speedVar = 1.0 + 0.07 * Math.sin(theta * 2 + 0.7) + 0.04 * Math.cos(theta * 3 - 0.4) + 0.02 * Math.sin(theta * 5 + 1.2);
        rays.push({ theta, speedVar });
      }

      const durationMs = 11000; // 11s total: slow deliberate center reveal, then accelerates outward
      const startTime = performance.now();

      const animateSpill = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / durationMs);

        // Slow & time-consuming at center (0-60%), then rapidly sweeps across outer edges (60-100%)
        let ease;
        if (progress <= 0.6) {
          const u = progress / 0.6;
          ease = 0.55 * (0.4 * u + 0.6 * Math.pow(u, 1.6));
        } else {
          const v = (progress - 0.6) / 0.4;
          ease = 0.55 + 0.45 * (1.0 - Math.pow(1.0 - v, 2.0));
        }

        // 1. Redraw black sheet
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Carve out the organic flowing paint spill from the black sheet
        ctx.globalCompositeOperation = "destination-out";

        // Generate fluid spill boundary vertices with gentle rolling curves
        const points = [];
        for (let i = 0; i < numRays; i++) {
          const { theta, speedVar } = rays[i];
          const currentRadius = maxDist * ease * speedVar;
          const px = originX + Math.cos(theta) * currentRadius;
          const py = originY + Math.sin(theta) * currentRadius;
          points.push({ x: px, y: py });
        }

        // Draw smooth, rolling liquid boundary using midpoint quadratic curves
        if (points.length > 2) {
          ctx.beginPath();
          const p0 = points[0];
          const pLast = points[points.length - 1];
          const startMid = { x: (p0.x + pLast.x) / 2, y: (p0.y + pLast.y) / 2 };
          ctx.moveTo(startMid.x, startMid.y);

          for (let i = 0; i < points.length; i++) {
            const curr = points[i];
            const next = points[(i + 1) % points.length];
            const mid = { x: (curr.x + next.x) / 2, y: (curr.y + next.y) / 2 };
            ctx.quadraticCurveTo(curr.x, curr.y, mid.x, mid.y);
          }
          ctx.closePath();
          ctx.fillStyle = "#000000";
          ctx.fill();
        }

        ctx.restore();

        if (progress < 1.0) {
          animationId = requestAnimationFrame(animateSpill);
        } else {
          // Finished flowing across entire page
          setStage(3);
        }
      };

      animationId = requestAnimationFrame(animateSpill);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [stage]);

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
      // ✦ SECOND CLICK: Organic liquid paint spills randomly across the sheet
      setStage(2);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rcpt-root" onClick={handleScreenClick}>
        
        {/* 100% PURE VECTOR BACKDROP (Revealed along the path of the flowing paint) */}
        <div className="rcpt-bg-layer" aria-hidden="true">
          <img
            src="/wizard-enchanted-greenlight.svg"
            alt="Enchanted Greenlight Vector Canvas"
            className="rcpt-bg-vector"
          />
        </div>

        {/* Dynamic Organic Paint Spill Canvas (Carves away black sheet organically) */}
        {stage < 3 && <canvas ref={canvasRef} className="rcpt-paint-canvas" aria-hidden="true" />}

        {/* Ambient depth vignette */}
        <div className={`rcpt-bg-vignette ${stage >= 2 ? "active" : ""}`} aria-hidden="true" />

        {/* Click 1: Precise Concentrated Wand Tip Spark Tease */}
        {showSpark && (
          <div key={sparkKey} className="wand-spark-layer tease" aria-hidden="true">
            <img
              src="/wand-spark-flame.svg"
              alt="Wand Spark Core"
              className="wand-spark-vector"
            />
          </div>
        )}

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
