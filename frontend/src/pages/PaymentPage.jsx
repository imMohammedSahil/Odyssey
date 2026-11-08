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

  /* ── CENTRAL RITUAL SHRINE (GRIM REAPER & BOARD) ── */
  .pay-center-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 20;
    padding: 10px 16px 24px;
  }

  .ritual-shrine-stage {
    position: relative;
    width: 100%;
    max-width: 600px;
    aspect-ratio: 935 / 1024;
    max-height: 78vh;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: shrineEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes shrineEntrance {
    0% {
      opacity: 0;
      transform: translateY(24px) scale(0.97);
    }
    100% {
      opacity: 1;
      transform: translateY(0px) scale(1);
    }
  }

  /* Idle floating & breathing animation */
  .ritual-floating-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: shrineIdleFloat 6s ease-in-out infinite;
  }

  @keyframes shrineIdleFloat {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  /* Soft ground shadow cast onto cobblestone road */
  .ritual-ground-shadow {
    position: absolute;
    bottom: -6px;
    left: 12%;
    right: 12%;
    height: 38px;
    background: radial-gradient(ellipse at 50% 50%, rgba(13, 15, 18, 0.75) 0%, rgba(13, 15, 18, 0.3) 50%, transparent 75%);
    pointer-events: none;
    z-index: -1;
  }

  /* The 100% Pure Vector SVG Asset */
  .ritual-vector-svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.55));
    user-select: none;
    -webkit-user-drag: none;
  }

  /* ── INTERACTIVE DYNAMIC UPI QR SLOT ── */
  .ritual-qr-interactive-anchor {
    position: absolute;
    top: 37.89%;
    left: 39.36%;
    width: 22.89%;
    height: 19.92%;
    cursor: pointer;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s ease;
  }

  .ritual-qr-interactive-anchor:hover {
    transform: scale(1.035);
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
    opacity: 0.96;
    transition: opacity 0.2s ease;
  }

  .ritual-live-qr-box svg {
    width: 96%;
    height: 96%;
    object-fit: contain;
    shape-rendering: crispEdges;
  }

  /* Occult aura pulse on hover */
  .ritual-qr-hover-aura {
    position: absolute;
    inset: -8%;
    border-radius: 50%;
    border: 2px dashed rgba(217, 59, 47, 0);
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .ritual-qr-interactive-anchor:hover .ritual-qr-hover-aura {
    border-color: rgba(217, 59, 47, 0.7);
    box-shadow: 0 0 20px rgba(217, 59, 47, 0.45);
    animation: rotateAura 10s linear infinite;
  }

  @keyframes rotateAura {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Floating Tooltip Pill */
  .ritual-qr-tooltip {
    position: absolute;
    bottom: -32px;
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: rgba(13, 13, 13, 0.92);
    color: var(--hazard-gold);
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 4px 10px;
    border: 1.5px solid var(--hazard-gold);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.6);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 40;
  }

  .ritual-qr-interactive-anchor:hover .ritual-qr-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0px);
  }

  /* Secondary Click Zone: Carved Plaque */
  .ritual-plaque-click-zone {
    position: absolute;
    top: 61.5%;
    left: 23.5%;
    width: 55.5%;
    height: 15.5%;
    cursor: pointer;
    z-index: 30;
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  .ritual-plaque-click-zone:hover {
    background: rgba(217, 59, 47, 0.08);
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
    .ritual-shrine-stage { max-height: 68vh; }
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

        {/* ── CENTRAL FLOATING RITUAL SHRINE (GRIM REAPER & NOTICE BOARD) ── */}
        <main className="pay-center-container">
          <div className="ritual-shrine-stage">
            <div className="ritual-floating-wrapper">
              {/* Soft Cobblestone Ground Shadow */}
              <div className="ritual-ground-shadow" aria-hidden="true" />

              {/* 100% Pure Vector Grim Reaper Ritual Shrine SVG */}
              <img
                src="/grim-reaper-ritual-board.svg?v=1"
                alt="Grim Reaper Ritual Offering Notice Board"
                className="ritual-vector-svg"
              />

              {/* Scannable Real Dynamic UPI QR Code mounted on Parchment */}
              <div
                className="ritual-qr-interactive-anchor"
                onClick={handlePaymentComplete}
                title={`Click to complete ritual offering of ₹${total}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handlePaymentComplete();
                  }
                }}
              >
                <div className="ritual-qr-hover-aura" aria-hidden="true" />
                <div
                  className="ritual-live-qr-box"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                  aria-label={`UPI QR Code for payment of ₹${total}`}
                />
                <div className="ritual-qr-tooltip">
                  ✦ Click To Offer Tribute • ₹{total} ✦
                </div>
              </div>

              {/* Carved Plaque Secondary Click Zone ('MAKE YOUR OFFERING') */}
              <div
                className="ritual-plaque-click-zone"
                onClick={handlePaymentComplete}
                title={`Click to complete ritual offering of ₹${total}`}
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
