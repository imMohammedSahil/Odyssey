import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode";
import OccultCursorFumes from "../components/OccultCursorFumes";
import { baseAudio, paymentAudio } from "../utils/audioManager";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&family=JetBrains+Mono:wght@500;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --slime-green: #A6C5BB;
    --void-black: #0D0D0D;
    --seafoam: #7C9890;
    --hazard-gold: #FF482B;
    --lantern-yellow: #FFA84A;
    --brain-pink: #FF3B2B;
    --parchment: #F2F5F4;
    --grave-slate: #2B363C;
    --grave-dark: #192024;
    --border-dark: #0D0D0D;
    --occult-red: #D93B2F;
    --emerald-eye: #38E54D;
  }

  .pay-root {
    height: 100vh;
    height: 100dvh;
    max-height: 100vh;
    width: 100vw;
    background-color: #192024;
    color: var(--parchment);
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow: hidden;
    overscroll-behavior: none;
    touch-action: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* ── 100% PURE VECTOR BACKDROP ── */
  .pay-bg-layer {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    background: linear-gradient(180deg, #3B464E 0%, #2A343B 40%, #151C20 80%, #0D0D0D 100%);
    contain: strict;
  }

  .pay-bg-vector {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
    filter: brightness(0.96) contrast(1.04);
  }

  /* Ambient light overlay for extra depth */
  .pay-bg-vignette {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 50% 25%, transparent 35%, rgba(9, 12, 15, 0.55) 88%);
    pointer-events: none;
    z-index: 1;
  }

  /* ── TOP HEADER / NAVIGATION ── */
  .pay-header-bar {
    width: 100%;
    padding: 16px 4%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 50;
    flex-shrink: 0;
  }

  .pay-nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .pay-nav-logo {
    font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 22px;
    color: var(--parchment);
    letter-spacing: 1.5px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-shadow: 3px 3px 0px var(--border-dark);
  }

  .pay-nav-badge {
    font-family: 'Archivo Black', sans-serif;
    background: var(--hazard-gold);
    color: var(--void-black);
    font-size: 11px;
    letter-spacing: 1px;
    padding: 3px 8px;
    border: 2px solid var(--border-dark);
    border-radius: 4px;
    box-shadow: 2px 2px 0px var(--border-dark);
    text-transform: uppercase;
  }

  .pay-header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .pay-cart-summary-pill {
    background: rgba(20, 27, 32, 0.88);
    color: var(--parchment);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    padding: 8px 14px;
    border: 2.5px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 2px 2px 0px var(--border-dark);
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(8px);
  }

  .pay-cart-total-badge {
    color: var(--hazard-gold);
    font-weight: 900;
  }

  .pay-btn-pill {
    background: var(--parchment);
    color: var(--void-black);
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    text-decoration: none;
    padding: 8px 16px;
    border: 3px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 3px 3px 0px var(--border-dark);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .pay-btn-pill:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  /* ── GROUNDED RITUAL SHRINE (MINIMIZED & PLACED BESIDE THE PATH) ── */
  .pay-center-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end; /* Grounded directly on the cobblestone path */
    position: relative;
    z-index: 20;
    padding: 0 0 3.5vh max(24px, calc(37% - 150px)); /* Positions center of 300px shrine at exactly ~37% of screen width */
    pointer-events: none;
  }

  .ritual-shrine-stage {
    position: relative;
    width: 100%;
    max-width: 300px; /* Minimized to match reference scale */
    aspect-ratio: 935 / 1024;
    max-height: 46vh;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin-bottom: -16px; /* Sits naturally on the road */
    animation: shrineEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
    pointer-events: auto;
  }

  @keyframes shrineEntrance {
    0% {
      opacity: 0;
      transform: translateY(18px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0px) scale(1);
    }
  }

  /* Grounded wrapper (stable and planted beside the path - no hovering or floating) */
  .ritual-floating-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  /* Deep cobblestone ground contact shadow directly under base boulders */
  .ritual-ground-shadow {
    position: absolute;
    bottom: 12px;
    left: -4%;
    right: -4%;
    height: 28px;
    background: radial-gradient(ellipse at 50% 50%, rgba(6, 10, 13, 0.96) 0%, rgba(12, 18, 22, 0.7) 45%, rgba(20, 30, 36, 0.25) 65%, transparent 80%);
    pointer-events: none;
    z-index: -1;
    filter: blur(4px);
  }

  /* Soft ground mist drift across bottom rocks for seamless atmospheric blend */
  .ritual-ground-mist {
    position: absolute;
    bottom: 2px;
    left: -8%;
    right: -8%;
    height: 32px;
    background: radial-gradient(ellipse at 50% 65%, rgba(65, 84, 90, 0.38) 0%, rgba(35, 50, 56, 0.2) 50%, transparent 75%);
    pointer-events: none;
    z-index: 25;
    filter: blur(5px);
  }

  /* The 100% Pure Vector SVG Asset - Harmonized with Environment */
  .ritual-vector-svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 6px 14px rgba(6, 11, 14, 0.65)) drop-shadow(0 1px 3px rgba(10, 16, 20, 0.4));
    user-select: none;
    -webkit-user-drag: none;
  }

  /* ── STATIC UPI QR CODE INKED ON PARCHMENT ── */
  .ritual-qr-interactive-anchor {
    position: absolute;
    top: 37.89%;
    left: 39.36%;
    width: 22.89%;
    height: 19.92%;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: default;
    user-select: none;
  }

  /* Scannable Real UPI QR Container */
  .ritual-live-qr-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    mix-blend-mode: multiply; /* Inks directly onto torn antique parchment */
    position: relative;
    opacity: 0.90;
  }

  .ritual-live-qr-box svg {
    width: 96%;
    height: 96%;
    object-fit: contain;
    shape-rendering: crispEdges;
  }

  /* Secondary Click Zone: Carved Plaque (Static, no hover highlight) */
  .ritual-plaque-click-zone {
    position: absolute;
    top: 61.5%;
    left: 23.5%;
    width: 55.5%;
    height: 15.5%;
    cursor: default;
    z-index: 30;
  }

  /* ── RITUAL OFFERING ACTIVE TRANSITION OVERLAY ── */
  .ritual-offering-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 14, 16, 0.82);
    backdrop-filter: blur(12px);
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    animation: fadeIn 0.25s ease both;
  }

  .ritual-spinner-sigil {
    width: 64px;
    height: 64px;
    border: 5px solid rgba(217, 59, 47, 0.2);
    border-top-color: var(--hazard-gold);
    border-right-color: var(--emerald-eye);
    border-radius: 50%;
    animation: rotateAura 0.8s linear infinite;
  }

  .ritual-offering-text {
    font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 24px;
    color: var(--parchment);
    letter-spacing: 1px;
    text-shadow: 3px 3px 0px var(--border-dark);
    text-align: center;
  }

  .ritual-offering-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--slime-green);
    letter-spacing: 0.5px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes paySlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    .pay-center-container {
      align-items: center;
      padding: 0 16px 20px;
    }
    .ritual-shrine-stage {
      max-width: 280px;
      max-height: 54vh;
      margin-bottom: -10px;
    }
  }
