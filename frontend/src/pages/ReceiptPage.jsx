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

  /* ── BELOW-THE-FOLD RAVEN RECEIPT SCROLL SECTION ── */
  .rcpt-record-section {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 140px 16px 120px;
    background: #000000;
    cursor: default;
  }

  .rcpt-scroll-stage {
    position: relative;
    width: 100%;
    max-width: 580px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.95));
    user-select: text !important;
    -webkit-user-select: text !important;
  }

  .rcpt-scroll-head {
    position: relative;
    width: 100%;
    aspect-ratio: 1024 / 470;
    pointer-events: none;
    user-select: none;
  }

  .rcpt-scroll-head img,
  .rcpt-scroll-foot img {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
    user-select: none;
  }

  .rcpt-scroll-body {
    position: relative;
    width: 100%;
    background: url('/scroll-body.png') 0 0 / 100% 100% no-repeat;
    padding: 0 19%;
    display: flex;
    flex-direction: column;
    gap: 13px;
    user-select: text !important;
    -webkit-user-select: text !important;
    font-family: 'Cinzel', 'Plus Jakarta Sans', Georgia, serif;
    color: #121c16;
  }

  .rcpt-scroll-body * {
    user-select: text !important;
    -webkit-user-select: text !important;
  }

  .rcpt-scroll-foot {
    position: relative;
    width: 100%;
    aspect-ratio: 1024 / 235;
    pointer-events: none;
    user-select: none;
  }

  .rcpt-sc-title {
    text-align: center;
    font-family: 'Cinzel', serif;
    font-size: clamp(14px, 2.5vw, 19px);
    font-weight: 900;
    letter-spacing: 0.05em;
    color: #121c16;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 2px;
  }

  .rcpt-sc-meta-list {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .rcpt-sc-meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .rcpt-sc-ribbon {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    font-family: 'Cinzel', serif;
    font-style: italic;
    font-size: clamp(9px, 1.45vw, 11.5px);
    font-weight: 800;
    color: #d6eac7;
    background: #141f17;
    border-radius: 3px;
    letter-spacing: 0.02em;
    clip-path: polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%);
    box-shadow: 1px 2px 0px rgba(0, 0, 0, 0.25);
    white-space: nowrap;
  }

  .rcpt-sc-val {
    display: flex;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(9px, 1.45vw, 11.5px);
    font-weight: 700;
    color: #121c16;
    word-break: break-all;
    text-align: right;
  }

  .rcpt-sc-status-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 10px;
    font-family: 'Cinzel', serif;
    font-size: clamp(10px, 1.6vw, 12.5px);
    font-weight: 900;
    color: #1b4728;
    background: rgba(40, 110, 60, 0.08);
    border: 1.5px solid #1b4728;
    border-radius: 4px;
    letter-spacing: 0.06em;
  }

  .rcpt-sc-copy-btn {
    margin-left: 6px;
    padding: 1px 6px;
    border-radius: 4px;
    background: #1b4728;
    color: #d6eac7;
    border: none;
    font-size: 9px;
    font-weight: 800;
    cursor: pointer !important;
    user-select: none !important;
    transition: transform 0.1s ease;
  }

  .rcpt-sc-copy-btn:hover {
    transform: scale(1.08);
  }

  .rcpt-sc-manifest-header {
    display: flex;
    justify-content: center;
    margin-top: 4px;
  }

  .rcpt-sc-manifest-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 12px 14px;
    gap: 10px;
    border: 1.5px solid #142018;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.03);
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
  }

  .rcpt-sc-item-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    line-height: 1.25;
  }

  .rcpt-sc-item-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(10px, 1.6vw, 12.5px);
    font-weight: 800;
    color: #121c16;
  }

  .rcpt-sc-item-qty {
    font-size: clamp(8.5px, 1.3vw, 10.5px);
    font-weight: 600;
    color: #425848;
    font-style: italic;
  }

  .rcpt-sc-item-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(12px, 1.9vw, 15px);
    font-weight: 900;
    color: #121c16;
    margin-left: 10px;
  }

  .rcpt-sc-total-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 2px;
  }

  .rcpt-sc-total-val {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px 14px;
    font-family: 'Archivo Black', 'JetBrains Mono', sans-serif;
    font-size: clamp(17px, 2.9vw, 24px);
    font-weight: 900;
    color: #eaf8dd;
    background: #141f17;
    border: 1.5px solid #142018;
    border-radius: 6px;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.25);
    letter-spacing: -0.02em;
  }

  .rcpt-sc-upi {
    text-align: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-style: italic;
    font-size: clamp(9px, 1.4vw, 11px);
    font-weight: 600;
    color: #121c16;
  }

  .rcpt-sc-btn-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 4px;
  }

  .rcpt-sc-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 9px 8px;
    font-family: 'Cinzel', serif;
    font-weight: 900;
    letter-spacing: 0.06em;
    font-size: clamp(10.5px, 1.7vw, 13px);
    color: #121c16;
    background: #9abf8b;
    border: 2px solid #142018;
    border-radius: 7px;
    box-shadow: 2px 3px 0px #142018;
    cursor: pointer !important;
    user-select: none !important;
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .rcpt-sc-btn:hover {
    background: #a9cf9a;
    transform: translateY(-1.5px);
  }

  .rcpt-sc-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.15);
  }

  .rcpt-sc-btn:active {
    transform: translateY(1px);
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

        {/* BELOW-THE-FOLD RAVEN RECEIPT SCROLL SECTION */}
        {stage >= 3 && (
          <section className="rcpt-record-section">
            <div className="rcpt-scroll-stage" onClick={(e) => e.stopPropagation()}>
              {/* 1. SCROLL TOP: Raven & Top Rod */}
              <div className="rcpt-scroll-head">
                <img
                  src="/scroll-head.png"
                  alt="Raven Perched on Scroll"
                />
              </div>

              {/* 2. SCROLL MIDDLE: Dynamic Parchment Body that stretches naturally with items */}
              <div className="rcpt-scroll-body">
                {/* Title */}
                <div className="rcpt-sc-title">
                  ✦ CAMPUS ORDER RECEIPT ✦
                </div>

                {/* Metadata List */}
                <div className="rcpt-sc-meta-list">
                  <div className="rcpt-sc-meta-row">
                    <span className="rcpt-sc-ribbon">Order Reference</span>
                    <span className="rcpt-sc-val">
                      <span>{receiptData.orderId}</span>
                      <button
                        className="rcpt-sc-copy-btn"
                        title="Copy Order ID"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(receiptData.orderId);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1600);
                        }}
                      >
                        {copied ? "COPIED" : "COPY"}
                      </button>
                    </span>
                  </div>

                  <div className="rcpt-sc-meta-row">
                    <span className="rcpt-sc-ribbon">Sanctum Status</span>
                    <span className="rcpt-sc-status-box">{receiptData.status}</span>
                  </div>

                  <div className="rcpt-sc-meta-row">
                    <span className="rcpt-sc-ribbon">Pickup Counter</span>
                    <span className="rcpt-sc-val">{receiptData.pickupCounter}</span>
                  </div>

                  <div className="rcpt-sc-meta-row">
                    <span className="rcpt-sc-ribbon">Recorded At</span>
                    <span className="rcpt-sc-val">{receiptData.date}</span>
                  </div>
                </div>

                {/* Manifest Header */}
                <div className="rcpt-sc-manifest-header">
                  <span className="rcpt-sc-ribbon">
                    Order Manifest ({receiptData.items.length} Items)
                  </span>
                </div>

                {/* Manifest Items Box - Expands dynamically without inner scrollbar! */}
                <div className="rcpt-sc-manifest-box">
                  {receiptData.items.map((item, idx) => (
                    <div key={idx} className="rcpt-sc-item-row">
                      <div>
                        <div className="rcpt-sc-item-title">{item.name || item.title}</div>
                        <div className="rcpt-sc-item-qty">
                          Qty: {item.quantity || item.qty || 1} {item.specs ? `• ${item.specs}` : ""}
                        </div>
                      </div>
                      <div className="rcpt-sc-item-price">
                        ₹{((item.price || 0) * (item.quantity || item.qty || 1)).toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Offering Paid */}
                <div className="rcpt-sc-total-row">
                  <span className="rcpt-sc-ribbon" style={{ fontSize: "clamp(10px, 1.7vw, 13px)" }}>
                    Total Offering Paid
                  </span>
                  <span className="rcpt-sc-total-val">
                    ₹{receiptData.total}
                  </span>
                </div>

                {/* UPI Subtext */}
                <div className="rcpt-sc-upi">
                  {receiptData.paymentMethod}
                </div>

                {/* Action Buttons */}
                <div className="rcpt-sc-btn-row">
                  <button
                    className="rcpt-sc-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.print();
                    }}
                  >
                    PRINT PDF
                  </button>
                  <button
                    className="rcpt-sc-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/student");
                    }}
                  >
                    RETURN TO BASECAMP
                  </button>
                </div>
              </div>

              {/* 3. SCROLL FOOT: Bottom paper tear, bottom rod, cuffs & smoke */}
              <div className="rcpt-scroll-foot">
                <img
                  src="/scroll-foot.png"
                  alt="Scroll Rod Footer"
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
