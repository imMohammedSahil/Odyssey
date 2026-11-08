import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode";

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
    min-height: 100vh;
    background-color: #192024;
    color: var(--parchment);
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
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
    background-color: #4C585E;
  }

  .pay-bg-vector {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
    filter: brightness(1.05) contrast(1.02);
  }

  /* Ambient light overlay for extra depth */
  .pay-bg-vignette {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 50% 25%, transparent 40%, rgba(13, 17, 20, 0.42) 85%);
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
    mix-blend-mode: multiply; /* Inks directly onto torn parchment */
    position: relative;
    opacity: 0.94;
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
  const [offeringAccepted, setOfferingAccepted] = useState(false);

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

  // Generate dynamic scannable UPI QR code SVG whenever total changes
  useEffect(() => {
    const upiUri = `upi://pay?pa=odysseycampus@upi&pn=Odyssey%20Campus%20Print&am=${total}&cu=INR`;
    QRCode.toString(upiUri, {
      type: "svg",
      margin: 0,
      color: {
        dark: "#0D0D0D",
        light: "#00000000", // Transparent background so parchment shows through
      },
    })
      .then((svgString) => {
        setQrSvg(svgString);
      })
      .catch((err) => {
        console.error("Failed to generate UPI QR code:", err);
      });
  }, [total]);

  const handlePaymentComplete = async () => {
    if (loading) return;
    setLoading(true);
    setOfferingAccepted(true);

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

      // Small dramatic delay for the ritual ceremony
      setTimeout(() => {
        navigate("/receipt");
      }, 1200);
    } catch (err) {
      console.error("Order completion failed", err);
      alert("Payment processing encountered an error. Please try again.");
      setLoading(false);
      setOfferingAccepted(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="pay-root">
        {/* 100% PURE VECTOR BACKDROP (NO RASTER ASSET) */}
        <div className="pay-bg-layer" aria-hidden="true">
          <img
            src="/graveyard-gate-landscape.svg?v=24"
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
            <span className="pay-nav-badge">GATEWAY</span>
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

              {/* 100% Pure Vector Grim Reaper Ritual Shrine SVG */}
              <img
                src="/grim-reaper-ritual-board.svg?v=5"
                alt="Grim Reaper Ritual Offering Notice Board"
                className="ritual-vector-svg"
              />

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

        {/* ── RITUAL OFFERING ACTIVE TRANSITION CEREMONY ── */}
        {offeringAccepted && (
          <div className="ritual-offering-overlay">
            <div className="ritual-spinner-sigil" />
            <div className="ritual-offering-text">TRIBUTE ACCEPTED</div>
            <div className="ritual-offering-sub">
              ENTERING THE SANCTUARY • GENERATING SACRED RECEIPT...
            </div>
          </div>
        )}
      </div>
    </>
  );
}
