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

  /* ── ORGANIC PAINT CANVAS MASK (Controls black sheet, Click 1 tease & Click 2 spill) ── */
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
    background: #0e3520;
    border: 1.5px solid #5fe291;
    border-radius: 9999px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
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

function getWandScreenPos(width, height) {
  const imgAspect = 1672 / 941;
  const screenAspect = width / height;
  let renderW, renderH, offsetX, offsetY;

  if (screenAspect > imgAspect) {
    renderW = width;
    renderH = width / imgAspect;
    offsetX = 0;
    offsetY = (height - renderH) / 2;
  } else {
    renderH = height;
    renderW = height * imgAspect;
    offsetX = (width - renderW) / 2;
    offsetY = 0;
  }

  const originX = offsetX + (928 / 1672) * renderW;
  const originY = offsetY + (328 / 941) * renderH;
  const scale = renderW / 1672;
  return { originX, originY, renderW, renderH, offsetX, offsetY, scale };
}

function projectPt(x, y, renderW, renderH, offsetX, offsetY) {
  return {
    x: offsetX + (x / 1672) * renderW,
    y: offsetY + (y / 941) * renderH
  };
}

// Draws a stroke path from vertex 0 up to currentDistance from wand tip
function drawStrokeLine(ctx, stroke, currentDist, renderW, renderH, offsetX, offsetY) {
  if (currentDist < stroke.minD) return null;

  const pts = stroke.pts;
  if (!pts || pts.length < 2) return null;

  let fraction = 1.0;
  if (currentDist < stroke.maxD && stroke.maxD > stroke.minD) {
    fraction = Math.max(0, Math.min(1.0, (currentDist - stroke.minD) / (stroke.maxD - stroke.minD)));
  }

  const numSegments = pts.length - 1;
  const targetSegment = fraction * numSegments;
  const fullSegments = Math.floor(targetSegment);
  const segFraction = targetSegment - fullSegments;

  ctx.beginPath();
  const p0 = projectPt(pts[0][0], pts[0][1], renderW, renderH, offsetX, offsetY);
  ctx.moveTo(p0.x, p0.y);

  let lastX = p0.x;
  let lastY = p0.y;

  for (let i = 1; i <= fullSegments; i++) {
    const pt = projectPt(pts[i][0], pts[i][1], renderW, renderH, offsetX, offsetY);
    ctx.lineTo(pt.x, pt.y);
    lastX = pt.x;
    lastY = pt.y;
  }

  if (segFraction > 0 && fullSegments < numSegments) {
    const pPrev = projectPt(pts[fullSegments][0], pts[fullSegments][1], renderW, renderH, offsetX, offsetY);
    const pNext = projectPt(pts[fullSegments + 1][0], pts[fullSegments + 1][1], renderW, renderH, offsetX, offsetY);
    lastX = pPrev.x + (pNext.x - pPrev.x) * segFraction;
    lastY = pPrev.y + (pNext.y - pPrev.y) * segFraction;
    ctx.lineTo(lastX, lastY);
  }

  return { tipX: lastX, tipY: lastY, fraction, isComplete: fraction >= 1.0 };
}

