import React from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .rcpt-root {
    min-height: 100vh;
    background: #0d0d10;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    padding: 40px 16px 60px;
    position: relative;
  }

  .rcpt-root::before {
    content: '';
    position: fixed;
    top: -30%;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(109, 86, 210, 0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .rcpt-card {
    width: 100%;
    max-width: 500px;
    background: #13131a;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(109,86,210,0.07);
    position: relative;
    z-index: 1;
    animation: rcptFadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes rcptFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Success Banner */
  .rcpt-success-banner {
    padding: 28px 32px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .rcpt-success-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(72, 199, 142, 0.1);
    border: 1.5px solid rgba(72, 199, 142, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    animation: iconPop 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
  }

  @keyframes iconPop {
    from { opacity: 0; transform: scale(0.6); }
    to   { opacity: 1; transform: scale(1); }
  }

  .rcpt-success-icon svg {
    width: 20px;
    height: 20px;
    color: #48c78e;
  }

  .rcpt-success-title {
    font-size: 17px;
    font-weight: 600;
    color: #e8e6f0;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .rcpt-success-sub {
    font-size: 12px;
    color: #48c78e;
    margin: 3px 0 0;
    letter-spacing: 0.02em;
  }

  /* Body */
  .rcpt-body {
    padding: 24px 32px;
  }

  /* Total block */
  .rcpt-total-block {
    background: rgba(109, 86, 210, 0.06);
    border: 1px solid rgba(109, 86, 210, 0.15);
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 24px;
    text-align: center;
  }

  .rcpt-total-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6d56d2;
    margin: 0 0 8px;
  }

  .rcpt-total-amount {
    font-family: 'JetBrains Mono', monospace;
    font-size: 40px;
    font-weight: 500;
    color: #f0eeff;
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1;
  }

  .rcpt-total-currency {
    font-size: 22px;
    color: #9b7ff0;
    vertical-align: super;
    margin-right: 2px;
  }

  /* Section label */
  .rcpt-section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #3d3b52;
    margin: 0 0 12px;
  }

  /* Items */
  .rcpt-items {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .rcpt-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    transition: background 0.15s ease;
  }

  .rcpt-item:not(:last-child) {
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .rcpt-item:hover {
    background: rgba(255,255,255,0.02);
  }

  .rcpt-item-name {
    font-size: 13.5px;
    font-weight: 500;
    color: #ccc9dd;
    display: block;
    letter-spacing: -0.01em;
  }

  .rcpt-item-qty {
    font-size: 11.5px;
    color: #4e4c65;
    font-family: 'JetBrains Mono', monospace;
    display: block;
    margin-top: 2px;
  }

  .rcpt-item-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: #a89ee8;
  }

  /* Details block */
  .rcpt-details {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .rcpt-detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 16px;
    gap: 12px;
  }

  .rcpt-detail-row:not(:last-child) {
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .rcpt-detail-key {
    font-size: 11.5px;
    color: #4e4c65;
    letter-spacing: 0.02em;
    flex-shrink: 0;
  }

  .rcpt-detail-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #9490b8;
    text-align: right;
    word-break: break-all;
  }

  /* Status badge */
  .rcpt-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .rcpt-status-badge.pending {
    background: rgba(255, 152, 0, 0.1);
    border: 1px solid rgba(255, 152, 0, 0.25);
    color: #ffa726;
  }

  .rcpt-status-badge.printing {
    background: rgba(25, 118, 210, 0.1);
    border: 1px solid rgba(25, 118, 210, 0.25);
    color: #42a5f5;
  }

  .rcpt-status-badge.ready {
    background: rgba(72, 199, 142, 0.1);
    border: 1px solid rgba(72, 199, 142, 0.25);
    color: #48c78e;
  }

  .rcpt-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }

  /* CTA */
  .rcpt-btn {
    width: 100%;
    padding: 15px 24px;
    background: linear-gradient(135deg, #6d56d2 0%, #5a44bb 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: 14.5px;
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
    box-shadow: 0 4px 20px rgba(109, 86, 210, 0.28);
    position: relative;
    overflow: hidden;
  }

  .rcpt-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%);
    pointer-events: none;
  }

  .rcpt-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(109, 86, 210, 0.42);
    filter: brightness(1.05);
  }

  .rcpt-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(109, 86, 210, 0.2);
  }

  .rcpt-btn svg {
    width: 15px;
    height: 15px;
  }

  /* Footer */
  .rcpt-footer {
    padding: 14px 32px 22px;
    border-top: 1px solid rgba(255,255,255,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .rcpt-footer-text {
    font-size: 11px;
    color: #2e2d3e;
    letter-spacing: 0.03em;
  }

  @media (max-width: 520px) {
    .rcpt-body { padding: 20px; }
    .rcpt-success-banner { padding: 20px; }
    .rcpt-footer { padding: 14px 20px 20px; }
    .rcpt-total-amount { font-size: 34px; }
  }
`;

function getStatusClass(status) {
  if (!status) return "pending";
  const s = status.toUpperCase();
  if (s === "READY") return "ready";
  if (s === "PRINTING") return "printing";
  return "pending";
}

export default function ReceiptPage() {
  const navigate = useNavigate();

  const receipt = JSON.parse(localStorage.getItem("odysseyReceipt"));

  // ✅ SAVE TO ORDER HISTORY (SAFE ADD)
  if (receipt) {
    const existingOrders =
      JSON.parse(localStorage.getItem("odysseyOrders")) || [];

    // prevent duplicate save on refresh
    const alreadySaved = existingOrders.some(
      (order) => order.orderId === receipt.orderId
    );

    if (!alreadySaved) {
      existingOrders.push(receipt);
      localStorage.setItem(
        "odysseyOrders",
        JSON.stringify(existingOrders)
      );
    }
  }

  if (!receipt) {
    return (
      <>
        <style>{styles}</style>
        <div className="rcpt-root">
          <div className="rcpt-card">
            <div className="rcpt-body">
              <h2 style={{ color: "#5a5870", fontFamily: "'Sora', sans-serif", textAlign: "center", padding: "20px 0" }}>
                No receipt found.
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  const statusKey = receipt.status || "PENDING";
  const statusClass = getStatusClass(statusKey);

  return (
    <>
      <style>{styles}</style>
      <div className="rcpt-root">
        <div className="rcpt-card">

          {/* Success Banner */}
          <div className="rcpt-success-banner">
            <div className="rcpt-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <h1 className="rcpt-success-title">Order Confirmed</h1>
              <p className="rcpt-success-sub">Your payment was received successfully</p>
            </div>
          </div>

          <div className="rcpt-body">

            {/* Total Paid */}
            <div className="rcpt-total-block">
              <p className="rcpt-total-label">Total Paid</p>
              <p className="rcpt-total-amount">
                <span className="rcpt-total-currency">₹</span>
                {receipt.total?.toLocaleString('en-IN') ?? receipt.total}
              </p>
            </div>

            {/* Items */}
            {receipt.items?.length > 0 && (
              <>
                <p className="rcpt-section-label">Items Ordered</p>
                <div className="rcpt-items">
                  {receipt.items.map((item, index) => (
                    <div className="rcpt-item" key={index}>
                      <div>
                        <span className="rcpt-item-name">{item.name}</span>
                        <span className="rcpt-item-qty">× {item.quantity}</span>
                      </div>
                      <span className="rcpt-item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Receipt Details */}
            <p className="rcpt-section-label">Receipt Details</p>
            <div className="rcpt-details">
              <div className="rcpt-detail-row">
                <span className="rcpt-detail-key">Order ID</span>
                <span className="rcpt-detail-val">{receipt.orderId}</span>
              </div>
              <div className="rcpt-detail-row">
                <span className="rcpt-detail-key">Date</span>
                <span className="rcpt-detail-val">{receipt.date}</span>
              </div>
              <div className="rcpt-detail-row">
                <span className="rcpt-detail-key">Status</span>
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      receipt.status === "READY"
                        ? "green"
                        : receipt.status === "PRINTING"
                        ? "#1976d2"
                        : "#ff9800"
                  }}
                >
                  <span className={`rcpt-status-badge ${statusClass}`}>
                    <span className="rcpt-status-dot"/>
                    {statusKey}
                  </span>
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/student")}
              className="rcpt-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"/>
              </svg>
              Back to Home
            </button>

          </div>

          {/* Footer */}
          <div className="rcpt-footer">
            <span className="rcpt-footer-text">Odyssey · Order Receipt · Keep for your records</span>
          </div>

        </div>
      </div>
    </>
  );
}