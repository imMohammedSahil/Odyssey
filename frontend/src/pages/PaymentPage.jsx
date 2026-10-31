import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .pay-root {
    min-height: 100vh;
    background: #0d0d10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    padding: 24px 16px;
    position: relative;
    overflow: hidden;
  }

  .pay-root::before {
    content: '';
    position: fixed;
    top: -40%;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(109, 86, 210, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .pay-card {
    width: 100%;
    max-width: 480px;
    background: #13131a;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(109,86,210,0.08);
    position: relative;
  }

  .pay-header {
    padding: 28px 32px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .pay-header-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(109, 86, 210, 0.15);
    border: 1px solid rgba(109, 86, 210, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .pay-header-icon svg {
    width: 18px;
    height: 18px;
    color: #9b7ff0;
  }

  .pay-title {
    font-size: 17px;
    font-weight: 600;
    color: #e8e6f0;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .pay-subtitle {
    font-size: 12px;
    color: #5a5870;
    margin: 2px 0 0;
    letter-spacing: 0.02em;
  }

  .pay-body {
    padding: 24px 32px;
  }

  /* Total Section */
  .pay-total-block {
    background: rgba(109, 86, 210, 0.06);
    border: 1px solid rgba(109, 86, 210, 0.15);
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 24px;
    text-align: center;
  }

  .pay-total-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6d56d2;
    margin: 0 0 8px;
  }

  .pay-total-amount {
    font-family: 'JetBrains Mono', monospace;
    font-size: 40px;
    font-weight: 500;
    color: #f0eeff;
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1;
  }

  .pay-total-currency {
    font-size: 22px;
    color: #9b7ff0;
    vertical-align: super;
    margin-right: 2px;
  }

  /* Order Items */
  .pay-section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #3d3b52;
    margin: 0 0 12px;
  }

  .pay-items {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .pay-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    transition: background 0.15s ease;
  }

  .pay-item:not(:last-child) {
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .pay-item:hover {
    background: rgba(255,255,255,0.025);
  }

  .pay-item-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .pay-item-name {
    font-size: 13.5px;
    font-weight: 500;
    color: #ccc9dd;
    letter-spacing: -0.01em;
  }

  .pay-item-qty {
    font-size: 11.5px;
    color: #4e4c65;
    font-family: 'JetBrains Mono', monospace;
  }

  .pay-item-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: #a89ee8;
  }

  /* QR Section */
  .pay-qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0 4px;
    margin-bottom: 24px;
  }

  .pay-qr-frame {
    position: relative;
    padding: 12px;
    background: #1a1a24;
    border: 1px solid rgba(109, 86, 210, 0.2);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    margin-bottom: 14px;
  }

  .pay-qr-frame img {
    display: block;
    border-radius: 6px;
    filter: invert(1) hue-rotate(180deg) brightness(0.9);
  }

  .pay-qr-corner {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: #6d56d2;
    border-style: solid;
  }
  .pay-qr-corner.tl { top: 4px; left: 4px; border-width: 2px 0 0 2px; border-radius: 3px 0 0 0; }
  .pay-qr-corner.tr { top: 4px; right: 4px; border-width: 2px 2px 0 0; border-radius: 0 3px 0 0; }
  .pay-qr-corner.bl { bottom: 4px; left: 4px; border-width: 0 0 2px 2px; border-radius: 0 0 0 3px; }
  .pay-qr-corner.br { bottom: 4px; right: 4px; border-width: 0 2px 2px 0; border-radius: 0 0 3px 0; }

  .pay-qr-hint {
    font-size: 12px;
    color: #4e4c65;
    text-align: center;
    line-height: 1.6;
    max-width: 280px;
  }

  /* Divider */
  .pay-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 0 0 24px;
  }

  /* Notice */
  .pay-notice {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 20px;
  }

  .pay-notice-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #6d56d2;
    flex-shrink: 0;
    margin-top: 5px;
  }

  .pay-notice-text {
    font-size: 12px;
    color: #5a5870;
    line-height: 1.6;
    margin: 0;
  }

  /* Button */
  .pay-btn {
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
    box-shadow: 0 4px 20px rgba(109, 86, 210, 0.3);
    position: relative;
    overflow: hidden;
  }

  .pay-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%);
    pointer-events: none;
  }

  .pay-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(109, 86, 210, 0.45);
    filter: brightness(1.05);
  }

  .pay-btn:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(109, 86, 210, 0.2);
  }

  .pay-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pay-btn svg {
    width: 16px;
    height: 16px;
  }

  /* Footer */
  .pay-footer {
    padding: 16px 32px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-top: 1px solid rgba(255,255,255,0.04);
  }

  .pay-footer-lock {
    color: #3d3b52;
    display: flex;
  }

  .pay-footer-text {
    font-size: 11px;
    color: #3d3b52;
    letter-spacing: 0.02em;
  }

  @media (max-width: 520px) {
    .pay-body { padding: 20px 20px; }
    .pay-header { padding: 22px 20px 18px; }
    .pay-footer { padding: 14px 20px 20px; }
    .pay-total-amount { font-size: 34px; }
  }
`;

export default function PaymentPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePaymentComplete = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/orders", {
        stationeryItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity
        })),
        status: "pending"
      });

      const mongoOrderId = res.data._id;

      localStorage.setItem(
        "odysseyReceipt",
        JSON.stringify({
          orderId: mongoOrderId,
          items: cartItems,
          total,
          date: new Date().toLocaleString(),
        })
      );

      clearCart();
      navigate("/receipt");

    } catch (err) {
      console.error("Order save failed", err);
      alert("Error saving order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="pay-root">
        <div className="pay-card">

          {/* Header */}
          <div className="pay-header">
            <div className="pay-header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="3"/>
                <path d="M2 10h20"/>
              </svg>
            </div>
            <div>
              <h1 className="pay-title">Complete Payment</h1>
              <p className="pay-subtitle">Review your order before confirming</p>
            </div>
          </div>

          {/* Body */}
          <div className="pay-body">

            {/* Total */}
            <div className="pay-total-block">
              <p className="pay-total-label">Total Due</p>
              <p className="pay-total-amount">
                <span className="pay-total-currency">₹</span>
                {total.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Order Items */}
            {cartItems.length > 0 && (
              <>
                <p className="pay-section-label">Order Summary</p>
                <div className="pay-items">
                  {cartItems.map((item, i) => (
                    <div className="pay-item" key={i}>
                      <div className="pay-item-info">
                        <span className="pay-item-name">{item.name}</span>
                        <span className="pay-item-qty">× {item.quantity}</span>
                      </div>
                      <span className="pay-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* QR Code */}
            <div className="pay-qr-section">
              <div className="pay-qr-frame">
                <span className="pay-qr-corner tl"/>
                <span className="pay-qr-corner tr"/>
                <span className="pay-qr-corner bl"/>
                <span className="pay-qr-corner br"/>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=DemoPayment"
                  alt="QR Code"
                  width={160}
                  height={160}
                />
              </div>
              <p className="pay-qr-hint">
                Scan with any UPI app to complete your payment
              </p>
            </div>

            <div className="pay-divider"/>

            {/* Notice */}
            <div className="pay-notice">
              <span className="pay-notice-dot"/>
              <p className="pay-notice-text">
                After completing your payment via UPI, click the button below to confirm your order and generate a receipt.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handlePaymentComplete}
              disabled={loading}
              className="pay-btn"
            >
              {loading ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation: 'spin 1s linear infinite'}}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Payment Completed
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="pay-footer">
            <span className="pay-footer-lock">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <span className="pay-footer-text">Secured · Encrypted · Verified</span>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}