export default function ReceiptPage() {
  const navigate = useNavigate();

  // 0 = pitch black | 0.5 = tease 1 | 1 = waiting click 2 | 1.5 = tease 2 | 2 = waiting click 3 | 3 = paint spill flowing | 4 = fully revealed
  const [stage, setStage] = useState(0);

  // Awwwards cursor follower
  const cursorRef = useRef(null);
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Canvas ref for both Click 1 tease and Click 2 paint spill
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);

  useEffect(() => {
    fetch("/wizard-ink-strokes.json")
      .then((res) => res.json())
      .then((data) => {
        strokesRef.current = data;
      })
      .catch((err) => console.error("Error loading ink strokes:", err));
  }, []);

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

  // ✦ CANVAS LIFECYCLE FOR CLICK 1 TEASE & CLICK 2 SPILL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (stage < 3) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (stage === 0 || stage === 1 || stage === 2) {
      // Solid black sheet
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return () => window.removeEventListener("resize", resizeCanvas);
    }

    if (stage === 0.5 || stage === 1.5) {
      // ✦ CLICK 1 & CLICK 2: Actual comic ink lines in the painting draw themselves outward from the wand tip!
      const { originX, originY, renderW, renderH, offsetX, offsetY, scale } = getWandScreenPos(canvas.width, canvas.height);
      const isSecondClick = stage === 1.5;
      const targetReach = isSecondClick ? 370 : 210; // In artwork units (1672x941)
      const startTime = performance.now();
      const durationMs = isSecondClick ? 1150 : 1000;

      const animateTease = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / durationMs);

        // Lines actively draw outward (0-44%), hold & pulse (44-68%), then un-draw/dissolve (68-100%)
        let drawProg, lineAlpha;
        if (progress < 0.44) {
          drawProg = progress / 0.44;
          drawProg = 1 - Math.pow(1 - drawProg, 2.0);
          lineAlpha = 1.0;
        } else if (progress < 0.68) {
          drawProg = 1.0;
          lineAlpha = 1.0 - 0.08 * Math.sin(((progress - 0.44) / 0.24) * Math.PI);
        } else {
          drawProg = 1.0;
          lineAlpha = Math.max(0, (1.0 - progress) / 0.32);
        }

        const currentDist = targetReach * drawProg;

        ctx.save();
        // 1. Black canvas sheet
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (lineAlpha > 0) {
          // 2. Carve out the artwork along the exact comic line paths
          ctx.globalCompositeOperation = "destination-out";

          // Luminous incandescent core at wand tip
          const coreR = (32 + 22 * drawProg) * scale;
          const coreGrad = ctx.createRadialGradient(originX, originY, 0, originX, originY, coreR);
          coreGrad.addColorStop(0, `rgba(0, 0, 0, ${lineAlpha})`);
          coreGrad.addColorStop(0.7, `rgba(0, 0, 0, ${lineAlpha * 0.9})`);
          coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(originX, originY, coreR, 0, Math.PI * 2);
          ctx.fill();

          const activeTips = [];
          const strokes = strokesRef.current;

          // Carve along each exact comic stroke
          for (let i = 0; i < strokes.length; i++) {
            const s = strokes[i];
            if (s.minD > currentDist) break; // Array is sorted by minD

            const res = drawStrokeLine(ctx, s, currentDist, renderW, renderH, offsetX, offsetY);
            if (res) {
              ctx.lineWidth = Math.max(7 * scale, 16 * scale * (1 - (s.minD / 400) * 0.4));
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              ctx.strokeStyle = `rgba(0, 0, 0, ${lineAlpha * 0.96})`;
              ctx.stroke();

              if (!res.isComplete) {
                activeTips.push({ x: res.tipX, y: res.tipY, type: s.type });
              }
            }
          }

          // 3. Draw luminous white & mint tracing strokes + spark heads directly on the lines
          ctx.globalCompositeOperation = "source-over";

          for (let i = 0; i < strokes.length; i++) {
            const s = strokes[i];
            if (s.minD > currentDist) break;

            const res = drawStrokeLine(ctx, s, currentDist, renderW, renderH, offsetX, offsetY);
            if (res) {
              const isPlume = s.type === "plume";
              // Outer glow
              ctx.lineWidth = isPlume ? 2.8 : 2.0;
              ctx.strokeStyle = isPlume
                ? `rgba(235, 255, 245, ${lineAlpha * 0.9})`
                : `rgba(95, 226, 145, ${lineAlpha * 0.85})`;
              ctx.stroke();

              // Inner filament
              ctx.lineWidth = 1.0;
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha * 0.95})`;
              ctx.stroke();
            }
          }

          // Draw bright spark heads on the actively drawing tips
          if (drawProg < 0.98) {
            for (let t = 0; t < activeTips.length; t++) {
              const tip = activeTips[t];
              ctx.beginPath();
              ctx.arc(tip.x, tip.y, 2.5 * scale, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${lineAlpha})`;
              ctx.fill();
            }
          }
        }
        ctx.restore();

        if (progress < 1.0) {
          animationId = requestAnimationFrame(animateTease);
        } else {
          setStage(stage === 0.5 ? 1 : 2);
        }
      };

      animationId = requestAnimationFrame(animateTease);
      return () => {
        window.removeEventListener("resize", resizeCanvas);
        if (animationId) cancelAnimationFrame(animationId);
      };
    }

    if (stage === 3) {
      // ✦ CLICK 3: ALL comic ink lines across the painting draw themselves outward to completion!
      const { originX, originY, renderW, renderH, offsetX, offsetY, scale } = getWandScreenPos(canvas.width, canvas.height);
      const maxCanvasDist = Math.hypot(
        Math.max(originX, canvas.width - originX),
        Math.max(originY, canvas.height - originY)
      ) / scale;

      const durationMs = 3400; // Crisp, engaging cinematic pacing
      const startTime = performance.now();

      const animateFormation = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / durationMs);

        // Center line formation (0-50% detailed), outer sweep acceleration (50-100%)
        let ease;
        if (progress <= 0.50) {
          const u = progress / 0.50;
          ease = 0.45 * Math.pow(u, 1.4);
        } else {
          const v = (progress - 0.50) / 0.50;
          ease = 0.45 + 0.55 * (1.0 - Math.pow(1.0 - v, 2.0));
        }

        const currentDist = maxCanvasDist * ease;
        const floodDist = Math.max(0, currentDist - 95); // Flood fill trails ~95 units behind the leading stroke fronts

        ctx.save();
        // 1. Redraw black sheet
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Carve out the formed painting
        ctx.globalCompositeOperation = "destination-out";

        // Flood fill circle trailing behind the lines
        if (floodDist > 10) {
          ctx.beginPath();
          ctx.arc(originX, originY, floodDist * scale, 0, Math.PI * 2);
          ctx.fillStyle = "#000000";
          ctx.fill();
        }

        const activeTips = [];
        const strokes = strokesRef.current;

        // Carve along each exact comic stroke extending ahead of the flood front
        for (let i = 0; i < strokes.length; i++) {
          const s = strokes[i];
          if (s.minD > currentDist) break;

          const res = drawStrokeLine(ctx, s, currentDist, renderW, renderH, offsetX, offsetY);
          if (res) {
            ctx.lineWidth = Math.max(9 * scale, 16 * scale);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = "#000000";
            ctx.stroke();

            if (!res.isComplete) {
              activeTips.push({ x: res.tipX, y: res.tipY, type: s.type });
            }
          }
        }

        // 3. Draw luminous white & mint tracer strokes running on the lines ahead of flood front
        if (progress < 0.98) {
          ctx.globalCompositeOperation = "source-over";

          for (let i = 0; i < strokes.length; i++) {
            const s = strokes[i];
            if (s.minD > currentDist) break;
            if (s.maxD < floodDist) continue; // Already submerged in revealed painting

            const res = drawStrokeLine(ctx, s, currentDist, renderW, renderH, offsetX, offsetY);
            if (res) {
              ctx.lineWidth = 2.2;
              ctx.strokeStyle = s.type === "plume" ? "#FFFFFF" : "#5FE291";
              ctx.stroke();
            }
          }

          // Draw active drawing sparks at line tips
          for (let t = 0; t < activeTips.length; t += 2) {
            const tip = activeTips[t];
            ctx.beginPath();
            ctx.arc(tip.x, tip.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
          }
        }

        ctx.restore();

        if (progress < 1.0) {
          animationId = requestAnimationFrame(animateFormation);
        } else {
          // Painting completely formed into view
          setStage(4);
        }
      };

      animationId = requestAnimationFrame(animateFormation);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [stage]);

  const handleScreenClick = (e) => {
    if (e.target.closest(".rcpt-nav-back")) return;

    if (stage === 0) {
      // ✦ FIRST CLICK: Trigger the tease reveal of the circled artwork zone
      setStage(0.5);
    } else if (stage === 1) {
      // ✦ SECOND CLICK: Same tease reveal of the circled artwork zone
      setStage(1.5);
    } else if (stage === 2) {
      // ✦ THIRD CLICK: Organic liquid paint spills across the sheet to reveal the entire page
      setStage(3);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rcpt-root" onClick={handleScreenClick}>
        
        {/* 100% PURE VECTOR BACKDROP */}
        <div className="rcpt-bg-layer" aria-hidden="true">
          <img
            src="/wizard-enchanted-greenlight.svg"
            alt="Enchanted Greenlight Vector Canvas"
            className="rcpt-bg-vector"
          />
        </div>

        {/* Dynamic Organic Paint Spill Canvas */}
        {stage < 4 && <canvas ref={canvasRef} className="rcpt-paint-canvas" aria-hidden="true" />}

        {/* Ambient depth vignette */}
        <div className={`rcpt-bg-vignette ${stage >= 3 ? "active" : ""}`} aria-hidden="true" />

        {/* Awwwards Cursor Follower Pill (Shown before third click) */}
        {stage < 3 && (
          <div ref={cursorRef} className="awwwards-cursor-pill">
            <span className="awwwards-cursor-dot" />
            {stage === 0 || stage === 0.5 ? "CLICK TO ENTER" : "CLICK AGAIN"}
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
