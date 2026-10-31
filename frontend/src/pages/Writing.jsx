import React, { useState } from "react";
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
    --planet-purple-pedestal: #6830EC;
    --slime-green: #9DE869;
    --slime-green-dark: #76C740;
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

  /* WRITING WRAPPER & MAIN WORKBENCH GRID */
  .writing-layout-container {
    max-width: 1080px;
    margin: 28px auto 0 auto;
    padding: 0 18px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }

  /* LEFT HERO SHOWCASE CARD (PLANET-OÑO RETRO STYLE) */
  .writing-hero-card {
    background: var(--planet-yellow);
    border: 4px solid var(--void-black);
    border-radius: 28px;
    padding: 24px;
    box-shadow: 6px 6px 0px var(--void-black);
    position: relative;
    overflow: hidden;
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

  /* 3D PURPLE ISOMETRIC PEDESTAL */
  .writing-pedestal-wrapper {
    position: relative;
    width: 100%;
    height: 220px;
    background: radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
  }

  .writing-isometric-pedestal {
    width: 250px;
    height: 120px;
    background: var(--planet-purple-pedestal);
    border: 3.5px solid var(--void-black);
    border-radius: 24px;
    transform: perspective(600px) rotateX(28deg) rotateZ(-3deg);
    box-shadow: 
      0 18px 0px var(--planet-purple-dark),
      0 22px 0px var(--void-black),
      6px 28px 0px rgba(0, 0, 0, 0.4);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 12px;
  }

  .writing-pedestal-item {
    font-size: 52px;
    filter: drop-shadow(3px 4px 0px rgba(0, 0, 0, 0.5));
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: rotateX(-20deg) translateY(-16px);
    cursor: pointer;
  }

  .writing-pedestal-item:hover {
    transform: rotateX(-20deg) translateY(-26px) scale(1.15);
  }

  .writing-pedestal-mascot {
    position: absolute;
    top: -24px;
    left: 18px;
    font-size: 38px;
    filter: drop-shadow(2px 2px 0px var(--void-black));
    transform: rotate(-10deg);
  }

  /* JAGGED COMIC EXPLOSION STARBURST BADGE */
  .writing-starburst-badge {
    align-self: flex-start;
    background: var(--pure-white);
    border: 3.5px solid var(--void-black);
    box-shadow: 4px 4px 0px var(--void-black);
    padding: 10px 18px;
    position: relative;
    transform: rotate(-2deg);
    border-radius: 12px;
    clip-path: polygon(
      0% 12%, 8% 0%, 24% 10%, 42% 0%, 58% 12%, 76% 2%, 92% 14%, 100% 0%, 
      98% 38%, 100% 64%, 94% 88%, 100% 100%, 78% 92%, 58% 100%, 40% 90%, 
      22% 100%, 6% 92%, 0% 100%, 4% 68%, 0% 42%
    );
    margin-top: -12px;
    margin-bottom: 2px;
  }

  .writing-starburst-kanji {
    font-size: 9px;
    font-weight: 900;
    color: var(--planet-red);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    display: block;
    text-align: center;
  }

  .writing-starburst-text {
    font-family: 'Titan One', cursive;
    font-size: 20px;
    color: var(--planet-red);
    letter-spacing: 0.5px;
    line-height: 1.1;
    text-align: center;
    margin: 0;
  }

  /* HERO PUNCHY COMIC HEADINGS & DUAL-COL LORE */
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

  /* RETRO ARCADE CAROUSEL CONTROLLER */
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
    background: var(--planet-red);
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
    background: var(--planet-yellow);
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
    background: var(--planet-red);
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
    background: #FDE047;
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

  /* STEPPER AND TOTAL ROW */
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
    background: var(--planet-yellow);
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
    color: var(--planet-yellow);
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
    .writing-brand-kanji {
      display: none;
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
    title: "NEO-GEL MARATHON PEN",
    kanji: "ハイパーゲルペン",
    icon: "🖊️",
    mascot: "🐥",
    basePrice: 10,
    lore1: "Zero-bleed tungsten carbide ball nib with quick-drying deep pigment.",
    lore2: "Specially weighted for marathon exams and high-velocity lecture notes.",
  },
  {
    id: "pen-ball",
    category: "pen",
    type: "Ball",
    title: "RAPID BALLPOINT TITAN",
    kanji: "高耐久ボールペン",
    icon: "🖋️",
    mascot: "⚡",
    basePrice: 10,
    lore1: "High-viscosity oil-based formula that glides over any paper stock.",
    lore2: "Ergonomic tactile rubber ribbing eliminates wrist fatigue.",
  },
  {
    id: "pencil-graphite",
    category: "pencil",
    type: "Graphite",
    title: "TITAN 2B GRAPHITE PENCIL",
    kanji: "最高級黒鉛鉛筆",
    icon: "✏️",
    mascot: "⭐",
    basePrice: 10,
    lore1: "Dense micro-carbon core engineered for break-resistant mathematical graphing.",
    lore2: "Smooth velvety deposit perfect for shading, drafts, and OMR sheets.",
  },
  {
    id: "pencil-mechanical",
    category: "mechanical",
    type: "Mechanical",
    title: "AERO-CLUTCH MECHANICAL",
    kanji: "製図用シャープペン",
    icon: "📐",
    mascot: "🚀",
    basePrice: 50,
    lore1: "Brass three-jaw chuck system prevents lead snaps under heavy pressure.",
    lore2: "Knurled steel grip and low center of gravity for surgical drafting accuracy.",
  },
];

