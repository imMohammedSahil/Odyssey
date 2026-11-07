import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&display=swap');

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
    --brain-pink: #FF70A6;
    --parchment: #F9F9F3;
    --soft-peach: #FFE6C7;
    --border-dark: #0D0D0D;
  }

  .nb-cart-root {
    min-height: 100vh;
    background-color: var(--void-black);
    color: var(--void-black);
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding-bottom: 80px;
    letter-spacing: 0.2px;
  }

  /* ── TOP HEADER / NAVBAR ── */
  .nb-cart-header-wrapper {
    background-color: var(--slime-green);
    border-bottom: 4px solid var(--border-dark);
    padding: 20px 4% 28px;
    position: relative;
    box-shadow: 0 4px 0px rgba(0, 0, 0, 0.15);
  }

  .nb-cart-nav {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }

  .nb-back-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 42px;
    padding: 0 16px;
    background: var(--parchment);
    color: var(--void-black);
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 13px;
    text-transform: uppercase;
    text-decoration: none;
    border: 3px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 3px 3px 0px var(--border-dark);
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .nb-back-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  .nb-nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .nb-nav-logo {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 20px;
    color: var(--void-black);
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nb-nav-badge {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    background: var(--brain-pink);
    color: var(--void-black);
    font-size: 11px;
    letter-spacing: 0.8px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 2px solid var(--border-dark);
    box-shadow: 2px 2px 0px var(--border-dark);
  }

  /* ── HERO BANNER TITLE ── */
  .nb-cart-title-box {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .nb-cart-heading {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: clamp(30px, 4.8vw, 48px);
    text-transform: uppercase;
    color: var(--brain-pink);
    -webkit-text-stroke: 2.5px var(--border-dark);
    paint-order: stroke fill;
    text-shadow: 4px 4px 0px var(--border-dark);
    line-height: 1.1;
    letter-spacing: 1.5px;
  }

  .nb-cart-subtext {
    font-size: 14px;
    font-weight: 700;
    color: var(--void-black);
    margin-top: 6px;
  }

  .nb-cart-count-pill {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    background: var(--hazard-gold);
    color: var(--void-black);
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 999px;
    border: 3px solid var(--border-dark);
    box-shadow: 3px 3px 0px var(--border-dark);
    letter-spacing: 0.8px;
  }

  /* ── MAIN CONTENT CONTAINER ── */
  .nb-cart-container {
    max-width: 1400px;
    margin: 40px auto 0;
    padding: 0 4%;
  }

  /* ── EMPTY STATE ── */
  .nb-empty-card {
    background: var(--parchment);
    border: 3.5px solid var(--border-dark);
    border-radius: 16px;
    box-shadow: 5px 5px 0px var(--border-dark);
    padding: 48px 32px 42px;
    text-align: center;
    max-width: 535px;
    margin: 40px auto;
  }

  .nb-empty-mascot {
    width: 240px;
    height: auto;
    max-height: 180px;
    object-fit: contain;
    margin-bottom: 8px;
    display: inline-block;
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
  }

  .nb-empty-title {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 24px;
    color: var(--void-black);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  .nb-empty-desc {
    font-size: 13.5px;
    font-weight: 600;
    color: #555;
    max-width: 360px;
    margin: 0 auto 24px;
    line-height: 1.5;
  }

  .nb-empty-btn {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 14.5px;
    text-transform: uppercase;
    background: var(--brain-pink);
    color: var(--void-black);
    padding: 13px 26px;
    border: 3px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 3px 3px 0px var(--border-dark);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .nb-empty-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--border-dark);
  }

  /* ── CART GRID LAYOUT ── */
  .nb-cart-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 36px;
    align-items: flex-start;
  }

  @media (max-width: 820px) {
    .nb-cart-layout {
      grid-template-columns: 1fr;
    }
  }

  /* ── TWO-ITEM PERFECT BOTTOM-LINE ALIGNMENT ── */
  @media (min-width: 821px) {
    .nb-cart-layout.nb-two-items .nb-summary-card {
      padding: 23px 22px;
    }

    .nb-cart-layout.nb-two-items .nb-summary-title {
      margin-bottom: 14px;
      padding-bottom: 10px;
    }

    .nb-cart-layout.nb-two-items .nb-summary-dashed {
      margin: 13px 0;
    }

    .nb-cart-layout.nb-two-items .nb-summary-total-row {
      margin-bottom: 18px;
    }

    .nb-cart-layout.nb-two-items .nb-checkout-btn {
      padding: 15px 20px;
    }

    .nb-cart-layout.nb-two-items .nb-continue-link {
      margin-top: 12px;
    }
  }

  /* ── ITEMS LIST ── */
  .nb-items-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .nb-item-card {
    background: var(--parchment);
    border: 3.5px solid var(--border-dark);
    border-radius: 14px;
    box-shadow: 4px 4px 0px var(--border-dark);
    padding: 20px 22px;
    position: relative;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .nb-item-card:hover {
    transform: translate(-1px, -1px);
    box-shadow: 6px 6px 0px var(--border-dark);
  }

  .nb-item-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 16px;
  }

  .nb-item-badge {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 10px;
    letter-spacing: 0.8px;
    padding: 3px 8px;
    border-radius: 999px;
    border: 2px solid var(--border-dark);
    background: var(--hazard-gold);
    color: var(--void-black);
    display: inline-block;
    margin-bottom: 6px;
  }

  .nb-item-name {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 20px;
    font-weight: normal;
    color: var(--void-black);
    letter-spacing: 0.4px;
    line-height: 1.25;
  }

  .nb-item-meta {
    font-size: 12px;
    font-weight: 700;
    color: #666;
    margin-top: 5px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .nb-meta-chip {
    background: #EAEAE2;
    padding: 2px 7px;
    border-radius: 4px;
    border: 1.5px solid var(--border-dark);
    font-size: 11px;
    color: var(--void-black);
  }

  .nb-item-price-tag {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 18px;
    color: var(--void-black);
    background: var(--slime-green);
    border: 2.5px solid var(--border-dark);
    border-radius: 8px;
    padding: 6px 12px;
    box-shadow: 2.5px 2.5px 0px var(--border-dark);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .nb-item-divider {
    height: 2px;
    background: var(--border-dark);
    margin-bottom: 14px;
    opacity: 0.15;
  }

  .nb-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  /* ── STEPPER ── */
  .nb-stepper {
    display: inline-flex;
    align-items: center;
    background: #FFF;
    border: 2.5px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 2px 2px 0px var(--border-dark);
    overflow: hidden;
  }

  .nb-stepper-btn {
    width: 34px;
    height: 34px;
    background: var(--parchment);
    border: none;
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 16px;
    color: var(--void-black);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s ease;
  }

  .nb-stepper-btn:hover:not(:disabled) {
    background: var(--hazard-gold);
  }

  .nb-stepper-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .nb-stepper-val {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 15px;
    min-width: 36px;
    text-align: center;
    border-left: 2px solid var(--border-dark);
    border-right: 2px solid var(--border-dark);
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--void-black);
  }

  .nb-remove-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    background: #FFF;
    color: #D32F2F;
    border: 2px solid var(--border-dark);
    border-radius: 6px;
    box-shadow: 2px 2px 0px var(--border-dark);
    padding: 7px 14px;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .nb-remove-btn:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px var(--border-dark);
    background: #FFEBEE;
  }

  /* ── SUMMARY MANIFEST CARD ── */
  .nb-summary-card {
    background: var(--parchment);
    border: 4px solid var(--border-dark);
    border-radius: 16px;
    box-shadow: 6px 6px 0px var(--border-dark);
    padding: 24px;
    position: sticky;
    top: 24px;
  }

  .nb-summary-badge {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: var(--seafoam);
    color: var(--void-black);
    padding: 4px 10px;
    border-radius: 999px;
    border: 2px solid var(--border-dark);
    display: inline-block;
    align-self: flex-start;
    width: fit-content;
    margin-bottom: 12px;
  }

  .nb-summary-title {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 22px;
    font-weight: normal;
    color: var(--void-black);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 18px;
    border-bottom: 3px solid var(--border-dark);
    padding-bottom: 12px;
  }

  .nb-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13.5px;
    font-weight: 700;
    color: #444;
    margin-bottom: 12px;
  }

  .nb-summary-row span:last-child {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    color: var(--void-black);
    font-size: 14px;
  }

  .nb-free-text {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: var(--void-black);
    background: var(--seafoam);
    padding: 2px 8px;
    border-radius: 999px;
    border: 1.5px solid var(--border-dark);
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    line-height: 1.2;
  }

  .nb-summary-dashed {
    border-top: 2.5px dashed var(--border-dark);
    margin: 16px 0;
    opacity: 0.5;
  }

  .nb-summary-total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 22px;
  }

  .nb-summary-total-label {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 15px;
    text-transform: uppercase;
    color: var(--void-black);
  }

  .nb-summary-total-val {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 32px;
    color: var(--void-black);
    display: flex;
    align-items: baseline;
    gap: 2px;
  }

  .nb-checkout-btn {
    width: 100%;
    background: var(--brain-pink);
    color: var(--void-black);
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 15px 20px;
    border: 3.5px solid var(--border-dark);
    border-radius: 10px;
    box-shadow: 4px 4px 0px var(--border-dark);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .nb-checkout-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--border-dark);
  }

  .nb-continue-link {
    display: block;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    text-align: center;
    margin-top: 14px;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    color: #666;
    text-decoration: none;
    letter-spacing: 0.5px;
    font-family: inherit;
  }

  .nb-continue-link:hover {
    color: var(--void-black);
    text-decoration: underline;
  }
