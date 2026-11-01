import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&display=swap');

  :root {
    --slime-green: #9DE869;
    --slime-green-dark: #78D83F;
    --void-black: #0D0D0D;
    --seafoam: #45B89E;
    --hazard-gold: #F7B919;
    --brain-pink: #FF70A6;
    --parchment: #F9F9F3;
    --grave-grey: #A8B3B8;
    --pure-white: #FFFFFF;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .writing-page-shell {
    width: 100vw;
    height: 100vh;
    background-color: #019E70;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--parchment);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* 100% PURE VECTOR BACKDROP */
  .writing-bg-layer {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    background-color: #019E70;
  }

  .writing-bg-vector {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center bottom;
    display: block;
  }

  /* TOP HEADER BAR */
  .writing-header-bar {
    width: 100%;
    padding: 16px 28px 8px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    z-index: 50;
    flex-shrink: 0;
  }

  .writing-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .writing-btn-pill {
    background: var(--void-black);
    color: var(--pure-white);
    border: 3px solid var(--void-black);
    border-radius: 9999px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    padding: 8px 18px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.4);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .writing-btn-pill:hover {
    transform: translate(-1.5px, -1.5px);
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);
    background: #1C1F26;
  }

  .writing-btn-pill:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  }

  .writing-cart-pill {
    background: var(--slime-green);
    color: var(--void-black);
    border-color: var(--void-black);
  }

  .writing-cart-pill:hover {
    background: #AEF37B;
  }

  /* GAME CENTER STAGE (HILL CLIMB RACING CAROUSEL STYLE) */
  .writing-game-stage {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 20;
    padding: 0 20px;
    margin-top: -10px;
  }

  /* GAME HEADLINE */
  .writing-game-headline {
    text-align: center;
    margin-bottom: 14px;
    user-select: none;
  }

  .writing-game-category-tag {
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--slime-green);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    text-shadow: 2px 2px 0px var(--void-black);
  }

  .writing-game-model-title {
    font-family: 'Titan One', cursive;
    font-size: 34px;
    color: var(--pure-white);
    letter-spacing: 1px;
    line-height: 1.1;
    text-shadow: 4px 4px 0px var(--void-black), -2px -2px 0px var(--void-black), 2px -2px 0px var(--void-black), -2px 2px 0px var(--void-black);
  }

  /* CAROUSEL CONTAINER (PREV, ACTIVE, NEXT) */
  .writing-carousel-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    width: 100%;
    max-width: 1100px;
  }

  /* CAROUSEL NAV ARROW BUTTONS */
  .writing-nav-arrow-btn {
    width: 58px;
    height: 58px;
    background: rgba(13, 13, 13, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: var(--slime-green);
    border: 3.5px solid var(--void-black);
    border-radius: 50%;
    font-family: 'Archivo Black', sans-serif;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px 0px var(--void-black);
    cursor: pointer;
    transition: transform 0.12s ease, background 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
    user-select: none;
    flex-shrink: 0;
  }

  .writing-nav-arrow-btn:hover {
    background: var(--slime-green);
    color: var(--void-black);
    transform: scale(1.08) translate(-1px, -1px);
    box-shadow: 5px 5px 0px var(--void-black);
  }

  .writing-nav-arrow-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--void-black);
  }

  /* MAIN ACTIVE GLASSMORPHISM CARD */
  .writing-active-glass-card {
    width: 650px;
    max-width: 92vw;
    background: rgba(13, 13, 13, 0.74);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 4px solid var(--void-black);
    border-radius: 18px;
    box-shadow: 6px 6px 0px var(--void-black);
    padding: 26px 30px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    flex-shrink: 0;
  }

  /* TELEMETRY TAG */
  .writing-card-badge-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .writing-protocol-pill {
    background: var(--slime-green);
    color: var(--void-black);
    border: 2px solid var(--void-black);
    border-radius: 6px;
    padding: 4px 10px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    letter-spacing: 0.5px;
    box-shadow: 2px 2px 0px var(--void-black);
  }

  .writing-base-price-pill {
    background: var(--hazard-gold);
    color: var(--void-black);
    border: 2px solid var(--void-black);
    border-radius: 6px;
    padding: 4px 12px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 13px;
    box-shadow: 2px 2px 0px var(--void-black);
  }

  /* SPECIFICATION LORE */
  .writing-spec-lore {
    font-size: 13px;
    color: var(--parchment);
    line-height: 1.4;
    background: rgba(0, 0, 0, 0.35);
    padding: 10px 14px;
    border-radius: 8px;
    border-left: 3px solid var(--slime-green);
  }

  /* OPTIONS ROW (NIBS, INK COLORS, LEAD GRADES) */
  .writing-options-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    background: rgba(0, 0, 0, 0.4);
    padding: 10px 14px;
    border-radius: 10px;
    border: 2px solid #232A35;
  }

  .writing-pill-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .writing-option-pill-btn {
    background: #191E26;
    color: var(--parchment);
    border: 2px solid #2C3542;
    border-radius: 6px;
    padding: 6px 12px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.1s ease;
  }

  .writing-option-pill-btn:hover {
    border-color: var(--seafoam);
    color: var(--pure-white);
  }

  .writing-option-pill-btn.active {
    background: var(--seafoam);
    color: var(--void-black);
    border-color: var(--void-black);
    box-shadow: 2px 2px 0px var(--void-black);
  }

  /* INK COLOR SWATCHES */
  .writing-ink-swatches {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .writing-ink-dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #333D4B;
    transition: transform 0.1s ease;
  }

  .writing-ink-dot:hover {
    transform: scale(1.15);
  }

  .writing-ink-dot.active {
    border: 2px solid var(--pure-white);
    transform: scale(1.15);
    box-shadow: 0 0 0 2px var(--void-black);
  }

  /* ACTION DISPATCH ROW (STEPPER + CTA) */
  .writing-action-dispatch-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 2px;
  }

  .writing-stepper-ctrl {
    display: flex;
    align-items: center;
    background: #14181F;
    border: 3px solid var(--void-black);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-step-btn {
    background: #1F2530;
    color: var(--parchment);
    border: none;
    width: 36px;
    height: 42px;
    font-size: 18px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s ease;
  }

  .writing-step-btn:hover {
    background: #2C3545;
  }

  .writing-step-val {
    min-width: 36px;
    text-align: center;
    font-family: 'Archivo Black', sans-serif;
    font-size: 15px;
    color: var(--pure-white);
  }

  .writing-game-cta-btn {
    flex: 1;
    background: var(--brain-pink);
    color: var(--void-black);
    border: 3px solid var(--void-black);
    border-radius: 8px;
    padding: 12px 20px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--void-black);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    text-align: center;
  }

  .writing-game-cta-btn:hover {
    transform: translate(-1.5px, -1.5px);
    box-shadow: 5px 5px 0px var(--void-black);
    background: #FF85B3;
  }

  .writing-game-cta-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--void-black);
  }

  /* BOTTOM GAME NAVIGATION TABS (SITTING DIRECTLY ON MOUNTAIN RIDGE) */
  .writing-bottom-tabs-dock {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    padding: 0 20px 48px;
    position: relative;
    z-index: 50;
    flex-shrink: 0;
    transform: translateY(-44px);
  }

  .writing-game-tab {
    background: rgba(19, 24, 32, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: var(--parchment);
    border: 3px solid var(--void-black);
    border-radius: 10px;
    padding: 12px 32px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    letter-spacing: 0.8px;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--void-black);
    transition: all 0.12s ease;
    user-select: none;
  }

  .writing-game-tab:hover {
    transform: translateY(-2px);
    color: var(--pure-white);
    border-color: var(--slime-green);
  }

  .writing-game-tab.active {
    background: var(--slime-green);
    color: var(--void-black);
    border-color: var(--void-black);
    box-shadow: 4px 4px 0px var(--void-black);
    transform: translateY(-2px);
  }

  /* TOAST */
  .writing-toast {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--slime-green);
    color: var(--void-black);
    border: 3px solid var(--void-black);
    border-radius: 9999px;
    padding: 10px 26px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 13px;
    box-shadow: 4px 4px 0px var(--void-black);
    z-index: 100;
    animation: toastSlide 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    white-space: nowrap;
  }

  @keyframes toastSlide {
    from {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  @media (max-width: 768px) {
    .writing-carousel-row {
      gap: 8px;
    }
    .writing-nav-arrow-btn {
      width: 44px;
      height: 44px;
      font-size: 20px;
    }
    .writing-active-glass-card {
      width: 100%;
      max-width: 420px;
      padding: 16px;
    }
  }
`;

const CATALOG_ITEMS = [
  // PENS
  {
    id: "pen-hauser",
    category: "pen",
    modelName: "Hauser XO",
    subtitle: "0.6mm Ultra-Smooth Ball",
    title: "HAUSER XO // ULTRA-SMOOTH",
    protocol: "HAUSER PROTOCOL // XO-01",
    basePrice: 10,
    lore1: "Ultra-low viscosity German ink with 0.6mm tungsten carbide ball nib.",
    lore2: "Minimal drag coefficient engineered for marathon exam writing with zero fatigue.",
  },
  {
    id: "pen-pentonic",
    category: "pen",
    modelName: "Linc Pentonic",
    subtitle: "0.7mm Matte Black Gel/Ball",
    title: "PENTONIC // MATTE STEALTH",
    protocol: "PENTONIC PROTOCOL // PT-02",
    basePrice: 10,
    lore1: "Sleek aerodynamic matte black casing with feather-light skip-free ink flow.",
    lore2: "Smudge-resistant rapid-dry formulation ideal for high-speed answer sheets.",
  },
  {
    id: "pen-rorito",
    category: "pen",
    modelName: "Rorito Flymax / Teramax",
    subtitle: "Precision Liquid Fluid Ink",
    title: "RORITO TERAMAX // FLUID INK",
    protocol: "TERAMAX PROTOCOL // TM-03",
    basePrice: 20,
    lore1: "Advanced fluid ink regulator ensures continuous, uniform high-contrast lines.",
    lore2: "High-capacity ink reservoir designed for uninterrupted long-form descriptive exams.",
  },
  {
    id: "pen-pilot",
    category: "pen",
    modelName: "Pilot V5 / V7 Hi-Tecpoint",
    subtitle: "Needle Tip Japanese Roller",
    title: "PILOT HI-TECPOINT // V5-V7",
    protocol: "PILOT PROTOCOL // PV-04",
    basePrice: 60,
    lore1: "Micro-fine stainless steel needle tip with multi-channel liquid ink feed system.",
    lore2: "Surgical line precision calibrated for intricate diagrams and dense notations.",
  },
  {
    id: "pen-butterflow",
    category: "pen",
    modelName: "Cello Butterflow",
    subtitle: "Low-Viscosity Ergonomic Ball",
    title: "CELLO BUTTERFLOW // HYBRID",
    protocol: "BUTTERFLOW PROTOCOL // CB-05",
    basePrice: 10,
    lore1: "Lubriflow ink mechanism paired with textured comfort grip for zero-pressure writing.",
    lore2: "Time-tested standard issue reliability across grueling 3-hour university exams.",
  },
  {
    id: "pen-reynolds",
    category: "pen",
    modelName: "Reynolds 045 Carbure",
    subtitle: "Classic Vintage Exam Staple",
    title: "REYNOLDS 045 // CARBURE",
    protocol: "REYNOLDS PROTOCOL // RC-06",
    basePrice: 10,
    lore1: "Laser-cut brass tip delivering legendary durability and crisp handwriting.",
    lore2: "The undefeated vintage standard trusted by generations of exam survivors.",
  },

  // PENCILS
  {
    id: "pencil-apsara",
    category: "pencil",
    modelName: "Apsara Platinum Extra Dark",
    subtitle: "Dark Lead Exam Shading",
    title: "APSARA PLATINUM // EXTRA DARK",
    protocol: "APSARA PROTOCOL // AP-01",
    basePrice: 10,
    lore1: "Micro-pulverized graphite core yielding deep, pitch-black high-contrast markings.",
    lore2: "Specially formulated for machine-read OMR optical bubble sheets and bold diagrams.",
  },
  {
    id: "pencil-camlin",
    category: "pencil",
    modelName: "Camlin Kokuyo Flora",
    subtitle: "Break-Resistant Velvet Lead",
    title: "CAMLIN KOKUYO // VELVET CORE",
    protocol: "KOKUYO PROTOCOL // CK-02",
    basePrice: 10,
    lore1: "Specially treated bonded wood casing with break-resistant smooth gliding graphite.",
    lore2: "Exceptional erasability leaving zero ghostly impressions on delicate answer paper.",
  },
  {
    id: "pencil-faber",
    category: "pencil",
    modelName: "Faber-Castell 2B Matt",
    subtitle: "Non-Reflective Precision Lead",
    title: "FABER-CASTELL // 2B MATT",
    protocol: "CASTELL PROTOCOL // FC-03",
    basePrice: 15,
    lore1: "Anti-reflective deep matte graphite eliminating glare during overhead sheet scanning.",
    lore2: "Finely graded German clay-graphite matrix for technical drafting and sketching.",
  },
  {
    id: "pencil-nataraj",
    category: "pencil",
    modelName: "Nataraj 621 Bold",
    subtitle: "Classic Red/Black Hexagonal",
    title: "NATARAJ 621 // CLASSIC BOLD",
    protocol: "NATARAJ PROTOCOL // NT-04",
    basePrice: 5,
    lore1: "Iconic red-and-black hexagonal cedar casing with bonded break-proof core.",
    lore2: "The timeless academic workhorse proven across decades of school exams.",
  },
  {
    id: "pencil-staedtler",
    category: "pencil",
    modelName: "Staedtler Noris 2B",
    subtitle: "German Drafting Grade",
    title: "STAEDTLER NORIS // 2B DRAFT",
    protocol: "NORIS PROTOCOL // SN-05",
    basePrice: 35,
    lore1: "Upcycled wood WOPEX composite core offering extreme break resistance.",
    lore2: "German engineering standard for engineering graphics and rapid diagramming.",
  },
  {
    id: "pencil-doms",
    category: "pencil",
    modelName: "Doms Neon Dark",
    subtitle: "High-Contrast Ergonomic Lead",
    title: "DOMS NEON // SUPER DARK",
    protocol: "DOMS PROTOCOL // DN-06",
    basePrice: 10,
    lore1: "Soft-touch tactile barrel finish with rich black pigment-infused lead.",
    lore2: "Ergonomic triangular grip designed to relieve hand tension during timed tests.",
  },

  // MECHANICAL PENCILS
  {
    id: "mech-pentel",
    category: "mechanical",
    modelName: "Pentel GraphGear 500",
    subtitle: "Weighted Knurled Metal Grip",
    title: "PENTEL GRAPHGEAR 500 // PRO",
    protocol: "GRAPHGEAR PROTOCOL // PG-01",
    basePrice: 350,
    lore1: "Heavyweight knurled metal grip with 4mm fixed drafting sleeve for ruler work.",
    lore2: "Precision low-center-of-gravity balance for millimeter-perfect engineering plans.",
  },
  {
    id: "mech-camlin",
    category: "mechanical",
    modelName: "Camlin Trinity / Scholar",
    subtitle: "Everyday Budget Drafting",
    title: "CAMLIN TRINITY // DRAFT-05",
    protocol: "TRINITY PROTOCOL // CT-02",
    basePrice: 30,
    lore1: "Shock-absorbing cushion tip with ribbed non-slip comfort barrel.",
    lore2: "Dependable, economical everyday drafting tool for formulas and quick drafts.",
  },
  {
    id: "mech-rotring",
    category: "mechanical",
    modelName: "Rotring Tikky",
    subtitle: "German Engineering Rubber Grip",
    title: "ROTRING TIKKY // PRECISION",
    protocol: "ROTRING PROTOCOL // RT-03",
    basePrice: 450,
    lore1: "Dual-material ergonomic wave grip with high-tolerance brass clutch mechanism.",
    lore2: "Zero lead wobble or slippage under high-torque rapid technical calculations.",
  },
  {
    id: "mech-faber",
    category: "mechanical",
    modelName: "Faber-Castell Apollo",
    subtitle: "Cushioned Lead Sleeve & Eraser",
    title: "FABER-CASTELL // APOLLO",
    protocol: "APOLLO PROTOCOL // FA-04",
    basePrice: 90,
    lore1: "Spring-loaded sliding lead sleeve that retracts to shield lead from snapping.",
    lore2: "Integrated jumbo twist-out eraser barrel for rapid tactical corrections.",
  },
  {
    id: "mech-kurutoga",
    category: "mechanical",
    modelName: "Uni Kuru Toga Engine",
    subtitle: "Auto-Rotating Constant Sharp Tip",
    title: "UNI KURU TOGA // ROTATING CORE",
    protocol: "KURUTOGA PROTOCOL // UK-05",
    basePrice: 420,
    lore1: "Patented internal kinetic gear rotates lead 9 degrees with every paper lift.",
    lore2: "Maintains a constant conical razor-sharp chisel point with zero flat spots.",
  },
  {
    id: "mech-delguard",
    category: "mechanical",
    modelName: "Zebra DelGuard Unbreakable",
    subtitle: "Dual-Spring Anti-Snap Shield",
    title: "ZEBRA DELGUARD // SHIELD",
    protocol: "DELGUARD PROTOCOL // ZD-06",
    basePrice: 480,
    lore1: "Patented double-spring shock absorption protects lead from any angle or pressure.",
    lore2: "Indestructible tactical clutch engineered for heavy-handed panic exam writers.",
  },
];

const INK_COLORS = [
  { name: "Abyssal Black", hex: "#0D0D0D" },
  { name: "Toxic Blue", hex: "#1D4ED8" },
  { name: "Zombie Red", hex: "#DC2626" },
  { name: "Slime Green", hex: "#16A34A" },
];

function Writing() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [category, setCategory] = useState("pen");
  const [activeId, setActiveId] = useState("pen-hauser");
  const [penType, setPenType] = useState("Gel");
  const [color, setColor] = useState("Abyssal Black");
  const [pencilType, setPencilType] = useState("HB");
  const [mechSize, setMechSize] = useState("0.5 mm");
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "" });

  const categoryItems = CATALOG_ITEMS.filter((item) => item.category === category);
  const currentCatalog = CATALOG_ITEMS.find((item) => item.id === activeId) || categoryItems[0] || CATALOG_ITEMS[0];
  const currentIndex = categoryItems.findIndex((item) => item.id === currentCatalog.id);

  const prevIndex = (currentIndex - 1 + categoryItems.length) % categoryItems.length;
  const nextIndex = (currentIndex + 1) % categoryItems.length;
  const prevItem = categoryItems[prevIndex];
  const nextItem = categoryItems[nextIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(-1);
      } else if (e.key === "ArrowLeft") {
        setActiveId(prevItem.id);
      } else if (e.key === "ArrowRight") {
        setActiveId(nextItem.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, prevItem, nextItem]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const firstItem = CATALOG_ITEMS.find((item) => item.category === newCat);
    if (firstItem) setActiveId(firstItem.id);
  };

  let productName = "";
  const unitPrice = currentCatalog.basePrice;

  if (category === "pen") {
    productName = `${currentCatalog.modelName} (${color}, ${penType})`;
  } else if (category === "pencil") {
    productName = `${currentCatalog.modelName} (${pencilType} Core)`;
  } else if (category === "mechanical") {
    productName = `${currentCatalog.modelName} (${mechSize})`;
  }

  const grandTotal = unitPrice * (qty || 1);

  const handleAdd = () => {
    if (!productName) return showToast("Select tool first");
    addToCart({ name: productName, price: unitPrice, quantity: qty });
    showToast(`Added ${qty}x ${productName} to Survival Loadout`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="writing-page-shell">
        {/* 100% PURE VECTOR BACKDROP */}
        <div className="writing-bg-layer" aria-hidden="true">
          <img
            src="/halloween-reference-landscape.svg?v=10"
            alt=""
            className="writing-bg-vector"
          />
        </div>

        {/* TOP RETRO-COMIC HEADER BAR */}
        <header className="writing-header-bar">
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

        {/* HILL CLIMB RACING STYLE GAME CAROUSEL STAGE */}
        <main className="writing-game-stage">
          {/* HEADLINE */}
          <div className="writing-game-headline">
            <div className="writing-game-category-tag">
              {category.toUpperCase()} // ARSENAL SELECTION
            </div>
            <h1 className="writing-game-model-title">{currentCatalog.modelName}</h1>
          </div>

          {/* 3-PIECE CAROUSEL ROW (ARROW - GLASS CARD - ARROW) */}
          <div className="writing-carousel-row">
            {/* LEFT ARROW */}
            <button
              type="button"
              className="writing-nav-arrow-btn"
              onClick={() => setActiveId(prevItem.id)}
              aria-label={`Previous: ${prevItem.modelName}`}
              title={`Previous: ${prevItem.modelName} (← key)`}
            >
              ←
            </button>

            {/* CENTER ACTIVE GLASSMORPHISM SHOWCASE */}
            <div className="writing-active-glass-card">
              {/* TELEMETRY ROW */}
              <div className="writing-card-badge-row">
                <span className="writing-protocol-pill">{currentCatalog.protocol}</span>
                <span className="writing-base-price-pill">BASE UNIT: ₹{currentCatalog.basePrice}</span>
              </div>

              {/* SPECIFICATION LORE */}
              <p className="writing-spec-lore">{currentCatalog.lore1}</p>

              {/* DYNAMIC SUB-OPTIONS */}
              <div className="writing-options-box">
                {category === "pen" && (
                  <>
                    <div className="writing-pill-group">
                      {["Gel", "Ball"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`writing-option-pill-btn ${penType === type ? "active" : ""}`}
                          onClick={() => setPenType(type)}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div className="writing-ink-swatches">
                      {INK_COLORS.map((c) => (
                        <div
                          key={c.name}
                          title={c.name}
                          className={`writing-ink-dot ${color === c.name ? "active" : ""}`}
                          style={{ backgroundColor: c.hex }}
                          onClick={() => setColor(c.name)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {category === "pencil" && (
                  <div className="writing-pill-group">
                    {["HB", "2B", "Normal"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={`writing-option-pill-btn ${pencilType === g ? "active" : ""}`}
                        onClick={() => setPencilType(g)}
                      >
                        {g.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}

                {category === "mechanical" && (
                  <div className="writing-pill-group">
                    {["0.5 mm", "0.7 mm"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`writing-option-pill-btn ${mechSize === size ? "active" : ""}`}
                        onClick={() => setMechSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* DISPATCH ACTION BAR */}
              <div className="writing-action-dispatch-row">
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

                <button
                  type="button"
                  className="writing-game-cta-btn"
                  onClick={handleAdd}
                >
                  ADD TO LOADOUT • ₹{grandTotal}
                </button>
              </div>
            </div>

            {/* RIGHT ARROW */}
            <button
              type="button"
              className="writing-nav-arrow-btn"
              onClick={() => setActiveId(nextItem.id)}
              aria-label={`Next: ${nextItem.modelName}`}
              title={`Next: ${nextItem.modelName} (→ key)`}
            >
              →
            </button>
          </div>
        </main>

        {/* BOTTOM GAME NAVIGATION TABS (HILL CLIMB TABS) */}
        <nav className="writing-bottom-tabs-dock" aria-label="Tool Categories">
          <button
            type="button"
            className={`writing-game-tab ${category === "pen" ? "active" : ""}`}
            onClick={() => handleCategoryChange("pen")}
          >
            PENS
          </button>
          <button
            type="button"
            className={`writing-game-tab ${category === "pencil" ? "active" : ""}`}
            onClick={() => handleCategoryChange("pencil")}
          >
            PENCILS
          </button>
          <button
            type="button"
            className={`writing-game-tab ${category === "mechanical" ? "active" : ""}`}
            onClick={() => handleCategoryChange("mechanical")}
          >
            MECHANICAL
          </button>
        </nav>

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
