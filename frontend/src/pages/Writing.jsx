import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&display=swap');

  :root {
    --planet-yellow: #F7B919;
    --planet-yellow-light: #FDE047;
    --planet-red: #E63946;
    --planet-red-dark: #C1121F;
    --planet-purple: #5A2BD8;
    --planet-purple-dark: #3F1999;
    --planet-purple-light: #8A63FF;
    --void-black: #0D0D0D;
    --pure-white: #FFFFFF;
    --parchment: #FDFBF7;
    --card-cream: #FFFDF0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .writing-page-shell {
    min-height: 100vh;
    background-color: var(--planet-yellow);
    background-image: 
      radial-gradient(var(--void-black) 1.2px, transparent 1.2px),
      radial-gradient(rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
    background-size: 24px 24px, 12px 12px;
    background-position: 0 0, 6px 6px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--void-black);
    padding-bottom: 60px;
    position: relative;
    overflow-x: hidden;
  }

  /* TOP RED RETRO-COMIC HEADER BANNER */
  .writing-header-bar {
    background: var(--planet-red);
    border-bottom: 4px solid var(--void-black);
    padding: 14px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 0px rgba(0, 0, 0, 0.35);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .writing-brand-capsule {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--void-black);
    padding: 6px 14px 6px 8px;
    border-radius: 9999px;
    border: 3px solid var(--void-black);
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.25);
    text-decoration: none;
    transition: transform 0.12s ease;
  }

  .writing-brand-capsule:hover {
    transform: translate(-1.5px, -1.5px);
  }

  .writing-brand-icon-circle {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--planet-yellow);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    border: 2px solid var(--void-black);
  }

  .writing-brand-text-col {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  .writing-brand-title {
    font-family: 'Titan One', cursive;
    font-size: 17px;
    letter-spacing: 0.5px;
    color: var(--pure-white);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .writing-brand-title span {
    color: var(--planet-yellow);
  }

  .writing-brand-kanji {
    font-size: 9px;
    font-weight: 800;
    color: var(--planet-yellow);
    letter-spacing: 1px;
    margin-top: 2px;
  }

  .writing-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .writing-btn-pill {
    background: var(--void-black);
    color: var(--pure-white);
    border: 3px solid var(--void-black);
    border-radius: 9999px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    padding: 7px 16px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .writing-btn-pill:hover {
    transform: translate(-1.5px, -1.5px);
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.4);
    background: #1C1F26;
  }

  .writing-btn-pill:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.4);
  }

  .writing-cart-pill {
    background: var(--planet-yellow);
    color: var(--void-black);
    border-color: var(--void-black);
  }

  .writing-cart-pill:hover {
    background: #FFE066;
  }

  /* WRITING WRAPPER & CONTAINER */
  .writing-layout-container {
    max-width: 1060px;
    margin: 28px auto 0 auto;
    padding: 0 18px;
  }

  @media (max-width: 600px) {
    .writing-header-bar {
      padding: 10px 14px;
    }
    .writing-brand-kanji {
      display: none;
    }
    .writing-btn-pill {
      font-size: 10px;
      padding: 6px 10px;
    }
  }
`;

function Writing() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [category, setCategory] = useState("pen");
  const [penType, setPenType] = useState("Gel");
  const [color, setColor] = useState("Midnight Blue");
  const [pencilType, setPencilType] = useState("HB");
  const [mechSize, setMechSize] = useState("0.5 mm");
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="writing-page-shell">
        {/* TOP COMIC HEADER BAR */}
        <header className="writing-header-bar">
          <Link to="/student" className="writing-brand-capsule">
            <div className="writing-brand-icon-circle">✏️</div>
            <div className="writing-brand-text-col">
              <span className="writing-brand-title">PLANET<span>ODYSSEY</span></span>
              <span className="writing-brand-kanji">筆記具・文房具</span>
            </div>
          </Link>

          <div className="writing-header-actions">
            <button
              type="button"
              className="writing-btn-pill"
              onClick={() => navigate(-1)}
              title="Return to base"
            >
              ← BACK TO BASE
            </button>
            <Link to="/cart" className="writing-btn-pill writing-cart-pill">
              🛒 CART ({cartItems ? cartItems.length : 0})
            </Link>
          </div>
        </header>

        {/* MAIN STAGE */}
        <div className="writing-layout-container">
          {/* Work in progress next edit */}
        </div>
      </div>
    </>
  );
}

export default Writing;