const INK_COLORS = [
  { name: "Midnight Blue", hex: "#1D4ED8" },
  { name: "Abyssal Black", hex: "#0F172A" },
  { name: "Crimson Red", hex: "#DC2626" },
  { name: "Toxic Green", hex: "#16A34A" },
];

function Writing() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [activeIndex, setActiveIndex] = useState(0);
  const currentCatalog = CATALOG_ITEMS[activeIndex];

  const [category, setCategory] = useState("pen");
  const [penType, setPenType] = useState("Gel");
  const [color, setColor] = useState("Midnight Blue");
  const [pencilType, setPencilType] = useState("HB");
  const [mechSize, setMechSize] = useState("0.5 mm");
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "" });

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
    if (!name) return showToast("⚠️ Complete tool selection first!");
    addToCart({ name, price, quantity: qty });
    showToast(`⚡ Added ${qty}x ${name} to Survival Loadout!`);
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

        {/* MAIN STAGE CONTAINER */}
        <div className="writing-layout-container">
          {/* LEFT: HERO SHOWCASE STAGE */}
          <section className="writing-hero-card">
            {/* SPARKLES */}
            <span className="writing-sparkle" style={{ top: 16, right: 28 }}>✦</span>
            <span className="writing-sparkle" style={{ top: 72, left: 24, fontSize: 14 }}>✧</span>
            <span className="writing-sparkle" style={{ bottom: 120, right: 18, fontSize: 16 }}>✦</span>

            {/* 3D ISOMETRIC PEDESTAL */}
            <div className="writing-pedestal-wrapper">
              <div className="writing-isometric-pedestal">
                <span className="writing-pedestal-mascot">{currentCatalog.mascot}</span>
                <span className="writing-pedestal-item" title={currentCatalog.title}>
                  {currentCatalog.icon}
                </span>
                <span className="writing-pedestal-item" style={{ fontSize: 44, opacity: 0.9 }}>
                  📝
                </span>
              </div>
            </div>

            {/* JAGGED COMIC STARBURST BADGE */}
            <div className="writing-starburst-badge">
              <span className="writing-starburst-kanji">{currentCatalog.kanji}</span>
              <h2 className="writing-starburst-text">{currentCatalog.title}</h2>
            </div>

            {/* PUNCHY TITLE & TWO-COLUMN LORE */}
            <div>
              <h3 className="writing-hero-title">
                CELESTIAL FUEL FOR MARATHON WRITERS
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
              <span className="writing-sec-tag">TACTICAL STUDY ARSENAL</span>
            </div>

            {/* CATEGORY SWITCHER */}
            <div className="writing-cat-row">
              <button
                type="button"
                className={`writing-cat-btn ${category === "pen" ? "active" : ""}`}
                onClick={() => handleCategoryChange("pen")}
              >
                <span style={{ fontSize: 20 }}>🖊️</span>
                <span>PENS</span>
              </button>
              <button
                type="button"
                className={`writing-cat-btn ${category === "pencil" ? "active" : ""}`}
                onClick={() => handleCategoryChange("pencil")}
              >
                <span style={{ fontSize: 20 }}>✏️</span>
                <span>PENCILS</span>
              </button>
              <button
                type="button"
                className={`writing-cat-btn ${category === "mechanical" ? "active" : ""}`}
                onClick={() => handleCategoryChange("mechanical")}
              >
                <span style={{ fontSize: 20 }}>📐</span>
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
                      {type === "Gel" ? "⚡ Quick-Dry Gel" : "🖊️ Durable Ballpoint"}
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

            {/* QUANTITY & TOTAL */}
            <div className="writing-stepper-row">
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
              Add to Survival Loadout • ₹{grandTotal} 🎒
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
