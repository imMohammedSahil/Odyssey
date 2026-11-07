import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@700;800;900&family=JetBrains+Mono:wght@600;700;800&family=Titan+One&display=swap');

  :root {
    --void-black: #0D0D0D;
    --toxic-lime: #B8F414;
    --caution-yellow: #F9EC1B;
    --hot-pink: #F72678;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .rcpt-root {
    min-height: 100vh;
    width: 100vw;
    background-color: var(--toxic-lime);
    background-image: 
      radial-gradient(#88D303 1.5px, transparent 1.5px),
      linear-gradient(135deg, #BFF81B 0%, #A2F20A 50%, #8FE704 100%);
    background-size: 14px 14px, 100% 100%;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--void-black);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 20px 28px;
    position: relative;
    overflow-x: hidden;
  }

  /* TOP FLOATING ACTION BAR */
  .rcpt-top-nav {
    width: 100%;
    max-width: 1040px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    z-index: 50;
    gap: 12px;
  }

  .rcpt-pill-btn {
    background: var(--void-black);
    color: #FFFFFF;
    border: 3.5px solid var(--void-black);
    border-radius: 9999px;
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 12.5px;
    padding: 9px 22px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
  }

  .rcpt-pill-btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.7);
    background: #1F1F1F;
  }

  .rcpt-pill-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.7);
  }

  .rcpt-pill-btn.yellow {
    background: var(--caution-yellow);
    color: var(--void-black);
  }
  .rcpt-pill-btn.yellow:hover {
    background: #FFF238;
  }

  .rcpt-pill-btn.pink {
    background: var(--hot-pink);
    color: #FFFFFF;
  }
  .rcpt-pill-btn.pink:hover {
    background: #FF3C88;
  }

  /* MAIN ARTWORK VIEWPORT CONTAINER */
  .rcpt-stage {
    width: 100%;
    max-width: 1040px;
    position: relative;
    border: 4px solid var(--void-black);
    border-radius: 14px;
    box-shadow: 10px 12px 0px rgba(0, 0, 0, 0.65);
    overflow: hidden;
    background: #000;
    aspect-ratio: 1024 / 576;
  }

  .rcpt-vector-art {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    user-select: none;
  }

  .rcpt-dynamic-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  /* SVG DYNAMIC TEXT STYLING */
  .svg-text-mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13.5px;
    font-weight: 700;
    fill: #0D0D0D;
    letter-spacing: 0.02em;
  }

  .svg-total-text {
    font-family: 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    fill: #0D0D0D;
  }

  .svg-total-label {
    font-size: 26px;
    letter-spacing: 0.02em;
  }

  .svg-total-slash {
    font-size: 28px;
  }

  .svg-total-amount {
    font-size: 38px;
    letter-spacing: -0.01em;
  }

  .svg-barcode-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.22em;
    fill: #0D0D0D;
  }

  /* ITEMS BREAKDOWN MODAL */
  .rcpt-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: rcptFade 0.18s ease-out;
  }

  @keyframes rcptFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .rcpt-modal-card {
    width: 100%;
    max-width: 520px;
    background: #FCEDD3;
    border: 4px solid var(--void-black);
    border-radius: 12px;
    box-shadow: 8px 8px 0px var(--void-black);
    padding: 24px;
    position: relative;
    max-height: 85vh;
    overflow-y: auto;
  }

  .rcpt-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid var(--void-black);
    padding-bottom: 12px;
    margin-bottom: 18px;
  }

  .rcpt-modal-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: 19px;
    color: var(--void-black);
    text-transform: uppercase;
  }

  .rcpt-modal-close {
    background: var(--void-black);
    color: #FFF;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 2px 2px 0px rgba(0,0,0,0.4);
  }

  .rcpt-modal-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1.5px dotted rgba(13, 13, 13, 0.3);
    font-size: 14px;
  }
  .rcpt-modal-item:last-child {
    border-bottom: none;
  }

  .rcpt-modal-item-name {
    font-weight: 800;
    color: var(--void-black);
  }

  .rcpt-modal-item-cost {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: var(--void-black);
    white-space: nowrap;
  }

  .rcpt-modal-total-row {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 3px solid var(--void-black);
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-family: 'Archivo Black', sans-serif;
    font-size: 20px;
  }

  /* PRINT MEDIA */
  @media print {
    body, .rcpt-root {
      background: white !important;
      padding: 0 !important;
    }
    .rcpt-top-nav,
    .rcpt-modal-overlay {
      display: none !important;
    }
    .rcpt-stage {
      border: none !important;
      box-shadow: none !important;
      max-width: 100% !important;
    }
  }

  @media (max-width: 600px) {
    .rcpt-top-nav {
      flex-wrap: wrap;
    }
    .rcpt-pill-btn {
      padding: 7px 14px;
      font-size: 11px;
    }
  }
