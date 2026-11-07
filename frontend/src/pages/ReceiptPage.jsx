import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Titan+One&display=swap');

  :root {
    --void-black: #0D0D0D;
    --toxic-lime: #B9F40D;
    --toxic-lime-hover: #CEFF1E;
    --hot-pink: #F72678;
    --hot-pink-deep: #D91C65;
    --caution-yellow: #F9EC1B;
    --caution-yellow-hover: #FFF133;
    --parchment: #FCEDD3;
    --parchment-shadow: #E8D2B0;
    --blood-crimson: #C82136;
    --blood-crimson-bg: rgba(200, 33, 54, 0.08);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .rcpt-page-shell {
    min-height: 100vh;
    width: 100vw;
    background-color: #0A0D05;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--void-black);
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 24px 16px 60px;
  }

  /* 100% PURE VECTOR BACKDROP */
  .rcpt-bg-layer {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    background-color: #0A0D05;
  }

  .rcpt-bg-vector {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
    display: block;
  }

  /* FLOATING TOP ACTION BAR */
  .rcpt-header-bar {
    width: 100%;
    max-width: 900px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 50;
    margin-bottom: 20px;
    gap: 12px;
  }

  .rcpt-action-pill {
    background: var(--void-black);
    color: #FFFFFF;
    border: 3.5px solid var(--void-black);
    border-radius: 9999px;
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 12.5px;
    padding: 9px 20px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.45);
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
  }

  .rcpt-action-pill:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.6);
    background: #1A1A1A;
  }

  .rcpt-action-pill:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.6);
  }

  .rcpt-action-pill.accent-lime {
    background: var(--toxic-lime);
    color: var(--void-black);
  }
  .rcpt-action-pill.accent-lime:hover {
    background: var(--toxic-lime-hover);
  }

  .rcpt-action-pill.accent-yellow {
    background: var(--caution-yellow);
    color: var(--void-black);
  }
  .rcpt-action-pill.accent-yellow:hover {
    background: var(--caution-yellow-hover);
  }

  /* MAIN RECEIPT WRAPPER */
  .rcpt-center-stage {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 660px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* TORN PARCHMENT RECEIPT CARD */
  .rcpt-torn-paper {
    width: 100%;
    background-color: var(--parchment);
    border: 3.5px solid var(--void-black);
    position: relative;
    box-shadow: 10px 12px 0px rgba(0, 0, 0, 0.75);
    padding: 34px 38px 24px;
    overflow: hidden;
    clip-path: polygon(
      0% 2%, 3% 0%, 8% 2.5%, 15% 0.5%, 22% 2%, 30% 0.8%, 38% 2.2%, 46% 0.4%, 55% 2.5%, 63% 0.8%, 72% 2%, 80% 0.5%, 88% 2.3%, 95% 0.6%, 100% 2.5%,
      98.5% 8%, 100% 16%, 98% 25%, 99.5% 34%, 97.5% 43%, 99% 52%, 97.8% 62%, 99.6% 71%, 98% 80%, 99.4% 88%, 97.8% 96%,
      95% 98.5%, 88% 97%, 80% 99.5%, 72% 98%, 64% 99.2%, 55% 97.5%, 47% 99.6%, 39% 97.8%, 30% 99.4%, 22% 97.5%, 14% 99.2%, 7% 97.4%, 0% 99%,
      1.8% 92%, 0.4% 83%, 2.2% 74%, 0.6% 65%, 2% 56%, 0.5% 47%, 2.4% 38%, 0.8% 29%, 2.2% 20%, 0.5% 11%
    );
  }

  /* VINTAGE HALFTONE TEXTURE OVERLAY */
  .rcpt-torn-paper::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.08;
    background-image: radial-gradient(#000 1.2px, transparent 1.2px);
    background-size: 8px 8px;
    z-index: 1;
  }

  /* TOP HEADER ROW: TITLE + OUTBREAK STAMP */
  .rcpt-header-zone {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 22px;
    z-index: 2;
  }

  /* BRUSH TITLE GRAPHIC */
  .rcpt-brush-title-container {
    position: relative;
    display: inline-block;
    padding: 10px 18px 12px 14px;
    transform: rotate(-2deg);
  }

  .rcpt-brush-backdrop {
    position: absolute;
    inset: 0;
    background: var(--void-black);
    clip-path: polygon(
      0% 12%, 8% 4%, 25% 10%, 45% 2%, 70% 8%, 92% 3%, 100% 16%,
      97% 45%, 100% 75%, 95% 92%, 82% 96%, 60% 90%, 40% 98%, 18% 91%, 0% 96%,
      3% 60%, 0% 35%
    );
    z-index: 0;
  }

  .rcpt-title-text-payment {
    position: relative;
    z-index: 1;
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 27px;
    color: #FFFFFF;
    letter-spacing: 0.04em;
    line-height: 1;
    text-transform: uppercase;
    display: block;
    transform: skewX(-7deg);
    text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
  }

  .rcpt-title-text-receipt {
    position: relative;
    z-index: 1;
    font-family: 'Titan One', 'Archivo Black', sans-serif;
    font-size: 42px;
    color: var(--hot-pink);
    letter-spacing: 0.02em;
    line-height: 0.95;
    text-transform: uppercase;
    display: block;
    margin-top: 2px;
    transform: skewX(-7deg);
    -webkit-text-stroke: 1.8px var(--void-black);
    text-shadow: 3px 3px 0px var(--void-black);
  }

  .rcpt-title-yellow-streak {
    position: absolute;
    bottom: -3px;
    left: 20%;
    width: 65%;
    height: 8px;
    background: var(--caution-yellow);
    transform: skewX(-15deg);
    z-index: 2;
    clip-path: polygon(0 40%, 15% 0%, 85% 20%, 100% 80%, 75% 100%, 15% 80%);
  }

  /* OUTBREAK CONFIRMED RED RUBBER STAMP */
  .rcpt-outbreak-stamp {
    width: 104px;
    height: 104px;
    border: 3.5px dashed var(--blood-crimson);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform: rotate(11deg);
    color: var(--blood-crimson);
    padding: 6px;
    position: relative;
    user-select: none;
    opacity: 0.92;
    box-shadow: inset 0 0 0 2px var(--blood-crimson);
    flex-shrink: 0;
  }

  .rcpt-stamp-biohazard {
    width: 28px;
    height: 28px;
    fill: currentColor;
    margin-bottom: 2px;
  }

  .rcpt-stamp-text {
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    line-height: 1.05;
    text-align: center;
    letter-spacing: 0.05em;
  }

  .rcpt-stamp-star {
    font-size: 11px;
    margin-top: 1px;
    line-height: 1;
  }

  /* PAYMENT SUCCESSFUL STATUS PILL */
  .rcpt-status-pill {
    background: var(--toxic-lime);
    border: 3.2px solid var(--void-black);
    border-radius: 9999px;
    display: flex;
    align-items: center;
    padding: 7px 18px 7px 10px;
    gap: 12px;
    margin-bottom: 24px;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.4);
    position: relative;
    z-index: 2;
  }

  .rcpt-status-check-circle {
    width: 32px;
    height: 32px;
    background: var(--void-black);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rcpt-status-check-circle svg {
    width: 18px;
    height: 18px;
    color: var(--toxic-lime);
    stroke-width: 3.5;
  }

  .rcpt-status-title {
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 15.5px;
    font-style: italic;
    color: var(--void-black);
    letter-spacing: 0.02em;
    line-height: 1;
    white-space: nowrap;
    text-transform: uppercase;
  }

  .rcpt-status-divider {
    width: 2px;
    height: 22px;
    background: var(--void-black);
    flex-shrink: 0;
  }

  .rcpt-status-desc {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5px;
    font-weight: 800;
    color: var(--void-black);
    line-height: 1.25;
  }

  /* DETAILS TABLE */
  .rcpt-table-card {
    position: relative;
    z-index: 2;
    margin-bottom: 20px;
  }

  .rcpt-table-row {
    display: flex;
    align-items: baseline;
    padding: 7px 0;
    gap: 12px;
  }

  .rcpt-row-icon {
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--void-black);
  }

  .rcpt-row-label {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    font-weight: 800;
    color: var(--void-black);
    white-space: nowrap;
    letter-spacing: -0.01em;
  }

  .rcpt-dotted-leader {
    flex-grow: 1;
    border-bottom: 2.2px dotted rgba(13, 13, 13, 0.45);
    margin: 0 4px;
    transform: translateY(-4px);
  }

  .rcpt-row-value {
    font-family: 'JetBrains Mono', 'Archivo Black', monospace;
    font-size: 15px;
    font-weight: 800;
    color: var(--void-black);
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  /* TOTAL PAID TORN BRUSH BANNER */
  .rcpt-total-brush-banner {
    position: relative;
    margin: 10px 0 22px;
    padding: 12px 24px;
    background: var(--hot-pink);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    clip-path: polygon(
      0% 18%, 2% 4%, 8% 12%, 18% 2%, 32% 10%, 48% 0%, 65% 8%, 80% 2%, 92% 10%, 100% 0%,
      98% 40%, 100% 70%, 97% 92%, 88% 100%, 72% 94%, 55% 98%, 38% 90%, 20% 98%, 8% 92%, 0% 100%,
      1.5% 65%, 0% 40%
    );
    box-shadow: 0px 4px 0px rgba(0,0,0,0.3);
    z-index: 2;
  }

  .rcpt-total-label {
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 26px;
    color: var(--void-black);
    letter-spacing: 0.02em;
    line-height: 1;
    white-space: nowrap;
  }

  .rcpt-total-slash {
    font-family: 'Archivo Black', sans-serif;
    font-size: 28px;
    color: var(--void-black);
    line-height: 1;
  }

  .rcpt-total-val {
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 38px;
    color: var(--void-black);
    line-height: 1;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  /* BARCODE SECTION */
  .rcpt-barcode-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
    position: relative;
    z-index: 2;
  }

  .rcpt-barcode-svg {
    height: 48px;
    width: 250px;
  }

  .rcpt-barcode-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13.5px;
    font-weight: 800;
    letter-spacing: 0.28em;
    color: var(--void-black);
    margin-top: 4px;
    text-transform: uppercase;
  }

  /* BOTTOM CAUTION HAZARD WARNING TAPE */
  .rcpt-caution-tape {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 22px;
    background: repeating-linear-gradient(
      -45deg,
      var(--caution-yellow),
      var(--caution-yellow) 14px,
      var(--void-black) 14px,
      var(--void-black) 28px
    );
    border-top: 2.5px solid var(--void-black);
    z-index: 2;
  }

  /* EXPANDABLE ITEMS ACCORDION */
  .rcpt-items-toggle {
    margin-top: 14px;
    width: 100%;
    background: rgba(0, 0, 0, 0.04);
    border: 2px dashed rgba(13, 13, 13, 0.35);
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 800;
    color: var(--void-black);
    transition: background 0.15s ease;
  }
  .rcpt-items-toggle:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  .rcpt-items-list {
    margin-top: 8px;
    background: #FFF;
    border: 2px solid var(--void-black);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
  }

  .rcpt-subitem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 14px;
    border-bottom: 1px solid rgba(13, 13, 13, 0.1);
    font-size: 13px;
  }
  .rcpt-subitem:last-child {
    border-bottom: none;
  }
  .rcpt-subitem-title {
    font-weight: 700;
    color: var(--void-black);
  }
  .rcpt-subitem-meta {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    color: #4A4A4A;
  }

  /* PRINT MEDIA RULES */
  @media print {
    body {
      background: white !important;
    }
    .rcpt-bg-layer,
    .rcpt-header-bar,
    .rcpt-items-toggle {
      display: none !important;
    }
    .rcpt-page-shell {
      padding: 0 !important;
      background: transparent !important;
    }
    .rcpt-torn-paper {
      box-shadow: none !important;
      border: 2px solid black !important;
      clip-path: none !important;
    }
  }

  /* RESPONSIVE DESIGN */
  @media (max-width: 680px) {
    .rcpt-torn-paper {
      padding: 24px 18px 20px;
    }
    .rcpt-title-text-payment {
      font-size: 20px;
    }
    .rcpt-title-text-receipt {
      font-size: 32px;
    }
    .rcpt-outbreak-stamp {
      width: 82px;
      height: 82px;
      font-size: 9px;
    }
    .rcpt-stamp-text {
      font-size: 9px;
    }
    .rcpt-status-pill {
      flex-direction: column;
      align-items: flex-start;
      border-radius: 16px;
      gap: 6px;
    }
    .rcpt-status-divider {
      display: none;
    }
    .rcpt-total-label {
      font-size: 20px;
    }
    .rcpt-total-val {
      font-size: 28px;
    }
  }
