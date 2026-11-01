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
    --dock-bg: #0D0D0D;
    --chip-bg: #1A1F26;
    --chip-border: #2B323D;
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

  /* 100% PURE VECTOR BACKDROP CANVAS */
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

  /* TOP RETRO-COMIC HEADER BAR */
  .writing-header-bar {
    width: 100%;
    padding: 16px 28px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 50;
    flex-shrink: 0;
  }

  .writing-brand-capsule {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--void-black);
    padding: 6px 16px 6px 8px;
    border-radius: 9999px;
    border: 3px solid var(--void-black);
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.35);
    user-select: none;
    white-space: nowrap;
  }

  .writing-brand-icon-circle {
    width: 36px;
    height: 36px;
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

  .writing-brand-title {
    font-family: 'Titan One', cursive;
    font-size: 16px;
    letter-spacing: 0.5px;
    color: var(--pure-white);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .writing-brand-title span {
    color: var(--slime-green);
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

  /* TOP SUB-HERO CALLOUT BANNER */
  .writing-top-headline {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 20;
    pointer-events: none;
    margin-top: 2px;
  }

  .writing-badge-tag {
    background: var(--hazard-gold);
    color: var(--void-black);
    border: 2px solid var(--void-black);
    border-radius: 9999px;
    padding: 4px 14px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    letter-spacing: 0.8px;
    box-shadow: 3px 3px 0px var(--void-black);
    margin-bottom: 4px;
  }

  .writing-headline-h1 {
    font-family: 'Titan One', cursive;
    font-size: 28px;
    color: var(--pure-white);
    letter-spacing: 0.5px;
    text-shadow: 3px 3px 0px var(--void-black), -1px -1px 0px var(--void-black), 1px -1px 0px var(--void-black), -1px 1px 0px var(--void-black);
    line-height: 1.1;
  }

  /* UNOBSTRUCTED CENTER VIEWPORT */
  .writing-center-stage {
    flex: 1;
    position: relative;
    z-index: 10;
    pointer-events: none;
  }

  /* FLOATING BOTTOM WEAPON DOCK / TOOL BELT */
  .writing-dock-container {
    width: 100%;
    position: relative;
    z-index: 60;
    background: var(--dock-bg);
    border-top: 4px solid var(--slime-green);
    box-shadow: 0px -8px 24px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
  }

  /* TELEMETRY TELE-STRIP */
  .writing-dock-telemetry {
    background: #14181F;
    border-bottom: 2px solid #232A35;
    padding: 6px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 700;
    color: var(--grave-grey);
    letter-spacing: 0.5px;
    overflow-x: auto;
    white-space: nowrap;
    gap: 16px;
  }

  .writing-tele-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .writing-tele-tag {
    color: var(--slime-green);
    font-family: 'Archivo Black', sans-serif;
  }

  .writing-tele-val {
    color: var(--parchment);
  }

  /* TOOL BELT ACTION BAR */
  .writing-dock-main {
    padding: 14px 28px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  /* ZONE 1: CLASSIFICATION TOGGLES */
  .writing-dock-zone-cats {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .writing-dock-cat-btn {
    background: #191E26;
    color: var(--parchment);
    border: 3px solid #2C3542;
    border-radius: 8px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    padding: 9px 14px;
    cursor: pointer;
    box-shadow: 3px 3px 0px var(--void-black);
    transition: all 0.12s ease;
  }

  .writing-dock-cat-btn:hover {
    border-color: var(--slime-green);
    color: var(--pure-white);
    transform: translateY(-1px);
  }

  .writing-dock-cat-btn.active {
    background: var(--slime-green);
    color: var(--void-black);
    border-color: var(--void-black);
    box-shadow: 3px 3px 0px var(--void-black);
  }

  /* ZONE 2: WEAPON MODEL CAROUSEL CHIPS */
  .writing-dock-zone-models {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    max-width: 520px;
    padding-bottom: 2px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .writing-dock-zone-models::-webkit-scrollbar {
    display: none;
  }

  .writing-dock-model-chip {
    background: #191E26;
    color: var(--parchment);
    border: 3px solid #2C3542;
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 2px 2px 0px var(--void-black);
    transition: all 0.12s ease;
    flex-shrink: 0;
  }

  .writing-dock-model-chip:hover {
    border-color: var(--hazard-gold);
    color: var(--pure-white);
  }

  .writing-dock-model-chip.active {
    background: var(--hazard-gold);
    color: var(--void-black);
    border-color: var(--void-black);
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-chip-price {
    background: rgba(0, 0, 0, 0.35);
    color: inherit;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-family: 'Archivo Black', sans-serif;
  }

  /* ZONE 3: SUB-CONFIGS (NIBS, INKS, GRADES) */
  .writing-dock-zone-configs {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .writing-sub-pill-group {
    display: flex;
    align-items: center;
    background: #14181F;
    border: 2px solid #2C3542;
    border-radius: 6px;
    padding: 2px;
    gap: 2px;
  }

  .writing-sub-pill-btn {
    background: transparent;
    color: var(--grave-grey);
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 10px;
    font-family: 'Archivo Black', sans-serif;
    cursor: pointer;
    transition: all 0.1s ease;
  }

  .writing-sub-pill-btn.active {
    background: var(--seafoam);
    color: var(--void-black);
  }

  /* COLOR SWATCHES */
  .writing-ink-swatches {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .writing-ink-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #2C3542;
    transition: transform 0.1s ease, border-color 0.1s ease;
    position: relative;
  }

  .writing-ink-dot:hover {
    transform: scale(1.15);
  }

  .writing-ink-dot.active {
    border: 2px solid var(--pure-white);
    transform: scale(1.15);
    box-shadow: 0 0 0 2px var(--void-black);
  }

  /* ZONE 4: COUNTER & ADD CTA */
  .writing-dock-zone-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: auto;
    flex-shrink: 0;
  }

  .writing-dock-stepper {
    display: flex;
    align-items: center;
    background: #14181F;
    border: 3px solid var(--void-black);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-dock-step-btn {
    background: #1F2530;
    color: var(--parchment);
    border: none;
    width: 32px;
    height: 38px;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s ease;
  }

  .writing-dock-step-btn:hover {
    background: #2C3545;
  }

  .writing-dock-step-val {
    min-width: 32px;
    text-align: center;
    font-family: 'Archivo Black', sans-serif;
    font-size: 13px;
    color: var(--pure-white);
    padding: 0 4px;
  }

  .writing-dock-cta-btn {
    background: var(--brain-pink);
    color: var(--void-black);
    border: 3px solid var(--void-black);
    border-radius: 8px;
    padding: 10px 22px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--void-black);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    white-space: nowrap;
  }

  .writing-dock-cta-btn:hover {
    transform: translate(-1.5px, -1.5px);
    box-shadow: 5px 5px 0px var(--void-black);
    background: #FF85B3;
  }

  .writing-dock-cta-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--void-black);
  }

  /* TOAST NOTIFICATION */
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

  @media (max-width: 1024px) {
    .writing-dock-zone-models {
      max-width: 100%;
    }
    .writing-dock-main {
      gap: 12px;
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        {/* 100% PURE VECTOR BACKDROP CANVAS */}
        <div className="writing-bg-layer" aria-hidden="true">
          <img
            src="/halloween-reference-landscape.svg?v=8"
            alt=""
            className="writing-bg-vector"
          />
        </div>

        {/* TOP COMIC HEADER BAR */}
        <header className="writing-header-bar">
          <div className="writing-brand-capsule">
            <div className="writing-brand-icon-circle">
              <img src="/zombie-rip-pfp.jpg" alt="Zombie pfp" />
            </div>
            <span className="writing-brand-title">
              ODYSSEY // <span>CAMPUS WRITING COMMAND</span>
            </span>
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

        {/* SUB-HERO BANNER (COMPACT, NON-BLOCKING) */}
        <div className="writing-top-headline">
          <div className="writing-badge-tag">EXAM WEAPONRY // SURVIVAL LOADOUT</div>
          <h1 className="writing-headline-h1">CAMPUS WRITING COMMAND</h1>
        </div>

        {/* UNOBSTRUCTED CENTER VIEWPORT */}
        <div className="writing-center-stage" />

        {/* FLOATING BOTTOM WEAPON DOCK / TOOL BELT */}
        <footer className="writing-dock-container">
          {/* TELEMETRY STRIP */}
          <div className="writing-dock-telemetry">
            <div className="writing-tele-item">
              <span className="writing-tele-tag">DEPLOYMENT:</span>
              <span className="writing-tele-val">{currentCatalog.protocol}</span>
            </div>
            <div className="writing-tele-item">
              <span className="writing-tele-tag">SPECIFICATION:</span>
              <span className="writing-tele-val">{currentCatalog.lore1}</span>
            </div>
            <div className="writing-tele-item">
              <span className="writing-tele-tag">BASE UNIT:</span>
              <span className="writing-tele-val">₹{currentCatalog.basePrice}</span>
            </div>
          </div>

          {/* MAIN DOCK INTERFACE */}
          <div className="writing-dock-main">
            {/* ZONE 1: CATEGORIES */}
            <div className="writing-dock-zone-cats">
              <button
                type="button"
                className={`writing-dock-cat-btn ${category === "pen" ? "active" : ""}`}
                onClick={() => handleCategoryChange("pen")}
              >
                PENS
              </button>
              <button
                type="button"
                className={`writing-dock-cat-btn ${category === "pencil" ? "active" : ""}`}
                onClick={() => handleCategoryChange("pencil")}
              >
                PENCILS
              </button>
              <button
                type="button"
                className={`writing-dock-cat-btn ${category === "mechanical" ? "active" : ""}`}
                onClick={() => handleCategoryChange("mechanical")}
              >
                MECHANICAL
              </button>
            </div>

            {/* ZONE 2: MODEL QUICK-RACK */}
            <div className="writing-dock-zone-models">
              {categoryItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`writing-dock-model-chip ${currentCatalog.id === item.id ? "active" : ""}`}
                  onClick={() => setActiveId(item.id)}
                >
                  <span>{item.modelName}</span>
                  <span className="writing-chip-price">₹{item.basePrice}</span>
                </button>
              ))}
            </div>

            {/* ZONE 3: SUB-CONFIGS (NIBS, INKS, GRADES) */}
            <div className="writing-dock-zone-configs">
              {category === "pen" && (
                <>
                  <div className="writing-sub-pill-group">
                    {["Gel", "Ball"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`writing-sub-pill-btn ${penType === type ? "active" : ""}`}
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
                <div className="writing-sub-pill-group">
                  {["HB", "2B", "Normal"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`writing-sub-pill-btn ${pencilType === g ? "active" : ""}`}
                      onClick={() => setPencilType(g)}
                    >
                      {g.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}

              {category === "mechanical" && (
                <div className="writing-sub-pill-group">
                  {["0.5 mm", "0.7 mm"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`writing-sub-pill-btn ${mechSize === size ? "active" : ""}`}
                      onClick={() => setMechSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ZONE 4: COUNTER & ADD CTA */}
            <div className="writing-dock-zone-actions">
              <div className="writing-dock-stepper">
                <button
                  type="button"
                  className="writing-dock-step-btn"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="writing-dock-step-val">{qty}</span>
                <button
                  type="button"
                  className="writing-dock-step-btn"
                  onClick={() => setQty((prev) => prev + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="writing-dock-cta-btn"
                onClick={handleAdd}
              >
                ADD TO LOADOUT • ₹{grandTotal}
              </button>
            </div>
          </div>
        </footer>

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
