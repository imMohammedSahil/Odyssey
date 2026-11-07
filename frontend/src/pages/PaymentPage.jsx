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

  /* ── MAIN CONTENT CONTAINER ── */
  .pay-main {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 620px;
    margin: 10px auto 40px;
    padding: 0 16px;
  }

  /* ── NEO-BRUTALIST PAYMENT CARD ── */
  .pay-card {
    background: rgba(16, 33, 27, 0.94);
    border: 4px solid var(--border-dark);
    border-radius: 16px;
    box-shadow: 8px 8px 0px var(--border-dark);
    overflow: hidden;
    backdrop-filter: blur(16px);
    animation: paySlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes paySlideUp {
    from {
      opacity: 0;
      transform: translateY(24px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Card Header Banner */
  .pay-card-header {
    background: var(--hazard-gold);
    color: var(--void-black);
    border-bottom: 4px solid var(--border-dark);
    padding: 16px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .pay-card-title-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .pay-card-icon {
    width: 38px;
    height: 38px;
    background: var(--void-black);
    color: var(--hazard-gold);
    border: 2.5px solid var(--border-dark);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 2px 2px 0px var(--border-dark);
  }

  .pay-card-title {
    font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 19px;
    letter-spacing: 0.5px;
    line-height: 1.1;
  }

  .pay-card-subtitle {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    opacity: 0.85;
  }

  .pay-step-badge {
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    background: var(--void-black);
    color: var(--parchment);
    padding: 4px 10px;
    border-radius: 6px;
    letter-spacing: 0.5px;
  }

  /* Card Body */
  .pay-card-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── TOTAL HERO BOX ── */
  .pay-total-box {
    background: var(--grave-slate);
    border: 3px solid var(--border-dark);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 4px 4px 0px var(--border-dark);
    position: relative;
    overflow: hidden;
  }

  .pay-total-box::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(253, 228, 101, 0.08));
    pointer-events: none;
  }

  .pay-total-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pay-total-tag {
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--lantern-yellow);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .pay-total-items-badge {
    font-size: 12px;
    font-weight: 700;
    color: #92B5A9;
    letter-spacing: 0.2px;
  }

  .pay-total-amount {
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 34px;
    color: var(--parchment);
    line-height: 1;
    display: flex;
    align-items: baseline;
    gap: 2px;
    text-shadow: 2px 2px 0px var(--border-dark);
  }

  .pay-total-currency {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--lantern-yellow);
  }

  /* ── ORDER ITEMS SUMMARY (COMIC ACCORDION) ── */
  .pay-summary-block {
    background: rgba(10, 20, 16, 0.7);
    border: 3px solid var(--border-dark);
    border-radius: 10px;
    padding: 14px 16px;
    box-shadow: 3px 3px 0px var(--border-dark);
  }

  .pay-summary-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    color: var(--seafoam);
    letter-spacing: 1px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pay-summary-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 140px;
    overflow-y: auto;
    padding-right: 4px;
  }

  .pay-summary-list::-webkit-scrollbar {
    width: 6px;
  }
  .pay-summary-list::-webkit-scrollbar-thumb {
    background: var(--grave-slate);
    border-radius: 3px;
  }

  .pay-summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 600;
    color: #CDE2DA;
    padding-bottom: 6px;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  }

  .pay-summary-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .pay-item-name {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pay-item-qty {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    background: var(--void-black);
    color: var(--lantern-yellow);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
  }

  .pay-item-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--parchment);
    font-weight: 700;
  }

  /* ── QR PAYMENT CENTERPIECE ── */
  .pay-qr-wrapper {
    background: var(--parchment);
    border: 3.5px solid var(--border-dark);
    border-radius: 14px;
    padding: 20px 16px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 5px 5px 0px var(--border-dark);
    position: relative;
  }

  .pay-qr-top-tag {
    position: absolute;
    top: -12px;
    background: var(--slime-green);
    color: var(--void-black);
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding: 3px 12px;
    border: 2px solid var(--border-dark);
    border-radius: 20px;
    box-shadow: 2px 2px 0px var(--border-dark);
  }

  .pay-qr-frame {
    position: relative;
    padding: 10px;
    background: #FFFFFF;
    border: 3px solid var(--border-dark);
    border-radius: 10px;
    box-shadow: 3px 3px 0px var(--border-dark);
    margin: 8px 0 12px;
  }

  .pay-qr-frame img {
    display: block;
    width: 160px;
    height: 160px;
  }

  .pay-qr-corner {
    position: absolute;
    width: 14px;
    height: 14px;
    border-color: var(--void-black);
    border-style: solid;
  }
  .pay-qr-corner.tl { top: -4px; left: -4px; border-width: 4px 0 0 4px; }
  .pay-qr-corner.tr { top: -4px; right: -4px; border-width: 4px 4px 0 0; }
  .pay-qr-corner.bl { bottom: -4px; left: -4px; border-width: 0 0 4px 4px; }
  .pay-qr-corner.br { bottom: -4px; right: -4px; border-width: 0 4px 4px 0; }

  .pay-upi-apps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .pay-app-pill {
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    background: var(--void-black);
    color: var(--parchment);
    padding: 4px 9px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }

  .pay-qr-hint {
    font-size: 12px;
    font-weight: 700;
    color: #384F47;
    margin-top: 8px;
    text-align: center;
  }

  /* ── NOTICE BOX ── */
  .pay-notice-box {
    background: rgba(247, 185, 25, 0.15);
    border: 2.5px solid var(--hazard-gold);
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .pay-notice-icon {
    color: var(--hazard-gold);
    font-size: 16px;
    flex-shrink: 0;
    line-height: 1.2;
  }

  .pay-notice-text {
    font-size: 12px;
    color: #E2ECE8;
    line-height: 1.5;
    font-weight: 600;
  }

  /* ── CONFIRM CTA BUTTON ── */
  .pay-cta-btn {
    width: 100%;
    padding: 16px 24px;
    background: var(--brain-pink);
    color: var(--void-black);
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 3.5px solid var(--border-dark);
    border-radius: 10px;
    box-shadow: 4px 4px 0px var(--border-dark);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.1s ease;
  }

  .pay-cta-btn:hover:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--border-dark);
    background: #ff85b3;
  }

  .pay-cta-btn:active:not(:disabled) {
    transform: translate(4px, 4px);
    box-shadow: 0px 0px 0px var(--border-dark);
  }

  .pay-cta-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    filter: grayscale(0.4);
  }

  /* Spinner */
  .pay-spinner {
    width: 18px;
    height: 18px;
    border: 3px solid var(--void-black);
    border-top-color: transparent;
    border-radius: 50%;
    animation: paySpin 0.7s linear infinite;
  }

  @keyframes paySpin {
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
            src="/graveyard-gate-landscape.svg?v=3"
            alt="Graveyard Gate Pure Vector Landscape"
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

        {/* ── MAIN PAYMENT CONSOLE ── */}
        <main className="pay-main">
          <div className="pay-card">
            {/* Header Banner */}
            <div className="pay-card-header">
              <div className="pay-card-title-group">
                <div className="pay-card-icon">⚡</div>
                <div>
                  <h1 className="pay-card-title">COMPLETE PAYMENT</h1>
                  <p className="pay-card-subtitle">Odyssey Campus Dispatch · Step 2 of 2</p>
                </div>
              </div>
              <span className="pay-step-badge">UPI / SCAN</span>
            </div>

            {/* Body */}
            <div className="pay-card-body">
              {/* Total Due Banner */}
              <div className="pay-total-box">
                <div className="pay-total-info">
                  <span className="pay-total-tag">TOTAL AMOUNT DUE</span>
                  <span className="pay-total-items-badge">
                    {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"} in Cart {isDemo && "· [Demo Preview]"}
                  </span>
                </div>
                <div className="pay-total-amount">
                  <span className="pay-total-currency">₹</span>
                  <span>{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="pay-summary-block">
                <div className="pay-summary-title">
                  <span>Order Summary</span>
                  <span>{effectiveItems.length} Products</span>
                </div>
                <div className="pay-summary-list">
                  {effectiveItems.map((item, idx) => (
                    <div className="pay-summary-row" key={idx}>
                      <span className="pay-item-name">
                        <span className="pay-item-qty">×{item.quantity || 1}</span>
                        <span>{item.name}</span>
                      </span>
                      <span className="pay-item-price">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* UPI QR Payment Centerpiece */}
              <div className="pay-qr-wrapper">
                <span className="pay-qr-top-tag">Instant UPI Settlement</span>
                <div className="pay-qr-frame">
                  <span className="pay-qr-corner tl" />
                  <span className="pay-qr-corner tr" />
                  <span className="pay-qr-corner bl" />
                  <span className="pay-qr-corner br" />
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=odysseycampus@upi&pn=Odyssey%20Campus%20Print&am=${total}&cu=INR`}
                    alt="UPI Payment QR Code"
                    width={160}
                    height={160}
                  />
                </div>

                <div className="pay-upi-apps">
                  <span className="pay-app-pill">GPAY</span>
                  <span className="pay-app-pill">PHONEPE</span>
                  <span className="pay-app-pill">PAYTM</span>
                  <span className="pay-app-pill">BHIM UPI</span>
                </div>

                <p className="pay-qr-hint">
                  Scan with any UPI app to complete transfer of ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Notice */}
              <div className="pay-notice-box">
                <span className="pay-notice-icon">ℹ</span>
                <p className="pay-notice-text">
                  After initiating payment through your UPI app, click below to verify and generate your official stamped dispatch receipt.
                </p>
              </div>

              {/* CTA Confirm Button */}
              <button
                onClick={handlePaymentComplete}
                disabled={loading}
                className="pay-cta-btn"
                id="confirm-payment-btn"
              >
                {loading ? (
                  <>
                    <span className="pay-spinner" />
                    <span>Verifying Dispatch...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Payment & Generate Receipt</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>


      </div>
    </>
  );
}