`;

export default function ReceiptPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showItems, setShowItems] = useState(false);

  // Retrieve receipt from localStorage or location state, or supply default matching reference
  const savedReceipt = JSON.parse(localStorage.getItem("odysseyReceipt") || "null");
  const stateReceipt = location.state?.receipt;

  const defaultReceipt = {
    orderId: "OD-784921",
    date: "07 Nov 2026, 08:37 PM",
    paymentMethod: "UPI",
    itemsCount: 4,
    total: 540,
    items: [
      { name: "A4 Engineering Bond Paper (100 GSM)", quantity: 2, price: 160 },
      { name: "Fine Liner Technical Pens (0.5mm 3-Pack)", quantity: 1, price: 120 },
      { name: "Matte Precision Drafting Triangle", quantity: 1, price: 100 }
    ],
    status: "CONFIRMED"
  };

  const receipt = stateReceipt || savedReceipt || defaultReceipt;

  // Save to orders history safely if not already present
  useEffect(() => {
    if (receipt && receipt.orderId) {
      try {
        const existingOrders = JSON.parse(localStorage.getItem("odysseyOrders") || "[]");
        const alreadySaved = existingOrders.some((o) => o.orderId === receipt.orderId);
        if (!alreadySaved) {
          existingOrders.unshift(receipt);
          localStorage.setItem("odysseyOrders", JSON.stringify(existingOrders));
        }
      } catch (e) {
        console.error("Order history persistence error:", e);
      }
    }
  }, [receipt]);

  const itemsTotalCount = receipt.itemsCount || (receipt.items ? receipt.items.reduce((acc, i) => acc + (i.quantity || 1), 0) : 4);
  const formattedTotal = Number(receipt.total || 540).toFixed(2);
  const barcodeNumber = (receipt.orderId || "OD-784921").replace(/[^a-zA-Z0-9]/g, "");

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rcpt-page-shell">

        {/* 100% PURE VECTOR APOCALYPTIC BASECAMP BACKDROP */}
        <div className="rcpt-bg-layer" aria-hidden="true">
          <img
            src="/receipt-backdrop-clean.svg?v=1"
            alt="Basecamp Vector Backdrop"
            className="rcpt-bg-vector"
          />
        </div>

        {/* TOP FLOATING ACTION BAR */}
        <header className="rcpt-header-bar">
          <button
            onClick={() => navigate("/student")}
            className="rcpt-action-pill"
            title="Return to Basecamp Store"
          >
            ← BACK TO BASE
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowItems(!showItems)}
              className="rcpt-action-pill accent-yellow"
              title="Toggle items breakdown"
            >
              📦 {showItems ? "HIDE ITEMS" : "VIEW ITEMS"}
            </button>
            <button
              onClick={handlePrint}
              className="rcpt-action-pill accent-lime"
              title="Print official receipt slip"
            >
              🖨️ PRINT SLIP
            </button>
          </div>
        </header>

        {/* MAIN RECEIPT CENTER CONTAINER */}
        <main className="rcpt-center-stage">
          <div className="rcpt-torn-paper">

            {/* TOP HEADER: BRUSH TITLES + OUTBREAK RUBBER STAMP */}
            <div className="rcpt-header-zone">
              <div className="rcpt-brush-title-container">
                <div className="rcpt-brush-backdrop" />
                <span className="rcpt-title-text-payment">PAYMENT</span>
                <span className="rcpt-title-text-receipt">RECEIPT</span>
                <div className="rcpt-title-yellow-streak" />
              </div>

              {/* CIRCULAR RUBBER STAMP */}
              <div className="rcpt-outbreak-stamp">
                <svg className="rcpt-stamp-biohazard" viewBox="0 0 24 24">
                  <path d="M12 2a4 4 0 0 0-3.8 2.76A7.95 7.95 0 0 0 5.4 6.72a4 4 0 0 0-1.4 3.28 4 4 0 0 0 2 3.46 7.98 7.98 0 0 0 1.2 5.34 4 4 0 0 0 2.8 1.2 4 4 0 0 0 4-4 4 4 0 0 0 4 4 4 4 0 0 0 2.8-1.2 7.98 7.98 0 0 0 1.2-5.34 4 4 0 0 0 2-3.46 4 4 0 0 0-1.4-3.28 7.95 7.95 0 0 0-2.8-1.96A4 4 0 0 0 12 2zm0 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
                </svg>
                <span className="rcpt-stamp-text">OUTBREAK<br />CONFIRMED</span>
                <span className="rcpt-stamp-star">★</span>
              </div>
            </div>

            {/* STATUS BANNER */}
            <div className="rcpt-status-pill">
              <div className="rcpt-status-check-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="rcpt-status-title">PAYMENT SUCCESSFUL</span>
              <div className="rcpt-status-divider" />
              <span className="rcpt-status-desc">
                Your order has been confirmed and is being prepped at the basecamp.
              </span>
            </div>

            {/* SPECS TABLE WITH DOTTED LEADERS */}
            <div className="rcpt-table-card">
              {/* ORDER ID */}
              <div className="rcpt-table-row">
                <span className="rcpt-row-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="6" cy="12" r="1.5" />
                    <circle cx="18" cy="12" r="1.5" />
                    <path d="M10 6v12M14 6v12" strokeDasharray="2 2" />
                  </svg>
                </span>
                <span className="rcpt-row-label">Order ID</span>
                <div className="rcpt-dotted-leader" />
                <span className="rcpt-row-value">{receipt.orderId || "OD-784921"}</span>
              </div>

              {/* ORDER DATE */}
              <div className="rcpt-table-row">
                <span className="rcpt-row-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <span className="rcpt-row-label">Order Date</span>
                <div className="rcpt-dotted-leader" />
                <span className="rcpt-row-value">{receipt.date || "07 Nov 2026, 08:37 PM"}</span>
              </div>

              {/* PAYMENT METHOD */}
              <div className="rcpt-table-row">
                <span className="rcpt-row-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </span>
                <span className="rcpt-row-label">Payment Method</span>
                <div className="rcpt-dotted-leader" />
                <span className="rcpt-row-value">{receipt.paymentMethod || "UPI"}</span>
              </div>

              {/* ITEMS */}
              <div className="rcpt-table-row">
                <span className="rcpt-row-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </span>
                <span className="rcpt-row-label">Items</span>
                <div className="rcpt-dotted-leader" />
                <span className="rcpt-row-value">{itemsTotalCount}</span>
              </div>
            </div>

            {/* EXPANDABLE ORDERED ITEMS BREAKDOWN */}
            {showItems && receipt.items && receipt.items.length > 0 && (
              <div className="rcpt-items-list">
                {receipt.items.map((it, idx) => (
                  <div key={idx} className="rcpt-subitem">
                    <span className="rcpt-subitem-title">{it.name}</span>
                    <span className="rcpt-subitem-meta">
                      {it.quantity}x @ ₹{it.price} = ₹{(it.price || 0) * (it.quantity || 1)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TOTAL PAID TORN BRUSH BANNER */}
            <div className="rcpt-total-brush-banner">
              <span className="rcpt-total-label">Total Paid</span>
              <span className="rcpt-total-slash">/</span>
              <span className="rcpt-total-val">₹{formattedTotal}</span>
            </div>

            {/* BARCODE SECTION */}
            <div className="rcpt-barcode-zone">
              <svg className="rcpt-barcode-svg" viewBox="0 0 200 40">
                {/* Vector Barcode Lines */}
                <rect x="0" y="0" width="3" height="40" fill="#0D0D0D" />
                <rect x="5" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="9" y="0" width="5" height="40" fill="#0D0D0D" />
                <rect x="16" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="20" y="0" width="4" height="40" fill="#0D0D0D" />
                <rect x="27" y="0" width="1" height="40" fill="#0D0D0D" />
                <rect x="30" y="0" width="6" height="40" fill="#0D0D0D" />
                <rect x="39" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="43" y="0" width="3" height="40" fill="#0D0D0D" />
                <rect x="48" y="0" width="5" height="40" fill="#0D0D0D" />
                <rect x="55" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="59" y="0" width="4" height="40" fill="#0D0D0D" />
                <rect x="66" y="0" width="1" height="40" fill="#0D0D0D" />
                <rect x="70" y="0" width="6" height="40" fill="#0D0D0D" />
                <rect x="78" y="0" width="3" height="40" fill="#0D0D0D" />
                <rect x="83" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="88" y="0" width="4" height="40" fill="#0D0D0D" />
                <rect x="94" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="98" y="0" width="6" height="40" fill="#0D0D0D" />
                <rect x="107" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="111" y="0" width="5" height="40" fill="#0D0D0D" />
                <rect x="118" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="122" y="0" width="4" height="40" fill="#0D0D0D" />
                <rect x="128" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="132" y="0" width="5" height="40" fill="#0D0D0D" />
                <rect x="139" y="0" width="3" height="40" fill="#0D0D0D" />
                <rect x="144" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="148" y="0" width="6" height="40" fill="#0D0D0D" />
                <rect x="156" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="160" y="0" width="4" height="40" fill="#0D0D0D" />
                <rect x="166" y="0" width="1" height="40" fill="#0D0D0D" />
                <rect x="170" y="0" width="5" height="40" fill="#0D0D0D" />
                <rect x="177" y="0" width="3" height="40" fill="#0D0D0D" />
                <rect x="182" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="186" y="0" width="5" height="40" fill="#0D0D0D" />
                <rect x="193" y="0" width="2" height="40" fill="#0D0D0D" />
                <rect x="197" y="0" width="3" height="40" fill="#0D0D0D" />
              </svg>
              <span className="rcpt-barcode-code">{barcodeNumber}</span>
            </div>

            {/* CAUTION HAZARD WARNING TAPE STRIPES */}
            <div className="rcpt-caution-tape" />

          </div>
        </main>

      </div>
    </>
  );
}
