import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&display=swap');

  :root {
    --hazard-gold: #F7B919;
    --hazard-gold-light: #FDE047;
    --blood-red: #E63946;
    --blood-red-dark: #C1121F;
    --toxic-purple: #5A2BD8;
    --toxic-purple-dark: #3F1999;
    --toxic-purple-pedestal: #6830EC;
    --slime-green: #9DE869;
    --slime-green-dark: #76C740;
    --brain-pink: #FF70A6;
    --void-black: #0D0D0D;
    --pure-white: #FFFFFF;
    --card-cream: #FFFDF0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .writing-page-shell {
    min-height: 100vh;
    background-color: var(--hazard-gold);
    background-image: 
      radial-gradient(var(--void-black) 1.2px, transparent 1.2px),
      radial-gradient(rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
    background-size: 24px 24px, 12px 12px;
    background-position: 0 0, 6px 6px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--void-black);
    padding-bottom: 60px;
    position: relative;
    overflow-x: clip;
  }

  /* TOP RETRO-COMIC APOCALYPSE BANNER */
  .writing-header-bar {
    width: 100%;
    box-sizing: border-box;
    background: var(--blood-red);
    border-bottom: 4px solid var(--void-black);
    padding: 14px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 0px rgba(0, 0, 0, 0.35);
    position: sticky;
    top: 0;
    z-index: 50;
    contain: layout paint;
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
    user-select: none;
    cursor: default;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .writing-brand-icon-circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--slime-green);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--void-black);
    overflow: hidden;
    flex-shrink: 0;
  }

  .writing-brand-icon-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    white-space: nowrap;
  }

  .writing-brand-title span {
    color: var(--slime-green);
  }

  .writing-brand-badge-tag {
    font-family: 'Archivo Black', sans-serif;
    font-size: 8.5px;
    color: var(--hazard-gold);
    letter-spacing: 0.8px;
    margin-top: 3px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .writing-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
    flex-shrink: 0;
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
    background: var(--slime-green);
    color: var(--void-black);
    border-color: var(--void-black);
  }

  .writing-cart-pill:hover {
    background: #AEF37B;
  }

  /* WRITING CONTAINER */
  .writing-layout-container {
    max-width: 1080px;
    margin: 28px auto 0 auto;
    padding: 0 18px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }

  /* LEFT HERO SHOWCASE CARD */
  .writing-hero-card {
    background: var(--hazard-gold);
    border: 4px solid var(--void-black);
    border-radius: 28px;
    padding: 28px 24px 24px 24px;
    box-shadow: 6px 6px 0px var(--void-black);
    position: relative;
    overflow: visible;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  /* FLOATING SPARKLE STARS */
  .writing-sparkle {
    position: absolute;
    color: var(--pure-white);
    font-size: 18px;
    text-shadow: 1px 1px 0px var(--void-black);
    pointer-events: none;
    user-select: none;
    animation: sparkleBob 3s ease-in-out infinite alternate;
  }

  @keyframes sparkleBob {
    0% { transform: scale(0.9) rotate(0deg); opacity: 0.8; }
    100% { transform: scale(1.15) rotate(15deg); opacity: 1; }
  }

  /* CLEAN COMIC CALLOUT BADGE */
  .writing-starburst-badge {
    align-self: flex-start;
    background: var(--pure-white);
    border: 3.5px solid var(--void-black);
    border-radius: 16px;
    box-shadow: 4px 4px 0px var(--void-black);
    padding: 8px 18px 10px 18px;
    position: relative;
    transform: rotate(-1.5deg);
    margin-top: 0;
    margin-bottom: 2px;
    display: inline-flex;
    flex-direction: column;
    gap: 2px;
  }

  .writing-starburst-protocol {
    font-family: 'Archivo Black', sans-serif;
    font-size: 9px;
    color: var(--blood-red);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    display: block;
    text-align: center;
  }

  .writing-starburst-text {
    font-family: 'Titan One', cursive;
    font-size: 20px;
    color: var(--blood-red);
    letter-spacing: 0.5px;
    line-height: 1.1;
    text-align: center;
    margin: 0;
  }

  /* HERO PUNCHY TITLES & DUAL-COL LORE */
  .writing-hero-title {
    font-family: 'Titan One', cursive;
    font-size: 24px;
    color: var(--void-black);
    text-transform: uppercase;
    line-height: 1.15;
    letter-spacing: 0.4px;
  }

  .writing-lore-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    border-top: 2px dashed rgba(13, 13, 13, 0.35);
    padding-top: 14px;
  }

  .writing-lore-item {
    font-size: 13px;
    line-height: 1.4;
    font-weight: 600;
    color: #1F2421;
  }

  .writing-lore-item strong {
    color: var(--void-black);
    font-weight: 800;
    display: block;
    margin-bottom: 2px;
  }

  /* RETRO ARCADE CONTROLLER */
  .writing-arcade-controller {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: rgba(0, 0, 0, 0.08);
    border: 3px solid var(--void-black);
    border-radius: 16px;
    padding: 8px 12px;
  }

  .writing-arcade-arrow-btn {
    width: 44px;
    height: 40px;
    background: var(--pure-white);
    border: 3px solid var(--void-black);
    border-radius: 10px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 16px;
    color: var(--void-black);
    cursor: pointer;
    box-shadow: 2px 2px 0px var(--void-black);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .writing-arcade-arrow-btn:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-arcade-arrow-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0px var(--void-black);
  }

  .writing-arcade-slider-track {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .writing-track-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--void-black);
  }

  .writing-track-bar {
    flex: 1;
    height: 10px;
    background: rgba(0, 0, 0, 0.18);
    border: 2px solid var(--void-black);
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
  }

  .writing-track-fill {
    height: 100%;
    background: var(--void-black);
    border-radius: 9999px;
    transition: width 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }

  /* RIGHT: INTERACTIVE WORKBENCH CARD */
  .writing-workbench-card {
    background: var(--card-cream);
    border: 4px solid var(--void-black);
    border-radius: 28px;
    padding: 26px;
    box-shadow: 6px 6px 0px var(--void-black);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .writing-sec-header {
    border-bottom: 3px solid var(--void-black);
    padding-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .writing-sec-title {
    font-family: 'Titan One', cursive;
    font-size: 20px;
    color: var(--void-black);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .writing-sec-tag {
    background: var(--blood-red);
    color: var(--pure-white);
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    padding: 4px 10px;
    border-radius: 9999px;
    border: 2px solid var(--void-black);
    text-transform: uppercase;
  }

  /* CATEGORY TABS */
  .writing-cat-row {
    display: flex;
    gap: 8px;
  }

  .writing-cat-btn {
    flex: 1;
    background: var(--pure-white);
    border: 3px solid var(--void-black);
    border-radius: 14px;
    padding: 10px 6px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    color: var(--void-black);
    text-align: center;
    cursor: pointer;
    box-shadow: 3px 3px 0px var(--void-black);
    transition: all 0.12s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .writing-cat-btn:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0px var(--void-black);
  }

  .writing-cat-btn.active {
    background: var(--slime-green);
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--void-black);
  }

  /* SUB-OPTION SECTION */
  .writing-field-box {
    background: var(--pure-white);
    border: 3px solid var(--void-black);
    border-radius: 18px;
    padding: 16px;
    box-shadow: 3px 3px 0px var(--void-black);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .writing-field-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    color: var(--void-black);
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .writing-pill-options {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .writing-pill-btn {
    background: #F1F3F5;
    border: 2.5px solid var(--void-black);
    border-radius: 9999px;
    padding: 6px 14px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--void-black);
    cursor: pointer;
    box-shadow: 2px 2px 0px var(--void-black);
    transition: all 0.1s ease;
  }

  .writing-pill-btn:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-pill-btn.active {
    background: var(--blood-red);
    color: var(--pure-white);
    transform: translate(1.5px, 1.5px);
    box-shadow: 0px 0px 0px var(--void-black);
  }

  /* INK COLOR SELECTOR SWATCHES */
  .writing-colors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }

  .writing-color-card {
    background: var(--pure-white);
    border: 2.5px solid var(--void-black);
    border-radius: 12px;
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 2px 2px 0px var(--void-black);
    transition: all 0.1s ease;
  }

  .writing-color-card:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-color-card.active {
    background: var(--hazard-gold-light);
    border-color: var(--void-black);
    transform: translate(1.5px, 1.5px);
    box-shadow: 0px 0px 0px var(--void-black);
  }

  .writing-color-swatch {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid var(--void-black);
    flex-shrink: 0;
  }

  .writing-color-text {
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    color: var(--void-black);
    text-transform: uppercase;
  }

  /* STEPPER AND PRESETS ROW */
  .writing-stepper-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .writing-stepper-ctrl {
    display: flex;
    align-items: center;
    background: var(--pure-white);
    border: 3px solid var(--void-black);
    border-radius: 9999px;
    box-shadow: 3px 3px 0px var(--void-black);
    overflow: hidden;
  }

  .writing-step-btn {
    width: 38px;
    height: 38px;
    background: transparent;
    border: none;
    font-family: 'Archivo Black', sans-serif;
    font-size: 18px;
    color: var(--void-black);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s ease;
  }

  .writing-step-btn:hover {
    background: var(--slime-green);
  }

  .writing-step-val {
    font-family: 'Archivo Black', sans-serif;
    font-size: 15px;
    padding: 0 14px;
    min-width: 44px;
    text-align: center;
    border-left: 2px solid var(--void-black);
    border-right: 2px solid var(--void-black);
  }

  .writing-presets-row {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .writing-preset-btn {
    background: var(--pure-white);
    border: 2px solid var(--void-black);
    border-radius: 9999px;
    padding: 4px 10px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--void-black);
    cursor: pointer;
    box-shadow: 2px 2px 0px var(--void-black);
    transition: all 0.1s ease;
  }

  .writing-preset-btn:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-preset-btn.active {
    background: var(--slime-green);
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px var(--void-black);
  }

  .writing-total-banner {
    background: var(--void-black);
    color: var(--pure-white);
    border: 3px solid var(--void-black);
    border-radius: 14px;
    padding: 8px 16px;
    display: flex;
    align-items: baseline;
    gap: 6px;
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
  }

  .writing-total-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    color: var(--slime-green);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .writing-total-price {
    font-family: 'Titan One', cursive;
    font-size: 22px;
    color: var(--pure-white);
  }

  /* PRIMARY ACTION CTA */
  .writing-add-cta {
    width: 100%;
    background: var(--slime-green);
    color: var(--void-black);
    border: 4px solid var(--void-black);
    border-radius: 18px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 16px;
    text-transform: uppercase;
    padding: 14px 20px;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--void-black);
    transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .writing-add-cta:hover {
    transform: translate(-1.5px, -1.5px);
    box-shadow: 6px 6px 0px var(--void-black);
    background: #AEF37B;
  }

  .writing-add-cta:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--void-black);
  }

  /* TOAST POPUP */
  .writing-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--void-black);
    color: var(--slime-green);
    border: 3px solid var(--slime-green);
    border-radius: 9999px;
    padding: 10px 22px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 100;
  }

  @media (max-width: 860px) {
    .writing-layout-container {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .writing-header-bar {
      padding: 10px 14px;
    }
    .writing-btn-pill {
      font-size: 10px;
      padding: 6px 10px;
    }
    .writing-lore-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const CATALOG_ITEMS = [
  {
    id: "pen-gel",
    category: "pen",
    type: "Gel",
    title: "NEO-GEL BIOHAZARD PEN",
    protocol: "BIOHAZARD PROTOCOL // SEC-01",
    badge: "GEL-01",
    basePrice: 10,
    lore1: "Zero-bleed tungsten carbide ball nib with acid-resistant dark pigment.",
    lore2: "Combat-grade flow engineered for thesis defense and blackout exam blitzes.",
  },
  {
    id: "pen-ball",
    category: "pen",
    type: "Ball",
    title: "OUTPOST TACTICAL BALLPOINT",
    protocol: "SURVIVAL DEPLOYMENT // SEC-02",
    badge: "BALL-02",
    basePrice: 10,
    lore1: "High-viscosity pressurized formula that glides across damp evidence logs.",
    lore2: "Ergonomic knurled rubber shock grip eliminates wrist fatigue.",
  },
  {
    id: "pencil-graphite",
    category: "pencil",
    type: "Graphite",
    title: "SURVIVAL 2B GRAPHITE CORE",
    protocol: "RECON LOGGING // SEC-03",
    badge: "LEAD-03",
    basePrice: 10,
    lore1: "Dense micro-carbon core engineered for break-resistant mathematical graphing.",
    lore2: "Smooth dark lead deposit calibrated for architectural sketches and OMR sheets.",
  },
  {
    id: "pencil-mechanical",
    category: "mechanical",
    type: "Mechanical",
    title: "AERO-CLUTCH TITAN MECHANICAL",
    protocol: "PRECISION ENG // SEC-04",
    badge: "MECH-04",
    basePrice: 50,
    lore1: "Hardened three-jaw brass clutch prevents lead snaps under panic pressure.",
    lore2: "Low center of gravity with knurled steel grip for tactical precision.",
  },
];

const INK_COLORS = [
  { name: "Abyssal Black", hex: "#0D0D0D" },
  { name: "Toxic Blue", hex: "#1D4ED8" },
  { name: "Zombie Blood Red", hex: "#DC2626" },
  { name: "Slime Green", hex: "#16A34A" },
];

function Writing() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [activeIndex, setActiveIndex] = useState(0);
  const currentCatalog = CATALOG_ITEMS[activeIndex];

  const [category, setCategory] = useState("pen");
  const [penType, setPenType] = useState("Gel");
  const [color, setColor] = useState("Abyssal Black");
  const [pencilType, setPencilType] = useState("HB");
  const [mechSize, setMechSize] = useState("0.5 mm");
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "" });

  // Scroll to top on fresh mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Escape key returns to base
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handlePrev = () => {
    const nextIdx = activeIndex > 0 ? activeIndex - 1 : CATALOG_ITEMS.length - 1;
    setActiveIndex(nextIdx);
    setCategory(CATALOG_ITEMS[nextIdx].category);
  };

  const handleNext = () => {
    const nextIdx = activeIndex < CATALOG_ITEMS.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(nextIdx);
    setCategory(CATALOG_ITEMS[nextIdx].category);
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const foundIdx = CATALOG_ITEMS.findIndex((item) => item.category === newCat);
    if (foundIdx !== -1) setActiveIndex(foundIdx);
  };

  // Compute product name & price
  let name = "";
  let price = 0;

  if (category === "pen") {
    name = `${penType} Pen (${color})`;
    price = 10;
  } else if (category === "pencil") {
    name = `${pencilType} Graphite Pencil`;
    price = 10;
  } else if (category === "mechanical") {
    name = `Mechanical Pencil (${mechSize})`;
    price = 50;
  }

  const grandTotal = price * (qty || 1);

  const handleAdd = () => {
    if (!name) return showToast("Complete tool selection first!");
    addToCart({ name, price, quantity: qty });
    showToast(`Added ${qty}x ${name} to Survival Loadout!`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="writing-page-shell">
        {/* TOP COMIC HEADER BAR */}
        <header className="writing-header-bar">
          <div className="writing-brand-capsule">
            <div className="writing-brand-icon-circle">
              <img src="/zombie-rip-pfp.jpg" alt="Zombie pfp" />
            </div>
            <div className="writing-brand-text-col">
              <span className="writing-brand-title">ODYSSEY // <span>OUTPOST</span></span>
              <span className="writing-brand-badge-tag">TACTICAL WRITING ARSENAL</span>
            </div>
          </div>

          <div className="writing-header-actions">
            <button
              type="button"
              className="writing-btn-pill"
              onClick={() => navigate(-1)}
              title="Return to base (Esc)"
            >
              ← BACK TO BASE
            </button>
            <Link to="/cart" className="writing-btn-pill writing-cart-pill">
              CART ({cartItems ? cartItems.length : 0})
            </Link>
          </div>
        </header>

        {/* MAIN STAGE CONTAINER */}
        <div className="writing-layout-container">
          {/* LEFT: HERO SHOWCASE STAGE */}
          <section className="writing-hero-card">
            {/* SPARKLES */}
            <span className="writing-sparkle" style={{ top: 16, right: 28 }}>✦</span>
            <span className="writing-sparkle" style={{ top: 72, left: 24, fontSize: 14 }}>✧</span>
            <span className="writing-sparkle" style={{ bottom: 120, right: 18, fontSize: 16 }}>✦</span>



            {/* JAGGED COMIC STARBURST BADGE */}
            <div className="writing-starburst-badge">
              <span className="writing-starburst-protocol">{currentCatalog.protocol}</span>
              <h2 className="writing-starburst-text">{currentCatalog.title}</h2>
            </div>

            {/* PUNCHY TITLE & TWO-COLUMN LORE */}
            <div>
              <h3 className="writing-hero-title">
                APOCALYPSE-GRADE TOOLS FOR EXAM SURVIVORS
              </h3>
            </div>

            <div className="writing-lore-grid">
              <div className="writing-lore-item">
                <strong>SPECIFICATION //</strong>
                {currentCatalog.lore1}
              </div>
              <div className="writing-lore-item">
                <strong>DEPLOYMENT //</strong>
                {currentCatalog.lore2}
              </div>
            </div>

            {/* RETRO ARCADE CONTROLLER */}
            <div className="writing-arcade-controller">
              <button
                type="button"
                className="writing-arcade-arrow-btn"
                onClick={handlePrev}
                aria-label="Previous item"
              >
                ←
              </button>

              <div className="writing-arcade-slider-track">
                <div className="writing-track-dot" />
                <div className="writing-track-bar">
                  <div
                    className="writing-track-fill"
                    style={{
                      width: `${((activeIndex + 1) / CATALOG_ITEMS.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="writing-track-dot" />
              </div>

              <button
                type="button"
                className="writing-arcade-arrow-btn"
                onClick={handleNext}
                aria-label="Next item"
              >
                →
              </button>
            </div>
          </section>

          {/* RIGHT: INTERACTIVE WORKBENCH CONFIG */}
          <main className="writing-workbench-card">
            <div className="writing-sec-header">
              <h2 className="writing-sec-title">TOOL CONFIGURATION</h2>
              <span className="writing-sec-tag">SURVIVAL LOADOUT ARSENAL</span>
            </div>

            {/* CATEGORY SWITCHER */}
            <div className="writing-cat-row">
              <button
                type="button"
                className={`writing-cat-btn ${category === "pen" ? "active" : ""}`}
                onClick={() => handleCategoryChange("pen")}
              >
                
                <span>PENS</span>
              </button>
              <button
                type="button"
                className={`writing-cat-btn ${category === "pencil" ? "active" : ""}`}
                onClick={() => handleCategoryChange("pencil")}
              >
                
                <span>PENCILS</span>
              </button>
              <button
                type="button"
                className={`writing-cat-btn ${category === "mechanical" ? "active" : ""}`}
                onClick={() => handleCategoryChange("mechanical")}
              >
                
                <span>MECHANICAL</span>
              </button>
            </div>

            {/* DYNAMIC SUB-OPTION: PEN */}
            {category === "pen" && (
              <div className="writing-field-box">
                <span className="writing-field-label">1. Nib & Ink Technology</span>
                <div className="writing-pill-options">
                  {["Gel", "Ball"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`writing-pill-btn ${penType === type ? "active" : ""}`}
                      onClick={() => setPenType(type)}
                    >
                      {type === "Gel" ? "Quick-Dry Gel" : "Durable Ballpoint"}
                    </button>
                  ))}
                </div>

                <span className="writing-field-label" style={{ marginTop: 8 }}>
                  2. Pigment Spectrum
                </span>
                <div className="writing-colors-grid">
                  {INK_COLORS.map((c) => (
                    <div
                      key={c.name}
                      className={`writing-color-card ${color === c.name ? "active" : ""}`}
                      onClick={() => setColor(c.name)}
                    >
                      <div
                        className="writing-color-swatch"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="writing-color-text">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DYNAMIC SUB-OPTION: PENCIL */}
            {category === "pencil" && (
              <div className="writing-field-box">
                <span className="writing-field-label">Graphite Density & Hardness</span>
                <div className="writing-pill-options">
                  {["Normal", "HB", "2B"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`writing-pill-btn ${pencilType === g ? "active" : ""}`}
                      onClick={() => setPencilType(g)}
                    >
                      {g} {g === "2B" ? "• Dark & Soft" : g === "HB" ? "• Standard Core" : "• Light Draft"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DYNAMIC SUB-OPTION: MECHANICAL */}
            {category === "mechanical" && (
              <div className="writing-field-box">
                <span className="writing-field-label">Precision Lead Gauge</span>
                <div className="writing-pill-options">
                  {["0.5 mm", "0.7 mm"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`writing-pill-btn ${mechSize === size ? "active" : ""}`}
                      onClick={() => setMechSize(size)}
                    >
                      {size} {size === "0.5 mm" ? "• Ultra Fine Drafting" : "• Balanced Note-Taking"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY & RAPID PRESETS */}
            <div className="writing-stepper-row">
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <div className="writing-stepper-ctrl">
                  <button
                    type="button"
                    className="writing-step-btn"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="writing-step-val">{qty}</span>
                  <button
                    type="button"
                    className="writing-step-btn"
                    onClick={() => setQty((prev) => prev + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="writing-presets-row">
                  {[1, 2, 5, 10].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`writing-preset-btn ${qty === preset ? "active" : ""}`}
                      onClick={() => setQty(preset)}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="writing-total-banner">
                <span className="writing-total-label">Loadout Cost:</span>
                <span className="writing-total-price">₹{grandTotal}</span>
              </div>
            </div>

            {/* PRIMARY ACTION CTA */}
            <button
              type="button"
              className="writing-add-cta"
              onClick={handleAdd}
            >
              Add to Survival Loadout • ₹{grandTotal}
            </button>
          </main>
        </div>

        {/* TOAST POPUP */}
        {toast.show && (
          <div className="writing-toast">
            {toast.message}
          </div>
        )}
      </div>
    </>
  );
}

export default Writing;
