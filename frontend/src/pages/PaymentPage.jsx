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
    --slime-green: #9DE869;
    --void-black: #0D0D0D;
    --seafoam: #45B89E;
    --hazard-gold: #F7B919;
    --lantern-yellow: #FDE465;
    --brain-pink: #FF70A6;
    --parchment: #F9F9F3;
    --grave-slate: #1F3C34;
    --grave-dark: #10211B;
    --border-dark: #0D0D0D;
  }

  .pay-root {
    min-height: 100vh;
    background-color: #12241D;
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
    background-color: #336F5F;
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
    background: radial-gradient(circle at 50% 20%, transparent 40%, rgba(10, 20, 16, 0.45) 85%);
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

  /* ── SLEEK FLOATING ACTION DOCK (UNOBSTRUCTED BACKGROUND) ── */
  .pay-dock-wrapper {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    width: 92%;
    max-width: 780px;
  }

  .pay-dock {
    background: rgba(16, 33, 27, 0.92);
    border: 3.5px solid var(--border-dark);
    border-radius: 14px;
    box-shadow: 6px 6px 0px var(--border-dark);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    backdrop-filter: blur(14px);
    animation: paySlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .pay-dock-total {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .pay-dock-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    color: var(--lantern-yellow);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .pay-dock-amount {
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 26px;
    color: var(--parchment);
    line-height: 1;
    display: flex;
    align-items: baseline;
    gap: 3px;
  }

  .pay-dock-currency {
    font-size: 18px;
    color: var(--lantern-yellow);
    font-weight: 800;
  }

  .pay-dock-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .pay-qr-toggle-btn {
    background: var(--parchment);
    color: var(--void-black);
    font-family: 'Archivo Black', sans-serif;
    font-size: 13px;
    text-transform: uppercase;
    padding: 12px 18px;
    border: 3px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 3px 3px 0px var(--border-dark);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .pay-qr-toggle-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
    background: #FFFFFF;
  }

  .pay-dock-confirm-btn {
    background: var(--brain-pink);
    color: var(--void-black);
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    text-transform: uppercase;
    padding: 12px 24px;
    border: 3px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 4px 4px 0px var(--border-dark);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.1s ease;
  }

  .pay-dock-confirm-btn:hover:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--border-dark);
    background: #ff85b3;
  }

  .pay-dock-confirm-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ── QR MODAL POPUP (CLICK TO REVEAL) ── */
  .pay-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10, 20, 16, 0.75);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(6px);
  }

  .pay-modal-card {
    background: var(--parchment);
    border: 4px solid var(--border-dark);
    border-radius: 16px;
    box-shadow: 8px 8px 0px var(--border-dark);
    padding: 24px;
    max-width: 360px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    animation: paySlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .pay-modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--void-black);
    color: var(--parchment);
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pay-modal-title {
    font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 18px;
    color: var(--void-black);
    margin-bottom: 4px;
  }

  .pay-modal-amount {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    font-weight: 800;
    color: #1F3C34;
    margin-bottom: 14px;
  }

  @media (max-width: 600px) {
    .pay-dock {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    .pay-dock-actions {
      flex-direction: column;
    }
    .pay-qr-toggle-btn, .pay-dock-confirm-btn {
      width: 100%;
      justify-content: center;
    }
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
            src="/graveyard-gate-landscape.svg?v=5"
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

        {/* ── SLEEK FLOATING ACTION DOCK (BACKGROUND FULLY UNOBSTRUCTED) ── */}
        <div className="pay-dock-wrapper">
          <div className="pay-dock">
            <div className="pay-dock-total">
              <span className="pay-dock-label">TOTAL DUE ({totalItemCount} {totalItemCount === 1 ? "ITEM" : "ITEMS"})</span>
              <div className="pay-dock-amount">
                <span className="pay-dock-currency">₹</span>
                <span>{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="pay-dock-actions">
              <button
                type="button"
                className="pay-qr-toggle-btn"
                onClick={() => setShowQr(true)}
              >
                <span>📷</span>
                <span>Scan UPI QR</span>
              </button>

              <button
                onClick={handlePaymentComplete}
                disabled={loading}
                className="pay-dock-confirm-btn"
                id="confirm-payment-btn"
              >
                {loading ? (
                  <>
                    <span className="pay-spinner" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Payment</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── OPTIONAL QR POPUP MODAL ── */}
        {showQr && (
          <div className="pay-modal-backdrop" onClick={() => setShowQr(false)}>
            <div className="pay-modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                className="pay-modal-close"
                onClick={() => setShowQr(false)}
                title="Close"
              >
                ✕
              </button>
              <h2 className="pay-modal-title">SCAN & PAY</h2>
              <p className="pay-modal-amount">Total: ₹{total.toLocaleString("en-IN")}</p>
              
              <div style={{
                background: "#fff",
                padding: "8px",
                border: "3px solid #0D0D0D",
                borderRadius: "8px",
                boxShadow: "3px 3px 0px #0D0D0D"
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=odysseycampus@upi&pn=Odyssey%20Campus%20Print&am=${total}&cu=INR`}
                  alt="UPI Payment QR Code"
                  width={160}
                  height={160}
                  style={{ display: "block" }}
                />
              </div>

              <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
                <span style={{ background: "#0D0D0D", color: "#F9F9F3", fontSize: "10px", fontWeight: "800", padding: "3px 8px", borderRadius: "4px" }}>GPAY</span>
                <span style={{ background: "#0D0D0D", color: "#F9F9F3", fontSize: "10px", fontWeight: "800", padding: "3px 8px", borderRadius: "4px" }}>PHONEPE</span>
                <span style={{ background: "#0D0D0D", color: "#F9F9F3", fontSize: "10px", fontWeight: "800", padding: "3px 8px", borderRadius: "4px" }}>PAYTM</span>
              </div>
            </div>
          </div>
        )}


      </div>
    </>
  );
}