`;

export default function PaymentPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [qrSvg, setQrSvg] = useState("");
  const [offeringAccepted] = useState(false);
  const [sessionId, setSessionId] = useState(() => "ritual_" + Date.now() + "_" + Math.floor(1000 + Math.random() * 9000));
  const [offerUrl, setOfferUrl] = useState("");
  const [localIp, setLocalIp] = useState("192.168.0.101");
  const [reaperDrain, setReaperDrain] = useState(0);

  // ✦ AUDIO ROUTING: Instantly kill starting loop & guarantee dark evil ambient plays exclusively
  useEffect(() => {
    baseAudio.stop();
    paymentAudio.startPayment();
  }, []);

  // Sync cursor proximity drain to modulate Grim Reaper eyes
  useEffect(() => {
    const onDrain = (e) => {
      if (typeof e.detail?.drain === "number") {
        setReaperDrain(e.detail.drain);
      }
    };
    window.addEventListener("odyssey_cursor_drain", onDrain);
    return () => window.removeEventListener("odyssey_cursor_drain", onDrain);
  }, []);

  // Lock body/window scrolling so page and elements stay strictly fixed in place
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  // Compute live cart total
  const calculatedTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // If user opened /payment directly without items, provide demo items so page is never broken
  const isDemo = cartItems.length === 0;
  const effectiveItems = isDemo
    ? [
      { name: "Campus Print & Binding (24 Pgs)", price: 60, quantity: 1 },
      { name: "A5 Hardcover Grid Journal", price: 90, quantity: 1 }
    ]
    : cartItems;

  const total = isDemo ? 150 : calculatedTotal;
  const totalItemCount = effectiveItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

  const detectedIp = localIp || (window.location.hostname === "localhost" ? "192.168.0.101" : window.location.hostname);
  const targetUrl = offerUrl || `http://${detectedIp}:3000/ritual-offering?session=${sessionId}&total=${total}`;

  // Mark altar theme unlocked for credits reveal
  useEffect(() => {
    try {
      localStorage.setItem("odyssey_unlocked_altar_theme", "true");
    } catch (_) { }
  }, []);

  // 1. Register ritual session with backend & retrieve local network IP for mobile scanning
  useEffect(() => {
    let isMounted = true;

    axios
      .post("http://localhost:5000/api/ritual/session", {
        total,
        items: effectiveItems,
      })
      .then((res) => {
        if (isMounted && res.data) {
          if (res.data.sessionId) setSessionId(res.data.sessionId);
          if (res.data.offerUrl) setOfferUrl(res.data.offerUrl);
          if (res.data.localIp) setLocalIp(res.data.localIp);
        }
      })
      .catch(() => {
        const fallbackUrl = `http://${detectedIp}:3000/ritual-offering?session=${sessionId}&total=${total}`;
        if (isMounted) {
          setOfferUrl(fallbackUrl);
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  // 2. Generate dynamic scannable mobile QR code SVG pointing to targetUrl
  useEffect(() => {
    QRCode.toString(targetUrl, {
      type: "svg",
      margin: 0,
      color: {
        dark: "#141414", // Deep rich gothic charcoal ink
        light: "#00000000", // Transparent background so antique parchment shows through
      },
    })
      .then((svgString) => {
        setQrSvg(svgString);
      })
      .catch((err) => {
        console.error("Failed to generate ritual QR code:", err);
      });
  }, [targetUrl]);

  // 3. Real-time synchronization: Laptop listens for phone ritual completion
  useEffect(() => {
    if (loading || offeringAccepted) return;

    let isPolling = true;

    // A. Backend API polling
    const interval = setInterval(async () => {
      if (!isPolling) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/ritual/status/${sessionId}`);
        if (res.data && res.data.status === "completed") {
          isPolling = false;
          handlePaymentComplete();
        }
      } catch (err) {
        // Silently retry polling
      }
    }, 1200);

    // B. LocalStorage listener for same-device cross-tab testing
    const handleStorageChange = (e) => {
      if (e.key === "odyssey_ritual_completed_" + sessionId && e.newValue === "true") {
        isPolling = false;
        handlePaymentComplete();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // C. BroadcastChannel listener for instant cross-tab sync
    let bc;
    try {
      bc = new BroadcastChannel("odyssey_ritual");
      bc.onmessage = (event) => {
        if (event.data && event.data.sessionId === sessionId) {
          isPolling = false;
          handlePaymentComplete();
        }
      };
    } catch (e) { }

    return () => {
      isPolling = false;
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
      if (bc) bc.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, loading, offeringAccepted]);

  const handlePaymentComplete = async () => {
    if (loading) return;
    setLoading(true);

    try {
      let mongoOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

      // Attempt backend order creation
      try {
        const res = await axios.post("http://localhost:5000/api/orders", {
          stationeryItems: effectiveItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
          })),
          status: "pending",
        });

        if (res.data && res.data._id) {
          mongoOrderId = res.data._id;
        }
      } catch (backendErr) {
        console.warn("Backend order creation warning (using simulated order ID):", backendErr.message);
      }

      const receiptPayload = {
        orderId: mongoOrderId,
        items: effectiveItems,
        total,
        date: new Date().toLocaleString(),
        status: "CONFIRMED",
      };

      // Store in odysseyReceipt for ReceiptPage
      localStorage.setItem("odysseyReceipt", JSON.stringify(receiptPayload));

      // Append to orders history
      const existingOrders = JSON.parse(localStorage.getItem("odysseyOrders")) || [];
      existingOrders.unshift(receiptPayload);
      localStorage.setItem("odysseyOrders", JSON.stringify(existingOrders));

      if (!isDemo) {
        clearCart();
      }

      navigate("/receipt");
    } catch (err) {
      console.error("Order completion failed", err);
      alert("Payment processing encountered an error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="pay-root">
        {/* Dynamic Occult Black Glowing Fumes & Reaper Proximity Life Drain */}
        <OccultCursorFumes />

        {/* 100% PURE VECTOR BACKDROP (NO RASTER ASSET) */}
        <div className="pay-bg-layer" aria-hidden="true">
          <img
            src="/graveyard-gate-landscape.svg?v=33"
            alt="Checkout Gate Pure Vector Landscape"
            className="pay-bg-vector"
          />
        </div>
        <div className="pay-bg-vignette" aria-hidden="true" />

        {/* ── TOP NAV BAR ── */}
        <header className="pay-header-bar">
          <Link to="/student" className="pay-nav-brand">
            <span className="pay-nav-logo">
              ODYSSEY
            </span>
            <span className="pay-nav-badge">OFFERING</span>
          </Link>

          <div className="pay-header-actions">
            <div className="pay-cart-summary-pill">
              <span>{totalItemCount} Items</span>
              <span>•</span>
              <span className="pay-cart-total-badge">₹{total}</span>
            </div>

            <Link to="/cart" className="pay-btn-pill">
              <span>←</span>
              <span>Back To Cart</span>
            </Link>
          </div>
        </header>

        {/* ── GROUNDED RITUAL SHRINE (GRIM REAPER & NOTICE BOARD ON PATH) ── */}
        <main className="pay-center-container">
          <div className="ritual-shrine-stage">
            <div className="ritual-floating-wrapper">
              {/* Cobblestone Ground Contact Shadow */}
              <div className="ritual-ground-shadow" aria-hidden="true" />

              {/* 100% Pure Vector Grim Reaper Ritual Shrine SVG with Pure Crimson Red Lantern */}
              <img
                src="/grim-reaper-ritual-board.svg?v=27"
                alt="Grim Reaper Ritual Offering Notice Board"
                className="ritual-vector-svg"
              />

              {/* Dynamic Evil Red Eyes Overlay - Crisp Pure Red Fill (No out-of-border glow or bleed) */}
              <svg
                viewBox="0 0 935 1024"
                className="reaper-red-eyes-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  opacity: Math.min(1, reaperDrain * 1.5),
                  transition: "opacity 0.12s ease",
                  zIndex: 22,
                }}
                aria-hidden="true"
              >
                <g>
                  <path d="M 455.0,102.0 Q 454.0,102.0 450.0,105.0 L 446.0,108.0 L 446.0,107.0 L 446.0,106.0 L 445.0,107.0 L 444.0,108.0 L 444.5,108.5 L 445.0,109.0 L 444.0,110.0 L 443.0,111.0 L 442.5,111.0 L 442.0,111.0 L 441.0,113.5 Q 440.0,116.0 440.0,119.0 Q 440.0,122.0 441.5,123.5 L 443.0,125.0 L 443.0,124.0 Q 443.0,123.0 444.5,121.5 Q 446.0,120.0 446.5,118.5 Q 447.0,117.0 447.5,116.5 Q 448.0,116.0 449.0,115.5 Q 450.0,115.0 451.0,115.0 Q 452.0,115.0 456.0,112.5 L 460.0,110.0 L 459.5,109.0 Q 459.0,108.0 458.0,107.0 L 457.0,106.0 L 456.5,106.5 L 456.0,107.0 L 455.5,106.0 L 455.0,105.0 L 455.5,103.5 L 456.0,102.0 L 455.0,102.0 Z M 479.0,110.0 Q 479.0,111.0 480.0,112.5 L 481.0,114.0 L 482.5,113.0 Q 484.0,112.0 486.5,112.0 Q 489.0,112.0 490.5,111.0 Q 492.0,110.0 493.0,110.0 Q 494.0,110.0 495.0,109.5 L 496.0,109.0 L 497.0,110.0 L 498.0,111.0 L 495.5,107.0 Q 493.0,103.0 490.5,100.5 L 488.0,98.0 L 486.0,98.5 L 484.0,99.0 L 481.5,104.0 Q 479.0,109.0 479.0,110.0 Z" fill="#6E0A05" />
                  <path d="M 452.5,103.5 Q 450.0,105.0 447.5,107.0 Q 445.0,109.0 443.0,111.0 L 441.0,113.0 L 441.0,115.0 L 441.0,117.0 L 440.5,117.5 L 440.0,118.0 L 440.0,119.5 Q 440.0,121.0 442.0,123.5 Q 444.0,126.0 445.5,126.5 L 447.0,127.0 L 448.5,126.0 Q 450.0,125.0 451.5,123.5 Q 453.0,122.0 453.5,122.0 L 454.0,122.0 L 457.5,118.0 L 461.0,114.0 L 460.5,112.5 Q 460.0,111.0 458.5,108.5 L 457.0,106.0 L 456.0,107.5 L 455.0,109.0 L 455.0,105.5 L 455.0,102.0 L 452.5,103.5 Z M 487.5,99.5 L 487.0,101.0 L 485.5,100.5 L 484.0,100.0 L 483.0,101.5 Q 482.0,103.0 481.5,105.0 Q 481.0,107.0 480.0,108.0 L 479.0,109.0 L 479.0,110.0 Q 479.0,111.0 482.5,114.5 Q 486.0,118.0 488.5,119.5 Q 491.0,121.0 492.0,121.0 L 493.0,121.0 L 494.0,120.0 Q 495.0,119.0 496.0,117.0 L 497.0,115.0 L 497.5,116.5 L 498.0,118.0 L 497.5,116.0 Q 497.0,114.0 497.5,112.5 L 498.0,111.0 L 496.0,108.0 Q 494.0,105.0 492.0,103.0 L 490.0,101.0 L 490.0,100.5 L 490.0,100.0 L 489.0,99.0 L 488.0,98.0 L 487.5,99.5 Z" fill="#8F0F07" />
                  <path d="M 442.0,123.5 Q 444.0,126.0 445.0,126.5 L 446.0,127.0 L 447.0,126.5 Q 448.0,126.0 451.5,123.5 Q 455.0,121.0 457.0,118.5 Q 459.0,116.0 459.5,115.0 Q 460.0,114.0 459.5,112.0 L 459.0,110.0 L 455.5,112.0 Q 452.0,114.0 449.0,114.0 L 446.0,114.0 L 446.5,113.0 L 447.0,112.0 L 446.0,111.0 L 445.0,110.0 L 443.5,111.0 Q 442.0,112.0 441.5,113.0 Q 441.0,114.0 440.5,116.5 Q 440.0,119.0 440.0,120.0 Q 440.0,121.0 442.0,123.5 Z M 481.5,105.0 L 479.0,110.0 L 479.5,111.0 Q 480.0,112.0 482.5,114.5 Q 485.0,117.0 489.0,118.5 Q 493.0,120.0 493.5,120.0 L 494.0,120.0 L 496.0,116.0 L 498.0,112.0 L 496.0,108.5 Q 494.0,105.0 493.0,104.0 L 492.0,103.0 L 490.5,103.0 Q 489.0,103.0 486.5,103.5 L 484.0,104.0 L 484.0,102.0 L 484.0,100.0 L 481.5,105.0 Z" fill="#B8150B" />
                </g>
              </svg>

              {/* Soft Atmospheric Ground Mist Feather */}
              <div className="ritual-ground-mist" aria-hidden="true" />

              {/* Scannable Static UPI QR Code inked onto Parchment */}
              <div
                className="ritual-qr-interactive-anchor"
                onClick={handlePaymentComplete}
                role="img"
                aria-label={`UPI QR Code for payment of ₹${total}`}
              >
                <div
                  className="ritual-live-qr-box"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              </div>

              {/* Carved Plaque Secondary Click Zone ('MAKE YOUR OFFERING') */}
              <div
                className="ritual-plaque-click-zone"
                onClick={handlePaymentComplete}
                role="button"
                tabIndex={0}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