`;

export default function ReceiptPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  // Retrieve receipt from localStorage or location state, or fallback to exact reference defaults
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

  // Persist safely in orders history
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
        console.error("Orders persistence error:", e);
      }
    }
  }, [receipt]);

  const itemsTotalCount =
    receipt.itemsCount ||
    (receipt.items ? receipt.items.reduce((acc, i) => acc + (i.quantity || 1), 0) : 4);

  const formattedTotal = Number(receipt.total || 540).toFixed(2);
  const barcodeText = (receipt.orderId || "OD-784921").replace(/[^a-zA-Z0-9]/g, "");

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rcpt-root">

        {/* TOP FLOATING CONTROLS */}
        <header className="rcpt-top-nav">
          <button
            onClick={() => navigate("/student")}
            className="rcpt-pill-btn"
            title="Return to Odyssey Basecamp"
          >
            ← BACK TO BASE
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowModal(true)}
              className="rcpt-pill-btn yellow"
              title="Inspect order items list"
            >
              📦 VIEW ITEMS
            </button>
            <button
              onClick={handlePrint}
              className="rcpt-pill-btn pink"
              title="Print official receipt slip"
            >
              🖨️ PRINT SLIP
            </button>
          </div>
        </header>

        {/* 100% ACCURATE PURE VECTOR STAGE */}
        <main className="rcpt-stage">
          {/* PURE VECTOR SVG BACKDROP (Zero raster images) */}
          <img
            src="/receipt-landscape.svg?v=4"
            alt="Basecamp Receipt Pure Vector Landscape"
            className="rcpt-vector-art"
          />

          {/* DYNAMIC SVG TEXT OVERLAY LOCKED TO EXACT BASELINES */}
          <svg
            viewBox="0 0 1024 576"
            className="rcpt-dynamic-overlay"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Row 1: Order ID */}
            <text x="561" y="250" className="svg-text-mono">
              {receipt.orderId || "OD-784921"}
            </text>

            {/* Row 2: Order Date */}
            <text x="561" y="277" className="svg-text-mono">
              {receipt.date || "07 Nov 2026, 08:37 PM"}
            </text>

            {/* Row 3: Payment Method */}
            <text x="561" y="304" className="svg-text-mono">
              {receipt.paymentMethod || "UPI"}
            </text>

            {/* Row 4: Items Count */}
            <text x="561" y="331" className="svg-text-mono">
              {itemsTotalCount}
            </text>

            {/* Total Paid on Pink Banner */}
            <text
              x="506"
              y="402"
              textAnchor="middle"
              className="svg-total-text"
            >
              <tspan className="svg-total-label">Total Paid</tspan>
              <tspan dx="16" className="svg-total-slash">/</tspan>
              <tspan dx="20" className="svg-total-amount">₹{formattedTotal}</tspan>
            </text>

            {/* Barcode Number below barcode */}
            <text
              x="492"
              y="497"
              textAnchor="middle"
              className="svg-barcode-text"
            >
              {barcodeText}
            </text>
          </svg>
        </main>

        {/* ORDER ITEMS MODAL */}
        {showModal && (
          <div className="rcpt-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="rcpt-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="rcpt-modal-header">
                <span className="rcpt-modal-title">Order Manifest</span>
                <button
                  className="rcpt-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {receipt.items && receipt.items.length > 0 ? (
                  receipt.items.map((it, idx) => (
                    <div key={idx} className="rcpt-modal-item">
                      <div>
                        <div className="rcpt-modal-item-name">{it.name}</div>
                        <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                          Qty: {it.quantity || 1}
                        </div>
                      </div>
                      <div className="rcpt-modal-item-cost">
                        ₹{(it.price || 0) * (it.quantity || 1)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rcpt-modal-item">
                    <span className="rcpt-modal-item-name">Stationery & Print Dispatch</span>
                    <span className="rcpt-modal-item-cost">₹{formattedTotal}</span>
                  </div>
                )}
              </div>

              <div className="rcpt-modal-total-row">
                <span>TOTAL DISPATCHED</span>
                <span>₹{formattedTotal}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
