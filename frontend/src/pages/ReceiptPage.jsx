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
  return { originX, originY, renderW, renderH };
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
      // ✦ CLICK 1 & CLICK 2: Reverse-trace linework actively draws outwards from wand tip, breathes, then de-traces
      const { originX, originY, renderW } = getWandScreenPos(canvas.width, canvas.height);
      const isSecondClick = stage === 1.5;
      const scale = renderW / 1672;
      const targetReach = (isSecondClick ? 285 : 195) * scale;
      const startTime = performance.now();
      const durationMs = isSecondClick ? 1250 : 1150;

      // Curated artistic linework trajectories based on painting geometry
      const filaments = [
        // Smoke plume rising upward and curling
        { angle: -1.69, maxD: targetReach * 1.12, freq: 3.2, amp: 14 * scale, forks: [0.45, 0.75] },
        { angle: -1.48, maxD: targetReach * 1.18, freq: 3.8, amp: 16 * scale, forks: [0.5] },
        { angle: -1.13, maxD: targetReach * 1.05, freq: 4.0, amp: 18 * scale, forks: [0.4] },
        { angle: -0.80, maxD: targetReach * 1.08, freq: 3.0, amp: 15 * scale, forks: [0.55] },
        { angle: -2.00, maxD: targetReach * 0.95, freq: 3.5, amp: 12 * scale, forks: [0.6] },

        // Wand wooden shaft & wizard hand
        { angle: 2.19, maxD: targetReach * 1.02, freq: 1.2, amp: 5 * scale, forks: [0.5, 0.8] },
        { angle: 2.35, maxD: targetReach * 0.98, freq: 1.8, amp: 7 * scale, forks: [0.6] },
        { angle: 1.92, maxD: targetReach * 0.90, freq: 2.2, amp: 8 * scale, forks: [0.55] },

        // Wizard face & cloak
        { angle: -3.05, maxD: targetReach * 1.00, freq: 2.5, amp: 9 * scale, forks: [0.5] },
        { angle: 2.80, maxD: targetReach * 1.05, freq: 2.8, amp: 11 * scale, forks: [0.6] },
        { angle: 2.55, maxD: targetReach * 0.95, freq: 2.0, amp: 8 * scale, forks: [0.5] },

        // Doorway lintel & panels
        { angle: 0.00, maxD: targetReach * 1.10, freq: 1.0, amp: 4 * scale, forks: [0.45, 0.8] },
        { angle: 0.26, maxD: targetReach * 1.15, freq: 2.2, amp: 8 * scale, forks: [0.5] },
        { angle: 0.52, maxD: targetReach * 1.05, freq: 2.5, amp: 10 * scale, forks: [0.6] },
        { angle: 0.79, maxD: targetReach * 1.02, freq: 2.0, amp: 9 * scale, forks: [0.5] },

        // Surrounding aura filaments
        { angle: -0.40, maxD: targetReach * 0.88, freq: 3.0, amp: 10 * scale, forks: [] },
        { angle: 1.10, maxD: targetReach * 0.85, freq: 2.5, amp: 8 * scale, forks: [] },
        { angle: 1.50, maxD: targetReach * 0.80, freq: 2.0, amp: 7 * scale, forks: [] },
        { angle: -2.40, maxD: targetReach * 0.85, freq: 2.8, amp: 9 * scale, forks: [] },
        { angle: -2.75, maxD: targetReach * 0.90, freq: 2.6, amp: 10 * scale, forks: [] }
      ];

      const animateTease = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / durationMs);

        // Tracing wave: actively draws outward (0-42%), holds and pulses (42-68%), then un-draws/dissolves (68-100%)
        let drawProg, lineAlpha;
        if (progress < 0.42) {
          drawProg = progress / 0.42;
          drawProg = 1 - Math.pow(1 - drawProg, 2.2); // Smooth ease-out draw
          lineAlpha = 1.0;
        } else if (progress < 0.68) {
          drawProg = 1.0;
          lineAlpha = 1.0 - 0.08 * Math.sin(((progress - 0.42) / 0.26) * Math.PI); // Arcane pulse
        } else {
          drawProg = 1.0;
          lineAlpha = Math.max(0, (1.0 - progress) / 0.32); // Smooth dissolve
        }

        ctx.save();
        // 1. Solid pitch black canvas sheet
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (lineAlpha > 0) {
          // 2. Carve out the artwork along the traced lines and central core
          ctx.globalCompositeOperation = "destination-out";

          // Central incandescent core reveal
          const coreRadius = (35 + 25 * drawProg) * scale;
          const coreGrad = ctx.createRadialGradient(originX, originY, 0, originX, originY, coreRadius);
          coreGrad.addColorStop(0, `rgba(0, 0, 0, ${lineAlpha})`);
          coreGrad.addColorStop(0.65, `rgba(0, 0, 0, ${lineAlpha * 0.9})`);
          coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(originX, originY, coreRadius, 0, Math.PI * 2);
          ctx.fill();

          // Carve out artwork along the exact path of each tracing line
          filaments.forEach((f) => {
            const currentDist = f.maxD * drawProg;
            if (currentDist <= 2) return;

            const steps = Math.max(6, Math.floor(currentDist / 12));
            ctx.beginPath();
            ctx.moveTo(originX, originY);

            for (let s = 1; s <= steps; s++) {
              const d = (s / steps) * currentDist;
              const lateral = Math.sin((d / 120) * f.freq) * f.amp * (d / f.maxD);
              const perpAngle = f.angle + Math.PI / 2;
              const px = originX + Math.cos(f.angle) * d + Math.cos(perpAngle) * lateral;
              const py = originY + Math.sin(f.angle) * d + Math.sin(perpAngle) * lateral;
              ctx.lineTo(px, py);
            }

            ctx.lineWidth = Math.max(14 * scale, 22 * scale * (1 - (currentDist / (targetReach * 1.5)) * 0.5));
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = `rgba(0, 0, 0, ${lineAlpha * 0.95})`;
            ctx.stroke();

            // Forks / sub-branches carving
            f.forks.forEach((forkRatio, idx) => {
              if (drawProg > forkRatio) {
                const forkProg = (drawProg - forkRatio) / (1 - forkRatio);
                const forkLen = f.maxD * 0.45 * forkProg;
                const forkDist = f.maxD * forkRatio;
                const lateral = Math.sin((forkDist / 120) * f.freq) * f.amp * (forkDist / f.maxD);
                const perp = f.angle + Math.PI / 2;
                const startX = originX + Math.cos(f.angle) * forkDist + Math.cos(perp) * lateral;
                const startY = originY + Math.sin(f.angle) * forkDist + Math.sin(perp) * lateral;

                const branchAngle = f.angle + (idx % 2 === 0 ? 0.42 : -0.42);
                const endX = startX + Math.cos(branchAngle) * forkLen;
                const endY = startY + Math.sin(branchAngle) * forkLen;

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.lineWidth = 12 * scale;
                ctx.strokeStyle = `rgba(0, 0, 0, ${lineAlpha * 0.85})`;
                ctx.stroke();
              }
            });
          });

          // 3. Draw luminous white-hot & mint tracing sparks & strokes over the leading edge
          ctx.globalCompositeOperation = "source-over";

          filaments.forEach((f) => {
            const currentDist = f.maxD * drawProg;
            if (currentDist <= 4) return;

            const steps = Math.max(6, Math.floor(currentDist / 12));
            const pts = [];
            for (let s = 0; s <= steps; s++) {
              const d = (s / steps) * currentDist;
              const lateral = Math.sin((d / 120) * f.freq) * f.amp * (d / f.maxD);
              const perpAngle = f.angle + Math.PI / 2;
              const px = originX + Math.cos(f.angle) * d + Math.cos(perpAngle) * lateral;
              const py = originY + Math.sin(f.angle) * d + Math.sin(perpAngle) * lateral;
              pts.push({ x: px, y: py });
            }

            // Outer mint glow stroke
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let p = 1; p < pts.length; p++) {
              ctx.lineTo(pts[p].x, pts[p].y);
            }
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = `rgba(95, 226, 145, ${lineAlpha * 0.85})`;
            ctx.stroke();

            // Inner white-hot filament core
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha * 0.95})`;
            ctx.stroke();

            // Leading spark head actively drawing the line
            if (drawProg < 0.98) {
              const tip = pts[pts.length - 1];
              ctx.beginPath();
              ctx.arc(tip.x, tip.y, 2.8, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${lineAlpha})`;
              ctx.fill();
            }
          });
        }
        ctx.restore();

        if (progress < 1.0) {
          animationId = requestAnimationFrame(animateTease);
        } else {
          // Dimmed back to black: 0.5 -> 1 (ready for click 2); 1.5 -> 2 (ready for click 3)
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
      // ✦ CLICK 3: Tracing lines race outward to screen borders, forming the entire painting
      const { originX, originY, renderW } = getWandScreenPos(canvas.width, canvas.height);
      const scale = renderW / 1672;

      const maxDist = Math.hypot(
        Math.max(originX, canvas.width - originX),
        Math.max(originY, canvas.height - originY)
      ) * 1.35;

      const numFilaments = 42;
      const filaments = [];
      for (let i = 0; i < numFilaments; i++) {
        const angle = (i / numFilaments) * Math.PI * 2;
        const speedVar = 1.0 + 0.08 * Math.sin(angle * 2 + 0.7) + 0.05 * Math.cos(angle * 3 - 0.4);
        const freq = 2.0 + (i % 3) * 1.2;
        const amp = (8 + (i % 4) * 4) * scale;
        filaments.push({ angle, speedVar, freq, amp });
      }

      const durationMs = 5800; // Crisp, engaging formation pacing
      const startTime = performance.now();

      const animateFormation = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / durationMs);

        // Center line formation (0-55% slow & detailed), outer sweep acceleration (55-100%)
        let ease;
        if (progress <= 0.55) {
          const u = progress / 0.55;
          ease = 0.50 * (0.35 * u + 0.65 * Math.pow(u, 1.5));
        } else {
          const v = (progress - 0.55) / 0.45;
          ease = 0.50 + 0.50 * (1.0 - Math.pow(1.0 - v, 2.2));
        }

        ctx.save();
        // 1. Redraw black sheet
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Carve out the formed painting along lines and connected web
        ctx.globalCompositeOperation = "destination-out";

        // Connected formation front
        const points = [];
        for (let i = 0; i < numFilaments; i++) {
          const f = filaments[i];
          const currentRadius = maxDist * ease * f.speedVar;
          const lateral = Math.sin((currentRadius / 120) * f.freq) * f.amp;
          const perpAngle = f.angle + Math.PI / 2;
          const px = originX + Math.cos(f.angle) * currentRadius + Math.cos(perpAngle) * lateral;
          const py = originY + Math.sin(f.angle) * currentRadius + Math.sin(perpAngle) * lateral;
          points.push({ x: px, y: py, r: currentRadius, angle: f.angle });
        }

        if (points.length > 2) {
          ctx.beginPath();
          const p0 = points[0];
          const pLast = points[points.length - 1];
          ctx.moveTo((p0.x + pLast.x) / 2, (p0.y + pLast.y) / 2);

          for (let i = 0; i < points.length; i++) {
            const curr = points[i];
            const next = points[(i + 1) % points.length];
            ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
          }
          ctx.closePath();
          ctx.fillStyle = "#000000";
          ctx.fill();
        }

        // Additional line-carving tendrils reaching ahead of main front
        filaments.forEach((f) => {
          const leadRadius = maxDist * Math.min(1.0, ease * 1.18) * f.speedVar;
          const baseRadius = maxDist * ease * f.speedVar;
          if (leadRadius > baseRadius) {
            ctx.beginPath();
            const steps = 8;
            for (let s = 0; s <= steps; s++) {
              const d = baseRadius + (s / steps) * (leadRadius - baseRadius);
              const lateral = Math.sin((d / 120) * f.freq) * f.amp;
              const perpAngle = f.angle + Math.PI / 2;
              const px = originX + Math.cos(f.angle) * d + Math.cos(perpAngle) * lateral;
              const py = originY + Math.sin(f.angle) * d + Math.sin(perpAngle) * lateral;
              if (s === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.lineWidth = 14 * scale;
            ctx.lineCap = "round";
            ctx.strokeStyle = "#000000";
            ctx.stroke();
          }
        });

        // 3. Draw luminous reverse-tracing lines and spark heads running along the perimeter
        if (progress < 0.98) {
          ctx.globalCompositeOperation = "source-over";

          // Leading sparks actively drawing into darkness
          points.forEach((p, idx) => {
            if (idx % 2 === 0) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = "#FFFFFF";
              ctx.fill();

              ctx.beginPath();
              ctx.arc(p.x, p.y, 5.0, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(95, 226, 145, 0.4)";
              ctx.fill();
            }
          });
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
