import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .sp-root {
    min-height: 100vh;
    background: #080810;
    padding: 56px 24px 100px;
    font-family: 'Sora', sans-serif;
    color: #dcdce8;
  }

  .sp-inner {
    max-width: 640px;
    margin: 0 auto;
  }

  /* ── HEADER ── */
  .sp-header {
    margin-bottom: 48px;
    padding-bottom: 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .sp-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #6c5fc7;
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sp-eyebrow::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 2px;
    background: #6c5fc7;
    border-radius: 2px;
  }
  .sp-title {
    font-size: 30px;
    font-weight: 700;
    color: #f0f0fa;
    letter-spacing: -0.6px;
    margin: 0 0 6px;
    text-transform: capitalize;
  }
  .sp-subtitle {
    font-size: 13px;
    color: #44445a;
    font-weight: 400;
    margin: 0;
  }

  /* ── CARD ── */
  .sp-card {
    background: linear-gradient(160deg, #16161f 0%, #131320 100%);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    margin-bottom: 16px;
    overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
  }
  .sp-card:hover {
    border-color: rgba(108, 95, 199, 0.35);
    box-shadow: 0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(108,95,199,0.08);
    transform: translateY(-1px);
  }

  /* Card header band */
  .sp-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.055);
    gap: 12px;
  }
  .sp-card-head-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .sp-item-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6c5fc7;
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(108,95,199,0.5);
  }
  .sp-item-name {
    font-size: 15px;
    font-weight: 600;
    color: #eeeef8;
    letter-spacing: -0.15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sp-price-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 600;
    color: #a99fe8;
    background: rgba(108,95,199,0.12);
    border: 1px solid rgba(108,95,199,0.18);
    border-radius: 8px;
    padding: 4px 12px;
    transition: opacity 0.25s, transform 0.25s;
    flex-shrink: 0;
    letter-spacing: 0.02em;
  }
  .sp-price-badge.hidden {
    opacity: 0;
    transform: scale(0.92);
    pointer-events: none;
  }

  /* Card body */
  .sp-card-body {
    padding: 20px 24px 22px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  /* Options zone */
  .sp-options-zone {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sp-options-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #3d3d55;
  }
  .sp-options-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  /* Select */
  .sp-select {
    background: #1a1a27;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #c8c8e0;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 400;
    padding: 10px 34px 10px 13px;
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath fill='%236c5fc7' d='M5.5 6.5L0 0h11z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
    min-width: 120px;
    height: 40px;
  }
  .sp-select:hover {
    border-color: rgba(108,95,199,0.5);
    background-color: #1e1e2e;
  }
  .sp-select:focus {
    border-color: rgba(108,95,199,0.8);
    box-shadow: 0 0 0 3px rgba(108,95,199,0.15);
    background-color: #1e1e2e;
  }
  .sp-select:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .sp-select option {
    background: #1a1a27;
    color: #c8c8e0;
  }

  /* Divider inside card */
  .sp-card-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 0 -24px;
    width: calc(100% + 48px);
  }

  /* Action zone */
  .sp-action-zone {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .sp-qty-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sp-qty-label {
    font-size: 11px;
    font-weight: 500;
    color: #3a3a52;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .sp-qty-stepper {
    display: flex;
    align-items: center;
    background: #1a1a27;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    overflow: hidden;
    height: 40px;
  }
  .sp-qty-btn {
    background: transparent;
    border: none;
    color: #7b6dd4;
    font-size: 17px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;
    user-select: none;
    line-height: 1;
    flex-shrink: 0;
  }
  .sp-qty-btn:hover {
    background: rgba(108,95,199,0.18);
    color: #a99fe8;
  }
  .sp-qty-btn:active {
    background: rgba(108,95,199,0.28);
  }
  .sp-qty-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    color: #eeeef8;
    min-width: 38px;
    text-align: center;
    border-left: 1px solid rgba(255,255,255,0.07);
    border-right: 1px solid rgba(255,255,255,0.07);
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sp-add-btn {
    background: #6c5fc7;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.01em;
    padding: 0 22px;
    height: 40px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 3px 14px rgba(108,95,199,0.3);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .sp-add-btn::before {
    content: '+';
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
    opacity: 0.85;
  }
  .sp-add-btn:hover {
    background: #7d70d8;
    transform: translateY(-2px);
    box-shadow: 0 6px 22px rgba(108,95,199,0.4);
  }
  .sp-add-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(108,95,199,0.2);
  }

  /* ── TOTAL BAR ── */
  .sp-total-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 32px;
    padding: 22px 28px;
    background: linear-gradient(135deg, #16161f 0%, #1a1628 100%);
    border: 1px solid rgba(108,95,199,0.2);
    border-radius: 18px;
    box-shadow: 0 0 0 1px rgba(108,95,199,0.05), inset 0 1px 0 rgba(255,255,255,0.04);
  }
  .sp-total-left {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .sp-total-label {
    font-size: 10px;
    font-weight: 600;
    color: #3a3a52;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .sp-total-desc {
    font-size: 12px;
    color: #44445a;
  }
  .sp-total-amount {
    font-family: 'JetBrains Mono', monospace;
    font-size: 28px;
    font-weight: 600;
    color: #f0f0fa;
    letter-spacing: -0.5px;
    line-height: 1;
    display: flex;
    align-items: baseline;
    gap: 2px;
  }
  .sp-total-currency {
    color: #6c5fc7;
    font-size: 14px;
    line-height: 1;
    margin-bottom: 2px;
  }

  /* ── TOAST ── */
  .sp-toast {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    z-index: 9999;
    animation: spFadeUp 0.22s cubic-bezier(0.34,1.56,0.64,1);
    white-space: nowrap;
    pointer-events: none;
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sp-toast-ok {
    background: rgba(22,22,32,0.96);
    border: 1px solid rgba(52,199,89,0.3);
    color: #4cd964;
    box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(52,199,89,0.08);
  }
  .sp-toast-ok::before { content: '✓'; }
  .sp-toast-err {
    background: rgba(22,22,32,0.96);
    border: 1px solid rgba(255,69,58,0.28);
    color: #ff6b6b;
    box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,69,58,0.07);
  }
  .sp-toast-err::before { content: '!'; }

  @keyframes spFadeUp {
    from { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.96); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  .sp-sub-anim {
    animation: spFadeUp 0.18s ease;
  }

  .sp-empty {
    text-align: center;
    color: #2e2e44;
    font-size: 14px;
    padding: 48px 0;
    border: 1px dashed rgba(255,255,255,0.05);
    border-radius: 18px;
  }

  @media (max-width: 480px) {
    .sp-root { padding: 36px 16px 80px; }
    .sp-select { min-width: 100px; font-size: 12px; }
    .sp-title { font-size: 24px; }
    .sp-action-zone { justify-content: stretch; }
    .sp-add-btn { flex: 1; justify-content: center; }
    .sp-total-bar { padding: 18px 20px; }
    .sp-total-amount { font-size: 22px; }
  }
`;

export default function StationeryPage() {
  const { type: category } = useParams();
  const { addToCart } = useCart();

  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");
  const [categoryTotal, setCategoryTotal] = useState(0);

  const [penType, setPenType] = useState("");
  const [penColor, setPenColor] = useState("");
  const [pencilType, setPencilType] = useState("");
  const [mechSize, setMechSize] = useState("");
  const [markerType, setMarkerType] = useState("");
  const [wbColor, setWbColor] = useState("");
  const [notebookType, setNotebookType] = useState("");
  const [notebookSize, setNotebookSize] = useState("");
  const [pages, setPages] = useState("");
  const [spiralPages, setSpiralPages] = useState("");
  const [scaleSize, setScaleSize] = useState("");
  const [glueSize, setGlueSize] = useState("");
  const [staplerSize, setStaplerSize] = useState("");
  const [pinsSize, setPinsSize] = useState("");
  const [highlightMode, setHighlightMode] = useState("");
  const [highlightColor, setHighlightColor] = useState("");

  console.log("Size:", notebookSize);

  const categories = {
    writing: ["Pen", "Pencil", "Mechanical Pencil"],
    correction: ["Whitener", "Correction Tape", "Permanent Marker", "Whiteboard Marker", "Highlighter"],
    paper: ["Notebook", "Spiral Notebook", "Graph Book", "Loose Sheets", "Sticky Notes"],
    measuring: ["Scale", "Geometry Box", "Protractor", "Compass", "Divider"],
    office: ["Eraser", "Sharpener", "Glue Stick", "Stapler", "Staple Pins", "Brown Cover"]
  };

  const items = categories[category] || [];

  const changeQty = (item, value) => {
    if (/^\d*$/.test(value)) {
      setQuantities(p => ({ ...p, [item]: value }));
    }
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  const getItemPrice = (item) => {
    let price = 0;
    const qty = Number(quantities[item]) || 1;
    if (item === "Pen" && penType && penColor) price = 10;
    if (item === "Pencil" && pencilType) price = 10;
    if (item === "Mechanical Pencil" && mechSize) price = 50;
    if (item === "Permanent Marker" && markerType) price = markerType === "Bold" ? 18 : 10;
    if (item === "Whiteboard Marker" && wbColor) price = 25;
    if (item === "Whitener") price = 20;
    if (item === "Correction Tape") price = 30;
    if (item === "Notebook" && notebookSize && pages) {
      if (notebookSize === "Small") price = pages === "200" ? 40 : 20;
      if (notebookSize === "King") price = pages === "200" ? 60 : 30;
      if (notebookSize === "Long") {
        if (pages === "100") price = 40;
        else if (pages === "200") price = 60;
        else price = 130;
      }
    }
    if (item === "Spiral Notebook" && spiralPages) price = spiralPages === "100" ? 50 : spiralPages === "200" ? 100 : 150;
    if (item === "Graph Book") price = 40;
    if (item === "Loose Sheets") price = 1;
    if (item === "Sticky Notes") price = 40;
    if (item === "Scale" && scaleSize) price = scaleSize === "30 cm" ? 20 : 10;
    if (item === "Geometry Box") price = 180;
    if (item === "Protractor") price = 60;
    if (item === "Compass") price = 100;
    if (item === "Divider") price = 100;
    if (item === "Glue Stick" && glueSize) price = glueSize === "Big" ? 50 : 25;
    if (item === "Stapler" && staplerSize) price = staplerSize === "Big" ? 100 : 40;
    if (item === "Staple Pins" && pinsSize) price = pinsSize === "Big" ? 25 : 10;
    if (item === "Eraser") price = 5;
    if (item === "Sharpener") price = 5;
    if (item === "Brown Cover") price = 10;
    return price * qty;
  };

  const handleAdd = (item) => {
    const qty = Number(quantities[item]) || 1;
    let name = item;
    let price = 0;

    if (item === "Pen") {
      if (!penType || !penColor) return showMsg("Select pen type & color");
      name = `${penType} Pen (${penColor})`; price = 10;
    }
    if (item === "Pencil") {
      if (!pencilType) return showMsg("Select pencil type");
      name = `${pencilType} Pencil`; price = 10;
    }
    if (item === "Mechanical Pencil") {
      if (!mechSize) return showMsg("Select size");
      name = `Mechanical Pencil (${mechSize})`; price = 50;
    }
    if (item === "Permanent Marker") {
      if (!markerType) return showMsg("Select marker type");
      name = `Permanent Marker (${markerType})`;
      price = markerType === "Bold" ? 18 : 10;
    }
    if (item === "Whiteboard Marker") {
      if (!wbColor) return showMsg("Select color");
      name = `Whiteboard Marker (${wbColor})`; price = 25;
    }
    if (item === "Highlighter") {
      if (!highlightMode) return showMsg("Select option");
      if (highlightMode === "Single") {
        if (!highlightColor) return showMsg("Select color");
        name = `Highlighter (${highlightColor})`; price = 20;
      } else {
        name = "Highlighter Pack (5 Colors)"; price = 100;
      }
    }
    if (item === "Whitener") { name = "Whitener"; price = 20; }
    if (item === "Correction Tape") { name = "Correction Tape"; price = 30; }
    if (item === "Notebook") {
      if (!notebookType || !notebookSize || !pages) return showMsg("Complete notebook options");
      name = `${notebookSize} ${notebookType} Notebook (${pages} pages)`;
      if (notebookSize === "Small") { if (pages === "100") price = 20; else if (pages === "200") price = 40; }
      else if (notebookSize === "King") { if (pages === "100") price = 30; else if (pages === "200") price = 60; }
      else if (notebookSize === "Long") { if (pages === "100") price = 40; else if (pages === "200") price = 60; else if (pages === "300") price = 130; }
    }
    if (item === "Spiral Notebook") {
      if (!spiralPages) return showMsg("Select pages");
      name = `Spiral Notebook (${spiralPages} pages)`;
      price = spiralPages === "100" ? 50 : spiralPages === "200" ? 100 : 150;
    }
    if (item === "Graph Book") { name = "Graph Book"; price = 40; }
    if (item === "Sticky Notes") { name = "Sticky Notes"; price = 40; }
    if (item === "Loose Sheets") { name = "Loose Sheets"; price = 1; }
    if (item === "Scale") {
      if (!scaleSize) return showMsg("Select 15 cm or 30 cm");
      name = `${scaleSize} Scale`;
      price = scaleSize === "30 cm" ? 20 : 10;
    }
    if (item === "Geometry Box") price = 180;
    if (item === "Protractor") price = 60;
    if (item === "Compass") price = 100;
    if (item === "Divider") price = 100;
    if (item === "Glue Stick") {
      if (!glueSize) return showMsg("Select size");
      name = `Glue Stick (${glueSize})`;
      price = glueSize === "Big" ? 50 : 25;
    }
    if (item === "Stapler") {
      if (!staplerSize) return showMsg("Select stapler size");
      name = `Stapler (${staplerSize})`;
      price = staplerSize === "Big" ? 100 : 40;
    }
    if (item === "Staple Pins") {
      if (!pinsSize) return showMsg("Select pins size");
      name = `Staple Pins (${pinsSize})`;
      price = pinsSize === "Big" ? 25 : 10;
    }
    if (item === "Eraser") price = 5;
    if (item === "Sharpener") price = 5;
    if (item === "Brown Cover") price = 10;

    addToCart({ name, price, quantity: qty });
    setCategoryTotal(prev => prev + (price * qty));
    showMsg(`${name} added`);
  };

  const isErrorMsg = message === "Complete selection" ||
    message.startsWith("Select") ||
    message.startsWith("Complete");

  const noOptions = ["Whitener","Correction Tape","Graph Book","Loose Sheets",
    "Sticky Notes","Geometry Box","Protractor","Compass","Divider","Eraser","Sharpener","Brown Cover"];

  return (
    <>
      <style>{css}</style>
      <div className="sp-root">
        <div className="sp-inner">

          {/* HEADER */}
          <div className="sp-header">
            <p className="sp-eyebrow">Stationery</p>
            <h2 className="sp-title">{category}</h2>
            <p className="sp-subtitle">{items.length} item{items.length !== 1 ? "s" : ""} available</p>
          </div>

          {items.length === 0 && (
            <div className="sp-empty">No items found in this category.</div>
          )}

          {items.map(item => {
            const livePrice = getItemPrice(item);
            const qty = Number(quantities[item]) || 1;
            const hasOpts = !noOptions.includes(item);

            return (
              <div className="sp-card" key={item + category}>

                {/* CARD HEADER */}
                <div className="sp-card-head">
                  <div className="sp-card-head-left">
                    <div className="sp-item-dot" />
                    <span className="sp-item-name">{item}</span>
                  </div>
                  <span className={`sp-price-badge${livePrice === 0 ? " hidden" : ""}`}>
                    ₹{livePrice}
                  </span>
                </div>

                {/* CARD BODY */}
                <div className="sp-card-body">

                  {/* OPTIONS ZONE */}
                  {hasOpts && (
                    <div className="sp-options-zone">
                      <span className="sp-options-label">Configure</span>
                      <div className="sp-options-row">

                        {item === "Pen" && (<>
                          <select className="sp-select" onChange={(e) => setPenType(e.target.value)}>
                            <option value="">Pen Type</option>
                            <option>Ball</option>
                            <option>Gel</option>
                          </select>
                          <select className="sp-select" onChange={(e) => setPenColor(e.target.value)}>
                            <option value="">Ink Color</option>
                            <option>Blue</option>
                            <option>Black</option>
                            <option>Red</option>
                            <option>Green</option>
                          </select>
                        </>)}

                        {item === "Pencil" && (
                          <select className="sp-select" onChange={(e) => setPencilType(e.target.value)}>
                            <option value="">Grade</option>
                            <option>Normal</option>
                            <option>HB</option>
                            <option>2B</option>
                          </select>
                        )}

                        {item === "Mechanical Pencil" && (
                          <select className="sp-select" onChange={(e) => setMechSize(e.target.value)}>
                            <option value="">Lead Size</option>
                            <option>0.5 mm</option>
                            <option>0.7 mm</option>
                          </select>
                        )}

                        {item === "Permanent Marker" && (
                          <select className="sp-select" onChange={(e) => setMarkerType(e.target.value)}>
                            <option value="">Tip Type</option>
                            <option>Bullet</option>
                            <option>Bold</option>
                          </select>
                        )}

                        {item === "Whiteboard Marker" && (
                          <select className="sp-select" onChange={(e) => setWbColor(e.target.value)}>
                            <option value="">Color</option>
                            <option>Black</option>
                            <option>Blue</option>
                            <option>Red</option>
                            <option>Green</option>
                          </select>
                        )}

                        {item === "Highlighter" && (<>
                          <select className="sp-select" onChange={(e) => setHighlightMode(e.target.value)}>
                            <option value="">Option</option>
                            <option value="Single">Single</option>
                            <option value="Pack">Pack of 5</option>
                          </select>
                          {highlightMode === "Single" && (
                            <select className="sp-select sp-sub-anim" onChange={(e) => setHighlightColor(e.target.value)}>
                              <option value="">Color</option>
                              <option>Yellow</option>
                              <option>Pink</option>
                              <option>Green</option>
                              <option>Orange</option>
                              <option>Blue</option>
                            </select>
                          )}
                        </>)}

                        {item === "Notebook" && (<>
                          <select className="sp-select" value={notebookType} onChange={(e) => setNotebookType(e.target.value)}>
                            <option value="">Ruling</option>
                            <option value="Ruled">Ruled</option>
                            <option value="Unruled">Unruled</option>
                          </select>
                          <select className="sp-select" value={notebookSize} onChange={(e) => { setNotebookSize(e.target.value); setPages(""); }}>
                            <option value="">Size</option>
                            <option value="Small">Small</option>
                            <option value="King">King</option>
                            <option value="Long">Long</option>
                          </select>
                          <select className="sp-select" value={pages} onChange={(e) => setPages(e.target.value)} disabled={!notebookSize}>
                            <option value="">Pages</option>
                            {(notebookSize === "Small" || notebookSize === "King") && (<>
                              <option value="100">100</option>
                              <option value="200">200</option>
                            </>)}
                            {notebookSize === "Long" && (<>
                              <option value="100">100</option>
                              <option value="200">200</option>
                              <option value="300">300</option>
                            </>)}
                          </select>
                        </>)}

                        {item === "Spiral Notebook" && (
                          <select className="sp-select" onChange={(e) => setSpiralPages(e.target.value)}>
                            <option value="">Pages</option>
                            <option>100</option>
                            <option>200</option>
                            <option>300</option>
                          </select>
                        )}

                        {item === "Scale" && (
                          <select className="sp-select" onChange={(e) => setScaleSize(e.target.value)}>
                            <option value="">Length</option>
                            <option>15 cm</option>
                            <option>30 cm</option>
                          </select>
                        )}

                        {item === "Glue Stick" && (
                          <select className="sp-select" onChange={(e) => setGlueSize(e.target.value)}>
                            <option value="">Size</option>
                            <option>Small</option>
                            <option>Big</option>
                          </select>
                        )}

                        {item === "Stapler" && (
                          <select className="sp-select" onChange={(e) => setStaplerSize(e.target.value)}>
                            <option value="">Size</option>
                            <option>Small</option>
                            <option>Big</option>
                          </select>
                        )}

                        {item === "Staple Pins" && (
                          <select className="sp-select" onChange={(e) => setPinsSize(e.target.value)}>
                            <option value="">Size</option>
                            <option>Small</option>
                            <option>Big</option>
                          </select>
                        )}

                      </div>
                    </div>
                  )}

                  {/* INTERNAL DIVIDER */}
                  <div className="sp-card-divider" />

                  {/* ACTION ZONE */}
                  <div className="sp-action-zone">
                    <div className="sp-qty-group">
                      <span className="sp-qty-label">Qty</span>
                      <div className="sp-qty-stepper">
                        <button
                          className="sp-qty-btn"
                          onClick={() => changeQty(item, String(Math.max(1, qty - 1)))}
                          aria-label="Decrease quantity"
                        >−</button>
                        <div className="sp-qty-val">{qty}</div>
                        <button
                          className="sp-qty-btn"
                          onClick={() => changeQty(item, String(qty + 1))}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                    </div>

                    <button className="sp-add-btn" onClick={() => handleAdd(item)}>
                      Add to Cart
                    </button>
                  </div>

                </div>
              </div>
            );
          })}

          {/* TOTAL BAR */}
          <div className="sp-total-bar">
            <div className="sp-total-left">
              <span className="sp-total-label">Category Total</span>
              <span className="sp-total-desc">Items added this session</span>
            </div>
            <span className="sp-total-amount">
              <span className="sp-total-currency">₹</span>{categoryTotal}
            </span>
          </div>

        </div>

        {/* TOAST */}
        {message && (
          <div className={`sp-toast ${isErrorMsg ? "sp-toast-err" : "sp-toast-ok"}`}>
            {message}
          </div>
        )}
      </div>
    </>
  );
}