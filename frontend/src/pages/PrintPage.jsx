import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import * as pdfjsLib from "pdfjs-dist";

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');

  :root {
    --slime-green: #9DE869;
    --void-black: #0D0D0D;
    --card-dark: #14161C;
    --card-surface: #1E222B;
    --card-border: #2C323F;
    --seafoam: #45B89E;
    --hazard-gold: #F7B919;
    --brain-pink: #FF70A6;
    --border-dark: #0D0D0D;
    --text-muted: #A0A8B5;
    --shadow-solid: 4px 4px 0px #0D0D0D;
    --shadow-solid-sm: 2.5px 2.5px 0px #0D0D0D;
    --shadow-solid-lg: 8px 8px 0px #0D0D0D;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .print-page-wrapper {
    min-height: 100vh;
    background-color: var(--slime-green);
    background-image: 
      radial-gradient(#85d44d 18%, transparent 19%),
      radial-gradient(#85d44d 18%, transparent 19%);
    background-size: 26px 26px;
    background-position: 0 0, 13px 13px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--void-black);
    padding: 20px 16px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow-x: hidden;
  }

  /* TOP NAVBAR */
  .print-nav {
    width: 100%;
    max-width: 1040px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .print-nav-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .print-brand {
    font-family: 'Archivo Black', sans-serif;
    font-size: 20px;
    text-transform: uppercase;
    color: var(--void-black);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.5px;
  }

  .print-badge {
    background: var(--hazard-gold);
    color: var(--void-black);
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 9999px;
    border: 2px solid var(--border-dark);
    box-shadow: 2px 2px 0px var(--border-dark);
  }

  .print-btn-pill {
    background: var(--void-black);
    color: #FFFFFF;
    border: 3px solid var(--border-dark);
    border-radius: 9999px;
    padding: 8px 18px;
    font-weight: 800;
    font-size: 13px;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: var(--shadow-solid-sm);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .print-btn-pill:hover {
    transform: translate(-1.5px, -1.5px);
    box-shadow: 4px 4px 0px var(--border-dark);
    background: #1C1F26;
  }

  .print-btn-pill:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  .print-cart-pill {
    background: var(--hazard-gold);
    color: var(--void-black);
  }

  .print-cart-pill:hover {
    background: #FFCA3A;
  }

  /* HERO BANNER */
  .print-hero-heading {
    text-align: center;
    margin-bottom: 24px;
    max-width: 720px;
  }

  .print-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: clamp(28px, 4.5vw, 44px);
    text-transform: uppercase;
    color: var(--void-black);
    letter-spacing: -0.5px;
    line-height: 1.1;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .print-title-star {
    display: inline-block;
    color: var(--brain-pink);
    font-size: 30px;
    animation: print-spin 12s linear infinite;
  }

  @keyframes print-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .print-subtitle {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--void-black);
    opacity: 0.9;
  }

  /* MAIN WORKBENCH CARD (VOid Black Chassis) */
  .print-workbench {
    width: 100%;
    max-width: 1040px;
    background: var(--void-black);
    color: #FFFFFF;
    border: 4px solid #000000;
    border-radius: 28px;
    box-shadow: var(--shadow-solid-lg);
    padding: 32px 32px 36px;
    display: grid;
    grid-template-columns: 1.25fr 0.95fr;
    gap: 32px;
    position: relative;
  }

  @media (max-width: 860px) {
    .print-workbench {
      grid-template-columns: 1fr;
      padding: 24px 18px 28px;
      gap: 26px;
    }
  }

  /* SECTION HEADERS */
  .print-sec-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .print-sec-tag {
    background: var(--hazard-gold);
    color: var(--void-black);
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .print-sec-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: 17px;
    text-transform: uppercase;
    letter-spacing: -0.2px;
    color: #FFFFFF;
  }

  /* LEFT COLUMN (CONFIG) */
  .print-col-config {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  /* DROPZONE (Dark Neon Brutal) */
  .print-dropzone {
    border: 3.5px dashed var(--slime-green);
    border-radius: 20px;
    background: var(--card-dark);
    padding: 28px 18px;
    text-align: center;
    position: relative;
    cursor: pointer;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.6);
    transition: all 0.15s ease;
  }

  .print-dropzone:hover {
    background: #1A1F26;
    border-color: #BAFF7A;
    transform: translate(-1.5px, -1.5px);
    box-shadow: 5px 5px 0px rgba(0,0,0,0.8);
  }

  .print-dropzone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 5;
  }

  .print-drop-icon {
    font-size: 38px;
    margin-bottom: 6px;
    display: inline-block;
  }

  .print-drop-main {
    font-family: 'Archivo Black', sans-serif;
    font-size: 16px;
    text-transform: uppercase;
    margin-bottom: 4px;
    color: var(--slime-green);
  }

  .print-drop-sub {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-muted);
  }

  /* FILE DETECTED CARD */
  .print-file-ready {
    background: var(--slime-green);
    color: var(--void-black);
    border: 3.5px solid #000000;
    border-radius: 20px;
    padding: 18px 20px;
    box-shadow: 4px 4px 0px rgba(0,0,0,0.6);
  }

  .print-file-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .print-file-badge {
    background: var(--void-black);
    color: #FFFFFF;
    font-size: 11px;
    font-weight: 900;
    padding: 3px 10px;
    border-radius: 9999px;
    text-transform: uppercase;
  }

  .print-file-name {
    font-family: 'Archivo Black', sans-serif;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 6px;
    color: var(--void-black);
  }

  .print-file-pages {
    font-size: 14px;
    font-weight: 800;
    color: var(--void-black);
  }

  .print-reupload-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 900;
    color: #FFFFFF;
    background: var(--void-black);
    border: 2px solid #000000;
    padding: 6px 14px;
    border-radius: 9999px;
    margin-top: 10px;
    cursor: pointer;
    box-shadow: 2px 2px 0px rgba(0,0,0,0.4);
    transition: transform 0.1s ease;
  }

  .print-reupload-label:hover {
    transform: translate(-1px, -1px);
    background: #252830;
  }

  /* COLOR MODE SELECTOR (NEOBRUTAL PILLS) */
  .print-mode-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .print-mode-btn {
    border: 3px solid var(--card-border);
    border-radius: 18px;
    padding: 14px 16px;
    background: var(--card-surface);
    color: #FFFFFF;
    cursor: pointer;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.6);
    transition: all 0.15s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
    text-align: left;
  }

  .print-mode-btn:hover:not(.active) {
    background: #272C38;
    border-color: #3E4554;
    transform: translateY(-2px);
  }

  .print-mode-btn.active {
    background: var(--slime-green);
    color: var(--void-black);
    border-color: #000000;
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px rgba(0,0,0,0.8);
  }

  .print-mode-btn.active.color-active {
    background: var(--brain-pink);
    color: var(--void-black);
  }

  .print-mode-btn-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .print-mode-rate-pill {
    align-self: flex-start;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 900;
    border: 2px solid var(--border-dark);
    background: var(--hazard-gold);
    color: var(--void-black);
  }

  .print-mode-btn.active .print-mode-rate-pill {
    background: var(--void-black);
    color: #FFFFFF;
    border-color: #000000;
  }

  /* COPIES STEPPER & PRESETS */
  .print-stepper-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--card-surface);
    border: 3px solid var(--card-border);
    border-radius: 18px;
    padding: 10px 18px;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.6);
    margin-bottom: 10px;
  }

  .print-step-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--hazard-gold);
    color: var(--void-black);
    border: 2.5px solid var(--border-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 2px 2px 0px rgba(0,0,0,0.5);
    transition: transform 0.1s ease;
  }

  .print-step-btn:hover {
    background: #FFCA3A;
    transform: translate(-1px, -1px);
  }

  .print-step-btn:active {
    transform: translate(1.5px, 1.5px);
    box-shadow: 0px 0px 0px rgba(0,0,0,0.5);
  }

  .print-step-value {
    font-family: 'Archivo Black', sans-serif;
    font-size: 24px;
    min-width: 60px;
    text-align: center;
    color: #FFFFFF;
  }

  .print-presets-row {
    display: flex;
    gap: 8px;
  }

  .print-preset-pill {
    flex: 1;
    text-align: center;
    padding: 7px 0;
    background: var(--card-surface);
    color: var(--text-muted);
    border: 2.5px solid var(--card-border);
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 2px 2px 0px rgba(0,0,0,0.4);
    transition: all 0.15s ease;
  }

  .print-preset-pill.active {
    background: var(--hazard-gold);
    color: var(--void-black);
    border-color: #000000;
  }

  .print-preset-pill:hover:not(.active) {
    background: #272C38;
    color: #FFFFFF;
    transform: translateY(-1px);
  }

  /* RIGHT COLUMN: SUMMARY & CTA */
  .print-col-summary {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
  }

  .print-summary-card {
    background: var(--seafoam);
    color: var(--void-black);
    border: 3.5px solid #000000;
    border-radius: 22px;
    padding: 22px 20px;
    box-shadow: 5px 5px 0px rgba(0,0,0,0.6);
    position: relative;
  }

  .print-summary-mascot-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 2.5px solid var(--border-dark);
    padding-bottom: 12px;
  }

  .print-summary-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: -0.3px;
    color: var(--void-black);
  }

  .print-calc-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }

  .print-calc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13.5px;
    font-weight: 700;
    color: var(--void-black);
  }

  .print-calc-total-box {
    background: var(--void-black);
    color: #FFFFFF;
    border: 3px solid #000000;
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.4);
  }

  .print-total-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 15px;
    text-transform: uppercase;
    color: #FFFFFF;
  }

  .print-total-price {
    font-family: 'Archivo Black', sans-serif;
    font-size: 32px;
    color: var(--hazard-gold);
    letter-spacing: -0.5px;
  }

  /* SPEC TAGS */
  .print-spec-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .print-spec-pill {
    background: var(--void-black);
    color: #FFFFFF;
    border: 2px solid #000000;
    border-radius: 9999px;
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  /* PRIMARY ACTION CTA */
  .print-action-cta {
    width: 100%;
    background: var(--brain-pink);
    color: var(--void-black);
    border: 4px solid var(--border-dark);
    border-radius: 9999px;
    padding: 18px 24px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 17px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    box-shadow: 5px 5px 0px rgba(0,0,0,0.6);
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-shadow: none;
  }

  .print-action-cta:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0px rgba(0,0,0,0.7);
    background: #FF85B4;
  }

  .print-action-cta:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  /* TOAST BANNER */
  .print-toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    padding: 14px 24px;
    border-radius: 9999px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 900;
    color: var(--void-black);
    background: var(--slime-green);
    border: 3.5px solid var(--border-dark);
    box-shadow: 6px 6px 0px var(--border-dark);
    z-index: 9999;
    animation: print-toast-pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .print-toast.error {
    background: var(--brain-pink);
    color: #FFFFFF;
  }

  @keyframes print-toast-pop {
    0% { transform: scale(0.8) translateY(20px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }

  /* SPINNER */
  .print-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 3px solid rgba(0,0,0,0.25);
    border-top-color: var(--border-dark);
    border-radius: 50%;
    animation: print-spin 0.6s linear infinite;
  }
`;

function Print() {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(0);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState("bw");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const rate = color === "bw" ? 1 : 10;
  const total = (pages || 0) * rate * (copies || 1);

  const showToastMessage = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2200);
  };

  const handleFileUpload = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      showToastMessage("Please upload a valid PDF document ", "error");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onload = async function () {
      try {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        setPages(pdf.numPages);
        setFile(selected);
        showToastMessage(`PDF verified: ${pdf.numPages} pages detected! `, "success");
      } catch (err) {
        showToastMessage("Could not parse PDF. Please try another file.", "error");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(selected);
  };

  const handleAdd = () => {
    if (!file) {
      showToastMessage("Upload a PDF document first! ", "error");
      return;
    }

    addToCart({
      name: `Print (${color === "bw" ? "B/W" : "Color"}) - ${file.name}`,
      pages,
      copies: copies || 1,
      price: pages * rate,
      quantity: copies || 1,
      file,
    });

    showToastMessage("Added to survival loadout! ", "success");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="print-page-wrapper">
        {/* TOP NAVIGATION BAR */}
        <header className="print-nav">
          <div className="print-nav-left">
            <Link to="/student" className="print-brand">
              ODYSSEY
              <span className="print-badge">PRINT STATION</span>
            </Link>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="print-btn-pill" onClick={() => navigate(-1)}>
              ← BACK TO BASE
            </button>
            <Link to="/cart" className="print-btn-pill print-cart-pill">
               CART ({cartItems ? cartItems.length : 0})
            </Link>
          </div>
        </header>

        {/* HERO HEADING */}
        <div className="print-hero-heading">
          <h1 className="print-title">
            PRINT ORDER DISPATCH
            <span className="print-title-star">✳</span>
          </h1>
          <p className="print-subtitle">
            Upload your assignments, notes & documents. High-speed laser output with instant library pickup.
          </p>
        </div>

        {/* WORKBENCH CARD */}
        <main className="print-workbench">
          {/* LEFT: DOCUMENT & PRINT SETTINGS */}
          <div className="print-col-config">
            {/* STEP 1: UPLOAD */}
            <div>
              <div className="print-sec-header">
                <span className="print-sec-tag">Step 1</span>
                <h2 className="print-sec-title">Upload Manuscript</h2>
              </div>

              {!file ? (
                <div className="print-dropzone">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                  />
                  <div className="print-drop-icon">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  </div>
                  <h3 className="print-drop-main">DRAG & DROP PDF HERE</h3>
                  <p className="print-drop-sub">or click anywhere to browse files</p>
                  <div
                    style={{
                      display: "inline-block",
                      marginTop: 12,
                      background: "var(--slime-green)",
                      color: "var(--void-black)",
                      padding: "4px 12px",
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 900,
                      textTransform: "uppercase",
                    }}
                  >
                    PDF Format • Max 100MB
                  </div>
                </div>
              ) : (
                <div className="print-file-ready">
                  <div className="print-file-top">
                    <span className="print-file-badge"> PDF Verified</span>
                    <span style={{ fontSize: 12, fontWeight: 900 }}>Ready to print</span>
                  </div>
                  <div className="print-file-name" title={file.name}>
                    {file.name}
                  </div>
                  <div className="print-file-pages">
                    {loading ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span className="print-spinner" /> Reading pages...
                      </span>
                    ) : (
                      ` Total: ${pages} page${pages !== 1 ? "s" : ""} counted`
                    )}
                  </div>

                  <label className="print-reupload-label">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    ↺ Replace with another PDF
                  </label>
                </div>
              )}
            </div>

            {/* STEP 2: COLOR MODE */}
            <div>
              <div className="print-sec-header">
                <span className="print-sec-tag">Step 2</span>
                <h2 className="print-sec-title">Color Mode</h2>
              </div>

              <div className="print-mode-grid">
                <div
                  className={`print-mode-btn ${color === "bw" ? "active" : ""}`}
                  onClick={() => setColor("bw")}
                >
                  <span className="print-mode-btn-title">
                     Black & White
                  </span>
                  <span className="print-mode-rate-pill">₹1 / page</span>
                </div>

                <div
                  className={`print-mode-btn ${color === "color" ? "active color-active" : ""}`}
                  onClick={() => setColor("color")}
                >
                  <span className="print-mode-btn-title">
                     Full Color
                  </span>
                  <span className="print-mode-rate-pill">₹10 / page</span>
                </div>
              </div>
            </div>

            {/* STEP 3: COPIES */}
            <div>
              <div className="print-sec-header">
                <span className="print-sec-tag">Step 3</span>
                <h2 className="print-sec-title">Number of Copies</h2>
              </div>

              <div className="print-stepper-box">
                <button
                  className="print-step-btn"
                  onClick={() => setCopies((prev) => Math.max(1, (Number(prev) || 1) - 1))}
                >
                  −
                </button>
                <div className="print-step-value">{copies || 1}</div>
                <button
                  className="print-step-btn"
                  onClick={() => setCopies((prev) => (Number(prev) || 1) + 1)}
                >
                  +
                </button>
              </div>

              <div className="print-presets-row">
                {[1, 2, 5, 10].map((preset) => (
                  <button
                    key={preset}
                    className={`print-preset-pill ${copies === preset ? "active" : ""}`}
                    onClick={() => setCopies(preset)}
                  >
                    {preset} {preset === 1 ? "Copy" : "Copies"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE ESTIMATE & CHECKOUT */}
          <div className="print-col-summary">
            <div>
              <div className="print-summary-card">
                <div className="print-summary-mascot-row">
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Live Estimate
                    </span>
                    <h3 className="print-summary-title">Order Breakdown</h3>
                  </div>

                  {/* Retro comic mascot sticker icon */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "var(--hazard-gold)",
                      borderRadius: "50%",
                      border: "2.5px solid var(--border-dark)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      boxShadow: "2px 2px 0px var(--border-dark)",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
  <polyline points="6 9 6 2 18 2 18 9" />
  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
  <rect x="6" y="14" width="12" height="8" />
</svg>
                  </div>
                </div>

                <div className="print-calc-list">
                  <div className="print-calc-row">
                    <span>Document Pages:</span>
                    <span style={{ fontWeight: 900 }}>{pages || 0} pgs</span>
                  </div>
                  <div className="print-calc-row">
                    <span>Unit Rate ({color === "bw" ? "B&W" : "Color"}):</span>
                    <span style={{ fontWeight: 900 }}>₹{rate} / pg</span>
                  </div>
                  <div className="print-calc-row">
                    <span>Quantity:</span>
                    <span style={{ fontWeight: 900 }}>× {copies || 1}</span>
                  </div>
                </div>

                <div className="print-calc-total-box">
                  <span className="print-total-label">Grand Total:</span>
                  <span className="print-total-price">₹{total}</span>
                </div>

                <div className="print-spec-tags">
                  <span className="print-spec-pill">A4 75 GSM Bond</span>
                  <span className="print-spec-pill">Crisp Laser</span>
                  <span className="print-spec-pill">Library Desk</span>
                </div>
              </div>
            </div>

            {/* ACTION CTA */}
            <div>
              <button className="print-action-cta" onClick={handleAdd}>
                Add to Survival Loadout 
              </button>
            </div>
          </div>
        </main>

        {/* TOAST POPUP */}
        {toast.show && (
          <div className={`print-toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    </>
  );
}

export default Print;