`;

export default function CartPage() {
  const {
    cartItems,
    getCartTotal,
    removeFromCart,
    updateQuantity
  } = useCart();

  const navigate = useNavigate();

  return (
    <>
      <style>{css}</style>
      <div className="nb-cart-root">
        {/* Slime Green Top Header */}
        <div className="nb-cart-header-wrapper">
          <nav className="nb-cart-nav">
            <button className="nb-back-btn" onClick={() => navigate("/student")}>
              ← BASECAMP
            </button>
          </nav>

          <div className="nb-cart-title-box">
            <div>
              <h1 className="nb-cart-heading">SURVIVAL LOOT</h1>
              <p className="nb-cart-subtext">
                {cartItems.length === 0
                  ? "Your study gear inventory is currently empty"
                  : "All your campus survival gear locked and ready for dispatch."}
              </p>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="nb-cart-container">
          {/* EMPTY STATE */}
          {cartItems.length === 0 ? (
            <div className="nb-empty-card">
              <img
                src="/zombie-rip-peace.png"
                alt="Zombie Peace Tombstone"
                className="nb-empty-mascot"
                draggable="false"
              />
              <h2 className="nb-empty-title">OUT OF AMMO!</h2>
              <p className="nb-empty-desc">
                Your cart is as empty as a grave. Head to Basecamp to restock printouts, spiral reports, or study gear.
              </p>
              <button
                className="nb-empty-btn"
                onClick={() => navigate("/student", { state: { scrollToKits: true } })}
              >
                RESTOCK GEAR →
              </button>
            </div>
          ) : (
            /* CART LAYOUT WITH ITEMS & SUMMARY */
            <div className={`nb-cart-layout ${cartItems.length === 2 ? "nb-two-items" : ""}`}>
              {/* Item Cards */}
              <ul className="nb-items-list">
                {cartItems.map((item, index) => (
                  <li key={index} className="nb-item-card">
                    <div className="nb-item-top">
                      <div>
                        <span className="nb-item-badge">
                          {item.file ? "PRINT DISPATCH" : "STATIONERY GEAR"}
                        </span>
                        <h3 className="nb-item-name">{item.name}</h3>
                        {item.file && (
                          <div className="nb-item-meta">
                            <span className="nb-meta-chip">{item.file.name}</span>
                            <span>•</span>
                            <span>{item.pages} {item.pages === 1 ? "page" : "pages"}</span>
                            <span>•</span>
                            <span>{item.quantity} {item.quantity === 1 ? "copy" : "copies"}</span>
                          </div>
                        )}
                      </div>

                      <span className="nb-item-price-tag">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    <div className="nb-item-divider" />

                    <div className="nb-item-bottom">
                      <div className="nb-stepper">
                        <button
                          className="nb-stepper-btn"
                          disabled={item.quantity === 1}
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <div className="nb-stepper-val">{item.quantity}</div>
                        <button
                          className="nb-stepper-btn"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="nb-remove-btn"
                        onClick={() => removeFromCart(index)}
                      >
                        REMOVE ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Order Summary Manifest */}
              <aside className="nb-summary-card">
                <span className="nb-summary-badge">LOOT MANIFEST</span>
                <h2 className="nb-summary-title">SUMMARY</h2>

                <div className="nb-summary-row">
                  <span>Dispatch Units</span>
                  <span>{cartItems.length}</span>
                </div>

                <div className="nb-summary-row">
                  <span>Campus Pickup</span>
                  <span className="nb-free-text">FREE</span>
                </div>

                <div className="nb-summary-dashed" />

                <div className="nb-summary-total-row">
                  <span className="nb-summary-total-label">Total Loot</span>
                  <span className="nb-summary-total-val">
                    ₹{getCartTotal()}
                  </span>
                </div>

                <button
                  className="nb-checkout-btn"
                  onClick={() => navigate("/payment")}
                >
                  PROCEED TO PAYMENT →
                </button>

                <button
                  className="nb-continue-link"
                  onClick={() => navigate("/student", { state: { scrollToKits: true } })}
                >
                  ← ADD MORE GEAR
                </button>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
