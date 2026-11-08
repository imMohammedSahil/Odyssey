import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Plus+Jakarta+Sans:wght@700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

  body, html {
    margin: 0;
    padding: 0;
    background: #000000;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  .rcpt-root {
    min-height: 100vh;
    width: 100vw;
    background: #000000;
    position: relative;
    overflow-x: hidden;
    overflow-y: hidden;
    cursor: pointer;
    user-select: none;
  }

  .rcpt-root.revealed {
    overflow-y: auto;
    cursor: default;
  }

  /* ── 100% PURE VECTOR BACKDROP ── */
  .rcpt-bg-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
    background: #000000;
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

  /* Hero Section Fold (100vh) */
  .rcpt-hero-fold {
    position: relative;
    min-height: 100vh;
    width: 100%;
    z-index: 5;
  }

  /* Smooth outward environmental floor fade to black on scroll */
  .rcpt-hero-fold::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 380px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(1, 6, 3, 0.15) 25%,
      rgba(1, 6, 3, 0.50) 55%,
      rgba(0, 0, 0, 0.85) 80%,
      #000000 100%
    );
    pointer-events: none;
    z-index: 6;
  }

  /* ── ORGANIC PAINT CANVAS MASK (Controls black sheet & reveal waves) ── */
  .rcpt-paint-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    pointer-events: none;
    display: block;
  }

  /* Ambient depth vignette (disabled to keep pristine solid contrast) */
  .rcpt-bg-vignette {
    display: none;
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

  /* ── BELOW-THE-FOLD COVENANT RECORD SECTION ── */
  .rcpt-record-section {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 24px 100px;
    background: #000000;
    border-top: none;
  }

  .rcpt-card {
    max-width: 620px;
    width: 100%;
    background: rgba(4, 18, 11, 0.95);
    border: 2px solid #5fe291;
    border-radius: 20px;
    padding: 36px 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(95, 226, 145, 0.15);
    color: #e8fff0;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .rcpt-card-header {
    text-align: center;
    margin-bottom: 24px;
    border-bottom: 1px dashed rgba(95, 226, 145, 0.25);
    padding-bottom: 20px;
  }

  .rcpt-badge {
    display: inline-block;
    padding: 5px 14px;
    background: rgba(95, 226, 145, 0.12);
    border: 1px solid #5fe291;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: #5fe291;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .rcpt-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: 26px;
    font-weight: 900;
    letter-spacing: 0.05em;
    color: #ffffff;
    margin: 0 0 6px 0;
  }

  .rcpt-subtitle {
    font-size: 12.5px;
    color: #8da496;
    margin: 0;
  }

  .rcpt-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 22px;
    background: rgba(2, 10, 6, 0.6);
    border: 1px solid rgba(95, 226, 145, 0.2);
    border-radius: 12px;
    padding: 16px 18px;
  }

  .rcpt-item-label {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #608570;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .rcpt-item-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13.5px;
    font-weight: 700;
    color: #e8fff0;
    display: flex;
    align-items: center;
  }

  .rcpt-copy-pill {
    margin-left: 8px;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 6px;
    background: rgba(95, 226, 145, 0.15);
    border: 1px solid #5fe291;
    color: #5fe291;
    cursor: pointer;
    font-weight: 800;
    transition: all 0.15s ease;
  }

  .rcpt-copy-pill:hover {
    background: #5fe291;
    color: #020b06;
  }

  .rcpt-manifest-header {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8da496;
    margin-bottom: 10px;
  }

  .rcpt-items-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 22px;
    padding-bottom: 18px;
    border-bottom: 1px dashed rgba(95, 226, 145, 0.25);
  }

  .rcpt-item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(2, 12, 7, 0.7);
    border: 1px solid rgba(95, 226, 145, 0.18);
    border-radius: 10px;
    padding: 12px 16px;
  }

  .rcpt-item-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .rcpt-item-name {
    font-size: 13px;
    font-weight: 800;
    color: #e8fff0;
  }

  .rcpt-item-specs {
    font-size: 11px;
    font-weight: 600;
    color: #7b9e8b;
  }

  .rcpt-item-cost {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 800;
    color: #5fe291;
    text-align: right;
  }

  .rcpt-total-box {
    background: rgba(2, 10, 6, 0.85);
    border: 1.5px solid #5fe291;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .rcpt-total-label {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #a4c9b3;
  }

  .rcpt-total-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 26px;
    font-weight: 900;
    color: #5fe291;
  }

  .rcpt-actions {
    display: flex;
    gap: 12px;
  }

  .rcpt-btn-primary {
    flex: 1;
    padding: 13px 20px;
    background: #5fe291;
    color: #020c06;
    border: none;
    border-radius: 10px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(95, 226, 145, 0.3);
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .rcpt-btn-primary:hover {
    background: #7dffac;
    transform: translateY(-2px);
  }
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(95, 226, 145, 0.3);
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .rcpt-btn-primary:hover {
    background: #7ef2aa;
    transform: translateY(-2px);
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

  const originX = offsetX + (910 / 1672) * renderW;
  const originY = offsetY + (331 / 941) * renderH;
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
  const [copied, setCopied] = useState(false);

  // Load real order data from localStorage with graceful fallback
  const [receiptData] = useState(() => {
    try {
      const stored = localStorage.getItem("odysseyReceipt");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          orderId: parsed.orderId ? (parsed.orderId.startsWith("#") ? parsed.orderId : `#${parsed.orderId}`) : "#ORD-9428-CAMPUS",
          items: parsed.items && parsed.items.length > 0 ? parsed.items : [
            { name: "Odyssey Bond Paper Ream (75 GSM)", quantity: 1, price: 100, specs: "500 Sheets • Crisp White" },
            { name: "Toxic Neon Highlighters (Pack of 3)", quantity: 1, price: 50, specs: "Emerald • Amber • Magenta" }
          ],
          total: parsed.total || 150,
          date: parsed.date || new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          status: "IN PRINT QUEUE",
          pickupCounter: "Basecamp Counter A (Library Vault)",
          estimatedTime: "Ready in ~10 mins",
          paymentMethod: "UPI Scanned (odysseycampus@upi)"
        };
      }
    } catch (e) {}
    return {
      orderId: "#ORD-9428-CAMPUS",
      items: [
        { name: "Odyssey Bond Paper Ream (75 GSM)", quantity: 1, price: 100, specs: "500 Sheets • Crisp White" },
        { name: "Toxic Neon Highlighters (Pack of 3)", quantity: 1, price: 50, specs: "Emerald • Amber • Magenta" }
      ],
      total: 150,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "IN PRINT QUEUE",
      pickupCounter: "Basecamp Counter A (Library Vault)",
      estimatedTime: "Ready in ~10 mins",
      paymentMethod: "UPI Scanned (odysseycampus@upi)"
    };
  });

  // Awwwards cursor follower
  const cursorRef = useRef(null);
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Canvas ref for both Click 1 tease and Click 2 paint spill
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const bgImgRef = useRef(null);

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
      // Solid black sheet & pre-blur background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (bgImgRef.current) {
        bgImgRef.current.style.filter = "blur(24px)";
      }
      return () => window.removeEventListener("resize", resizeCanvas);
    }

    if (stage === 0.5 || stage === 1.5) {
      // ✦ CLICK 1 & CLICK 2: The artwork reveals and unblurs simultaneously!
      const { originX, originY, scale } = getWandScreenPos(canvas.width, canvas.height);
      const isSecondClick = stage === 1.5;
      const targetReach = (isSecondClick ? 150 : 92) * scale;
      const startTime = performance.now();
      const durationMs = isSecondClick ? 1000 : 880;

      const animateTease = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / durationMs);

        // Wave expands out (0-40%), breathes softly (40-62%), then dissolves back to black (62-100%)
        let drawProg, waveAlpha;
        if (progress < 0.40) {
          drawProg = progress / 0.40;
          drawProg = 1 - Math.pow(1 - drawProg, 2.0);
          waveAlpha = 1.0;
        } else if (progress < 0.62) {
          drawProg = 1.0;
          waveAlpha = 1.0 - 0.05 * Math.sin(((progress - 0.40) / 0.22) * Math.PI);
        } else {
          drawProg = 1.0;
          waveAlpha = Math.max(0, (1.0 - progress) / 0.38);
        }

        // Dynamically unblur the background image as the reveal expands!
        if (bgImgRef.current) {
          const blurVal = Math.max(0, (1 - drawProg) * 24 + (1 - waveAlpha) * 24);
          bgImgRef.current.style.filter = blurVal > 0.3 ? `blur(${blurVal.toFixed(1)}px)` : "none";
        }

        const currentR = targetReach * drawProg;

        ctx.save();
        // 1. Black sheet
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (waveAlpha > 0 && currentR > 4) {
          ctx.globalCompositeOperation = "destination-out";

          // Smooth outward radial falloff with zero harsh circular perimeter
          const waveGrad = ctx.createRadialGradient(
            originX, originY, 0,
            originX, originY, currentR
          );
          waveGrad.addColorStop(0, `rgba(0, 0, 0, ${waveAlpha})`);
          waveGrad.addColorStop(0.35, `rgba(0, 0, 0, ${waveAlpha * 0.92})`);
          waveGrad.addColorStop(0.60, `rgba(0, 0, 0, ${waveAlpha * 0.65})`);
          waveGrad.addColorStop(0.80, `rgba(0, 0, 0, ${waveAlpha * 0.30})`);
          waveGrad.addColorStop(0.94, `rgba(0, 0, 0, ${waveAlpha * 0.08})`);
          waveGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = waveGrad;
          ctx.beginPath();
          ctx.arc(originX, originY, currentR, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (progress < 1.0) {
          animationId = requestAnimationFrame(animateTease);
        } else {
          if (bgImgRef.current) bgImgRef.current.style.filter = "blur(24px)";
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
      // ✦ CLICK 3: The whole background unblurs in real-time as the wave reveals the page!
      const { originX, originY, scale } = getWandScreenPos(canvas.width, canvas.height);
      const maxCanvasDist = Math.hypot(
        Math.max(originX, canvas.width - originX),
        Math.max(originY, canvas.height - originY)
      );

      const durationMs = 2600; // Crisp cinematic pacing
      const startTime = performance.now();

      const animateFormation = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / durationMs);

        // Dynamically unblur the background image from 24px down to 0px!
        if (bgImgRef.current) {
          const blurVal = Math.max(0, (1 - progress) * 24);
          bgImgRef.current.style.filter = blurVal > 0.2 ? `blur(${blurVal.toFixed(1)}px)` : "none";
        }

        let ease;
        if (progress <= 0.45) {
          const u = progress / 0.45;
          ease = 0.38 * Math.pow(u, 1.4);
        } else {
          const v = (progress - 0.45) / 0.55;
          ease = 0.38 + 0.62 * (1.0 - Math.pow(1.0 - v, 2.0));
        }

        const waveR = maxCanvasDist * ease;

        ctx.save();
        // 1. Redraw black sheet
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Carve out to reveal pure, crystal-clear artwork with smooth outward leading edge
        ctx.globalCompositeOperation = "destination-out";

        if (waveR > 4) {
          const featherW = Math.min(80 * scale, waveR * 0.35);
          const waveGrad = ctx.createRadialGradient(
            originX, originY, Math.max(0, waveR - featherW),
            originX, originY, waveR
          );
          waveGrad.addColorStop(0, "#000000"); // 100% revealed artwork
          waveGrad.addColorStop(0.40, "rgba(0, 0, 0, 0.85)");
          waveGrad.addColorStop(0.70, "rgba(0, 0, 0, 0.40)");
          waveGrad.addColorStop(0.90, "rgba(0, 0, 0, 0.10)");
          waveGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = waveGrad;
          ctx.beginPath();
          ctx.arc(originX, originY, waveR, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        if (progress < 1.0) {
          animationId = requestAnimationFrame(animateFormation);
        } else {
          // Painting completely revealed — 100% crisp, zero blur!
          if (bgImgRef.current) bgImgRef.current.style.filter = "none";
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
      <div className={`rcpt-root ${stage >= 3 ? "revealed" : ""}`} onClick={handleScreenClick}>
        
        {/* HERO FOLD (100vh) */}
        <div className="rcpt-hero-fold">
          {/* 100% PURE VECTOR BACKDROP (Unblurs dynamically on reveal) */}
          <div className="rcpt-bg-layer" aria-hidden="true">
            <img
              ref={bgImgRef}
              src="/wizard-enchanted-greenlight.svg"
              alt="Enchanted Greenlight Vector Canvas"
              className="rcpt-bg-vector"
            />
          </div>

          {/* Dynamic Organic Paint Spill Canvas */}
          {stage < 4 && <canvas ref={canvasRef} className="rcpt-paint-canvas" aria-hidden="true" />}

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

        {/* BELOW-THE-FOLD ORDER RECEIPT SECTION (Scroll Down Target) */}
        {stage >= 3 && (
          <section className="rcpt-record-section">
            <div className="rcpt-card">
              <div className="rcpt-card-header">
                <span className="rcpt-badge">OFFICIAL DISPATCH DOSSIER</span>
                <h1 className="rcpt-title">CAMPUS ORDER RECEIPT</h1>
                <p className="rcpt-subtitle">Odyssey Campus Print Sanctum • Payment Verified &amp; Sequenced</p>
              </div>

              <div className="rcpt-grid">
                <div>
                  <div className="rcpt-item-label">Order Reference</div>
                  <div className="rcpt-item-val">
                    {receiptData.orderId}
                    <button
                      className="rcpt-copy-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(receiptData.orderId);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1600);
                      }}
                    >
                      {copied ? "COPIED!" : "COPY"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="rcpt-item-label">Sanctum Status</div>
                  <div className="rcpt-item-val" style={{ color: "#5fe291" }}>
                    🟢 {receiptData.status}
                  </div>
                </div>
                <div>
                  <div className="rcpt-item-label">Pickup Counter</div>
                  <div className="rcpt-item-val" style={{ fontSize: "12.5px" }}>
                    {receiptData.pickupCounter}
                  </div>
                </div>
                <div>
                  <div className="rcpt-item-label">Recorded At</div>
                  <div className="rcpt-item-val" style={{ fontSize: "12.5px" }}>
                    {receiptData.date}
                  </div>
                </div>
              </div>

              {/* Itemized Manifest */}
              <div className="rcpt-manifest-header">Order Manifest ({receiptData.items.length} Items)</div>
              <div className="rcpt-items-list">
                {receiptData.items.map((item, idx) => (
                  <div key={idx} className="rcpt-item-row">
                    <div className="rcpt-item-info">
                      <span className="rcpt-item-name">{item.name || item.title}</span>
                      <span className="rcpt-item-specs">
                        Qty: {item.quantity || item.qty || 1} {item.specs ? `• ${item.specs}` : ""}
                      </span>
                    </div>
                    <span className="rcpt-item-cost">
                      ₹{((item.price || 0) * (item.quantity || item.qty || 1)).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="rcpt-total-box">
                <div>
                  <div className="rcpt-total-label">Total Offering Paid</div>
                  <div style={{ fontSize: "11px", color: "#8da496", marginTop: "2px" }}>
                    {receiptData.paymentMethod}
                  </div>
                </div>
                <span className="rcpt-total-val">₹{receiptData.total}</span>
              </div>

              {/* Action Buttons */}
              <div className="rcpt-actions">
                <button
                  className="rcpt-btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.print();
                  }}
                >
                  PRINT RECEIPT / PDF
                </button>
                <button
                  className="rcpt-btn-primary"
                  style={{ background: "#0e3520", color: "#e8fff0", border: "1.5px solid #5fe291" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/student");
                  }}
                >
                  ← RETURN TO BASECAMP
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
