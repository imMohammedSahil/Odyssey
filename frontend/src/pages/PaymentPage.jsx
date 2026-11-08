import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
    background: radial-gradient(circle at 50% 20%, transparent 45%, rgba(13, 17, 20, 0.38) 90%);
    pointer-events: none;
    z-index: 1;
  }

  /* ── TOP HEADER / NAVIGATION ── */
  .pay-header-bar {
    width: 100%;
    padding: 18px 4%;
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

  .pay-secure-pill {
    background: rgba(16, 33, 27, 0.85);
    color: var(--slime-green);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    padding: 7px 12px;
    border: 2.5px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 2px 2px 0px var(--border-dark);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .pay-secure-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--slime-green);
    box-shadow: 0 0 8px var(--slime-green);
    animation: pulseDot 1.5s infinite;
  }

  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }

  /* ── CENTRAL PAYMENT & QR TERMINAL BOX ── */
  .pay-center-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 50;
    padding: 24px 20px 40px;
  }

  .pay-central-card {
    background: rgba(20, 27, 32, 0.93);
    border: 4px solid var(--border-dark);
    border-radius: 18px;
    box-shadow: 8px 8px 0px var(--border-dark);
    width: 100%;
    max-width: 440px;
    padding: 24px 26px 22px;
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: paySlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .pay-card-top-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .pay-terminal-badge {
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--lantern-yellow);
    text-transform: uppercase;
  }

  .pay-card-title {
    font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 24px;
    color: var(--parchment);
    letter-spacing: 0.5px;
    text-shadow: 2px 2px 0px var(--border-dark);
    margin-bottom: 2px;
    text-align: center;
  }

  .pay-card-subtitle {
    font-size: 12px;
    font-weight: 700;
    color: var(--slime-green);
    margin-bottom: 14px;
    letter-spacing: 0.4px;
    text-align: center;
  }

  .pay-dossier-box {
    width: 100%;
    background: #172126;
    border: 3px solid var(--border-dark);
    border-radius: 12px;
    box-shadow: 4px 4px 0px var(--border-dark);
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .pay-dossier-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .pay-dossier-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    color: #8C9EA7;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .pay-dossier-count {
    font-size: 12px;
    font-weight: 800;
    color: var(--parchment);
  }

  .pay-dossier-price {
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 26px;
    color: var(--hazard-gold);
    display: flex;
    align-items: baseline;
    gap: 2px;
  }

  .pay-dossier-currency {
    font-size: 18px;
    color: var(--lantern-yellow);
  }

  .pay-qr-frame {
    background: #FFFFFF;
    border: 3.5px solid var(--border-dark);
    border-radius: 14px;
    box-shadow: 5px 5px 0px var(--border-dark);
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }

  .pay-apps-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 16px;
  }

  .pay-app-pill {
    background: var(--void-black);
    color: var(--parchment);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    letter-spacing: 0.5px;
  }

  .pay-cta-btn {
    width: 100%;
    background: var(--brain-pink);
    color: var(--void-black);
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 14px 20px;
    border: 3.5px solid var(--border-dark);
    border-radius: 12px;
    box-shadow: 4px 4px 0px var(--border-dark);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.1s ease;
  }

  .pay-cta-btn:hover:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--border-dark);
    background: #FF5445;
  }

  .pay-cta-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .pay-spinner {
    width: 16px;
    height: 16px;
    border: 3px solid var(--void-black);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── FOOTER BAR ── */
  .pay-footer-strip {
    background: rgba(10, 20, 16, 0.88);
    border-top: 3px solid var(--border-dark);
    padding: 12px 4%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    font-size: 11px;
    font-weight: 700;
    color: #7DA697;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    position: relative;
    z-index: 50;
  }

  .pay-footer-tag {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  @media (max-width: 600px) {
    .pay-card-body { padding: 18px; gap: 16px; }
    .pay-total-amount { font-size: 28px; }
    .pay-card-title { font-size: 17px; }
    .pay-header-bar { padding: 14px 4%; }
  }
`;

export default function PaymentPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);

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

  const handlePaymentComplete = async () => {
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
    } finally {
      setLoading(false);
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
            <Link to="/cart" className="pay-btn-pill">
              <span>←</span>
              <span>Back To Cart</span>
            </Link>
          </div>
        </header>

        {/* ── CENTRAL PAYMENT & QR TERMINAL BOX (REMOVED FOR USER'S NEW IDEA) ── */}
        <main className="pay-center-container">
          {/* Box removed temporarily per user request */}
        </main>


      </div>
    </>
  );
}
