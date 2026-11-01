import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import * as pdfjsLib from "pdfjs-dist";

// PDF.js worker setup with fallback
try {
  if (typeof window !== "undefined" && typeof Worker !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerPort = new Worker("/pdf.worker.min.mjs", { type: "module" });
  } else {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
} catch (e) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik+Wet+Paint&family=Creepster&family=Titan+One&family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');

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
    background-color: #019E70;
    background-image: 
      radial-gradient(ellipse at 50% 25%, #01B581 0%, #01855E 35%, #002E24 65%, #00121A 90%, #000609 100%),
      radial-gradient(rgba(0, 31, 46, 0.35) 1.5px, transparent 1.5px);
    background-size: 100% 100%, 22px 22px;
    background-position: 0 0, 0 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #FFFFFF;
    padding: 16px 24px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow-x: hidden;
  }

  .print-page-wrapper::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 50% 45%, transparent 40%, rgba(0, 15, 20, 0.45) 75%, rgba(0, 5, 8, 0.88) 100%);
    box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.95), inset 0 0 60px rgba(0, 0, 0, 0.85);
    pointer-events: none;
    z-index: 99;
  }

  /* TOP NAVBAR */
  .print-nav {
    width: 100%;
    max-width: 100%;
    padding: 4px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    gap: 16px;
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
    color: #FFFFFF;
    text-shadow: 2px 2px 0px #000000;
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
    text-shadow: none;
    letter-spacing: 0.3px;
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
    margin-top: 20px;
    margin-bottom: 34px;
    max-width: 980px;
  }

  .print-title {
    font-family: 'Rubik Wet Paint', 'Creepster', 'Titan One', cursive, sans-serif;
    font-size: clamp(38px, 6.2vw, 64px);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    line-height: 1.25;
    margin-bottom: 22px;
    display: inline-block;
    text-align: center;
    /* Melting lime ooze falling down into pumpkin orange inside the letters */
    background-image: 
      radial-gradient(circle at 14% 34%, #D4F024 0%, #D4F024 12px, transparent 13px),
      radial-gradient(circle at 36% 40%, #D4F024 0%, #D4F024 15px, transparent 16px),
      radial-gradient(circle at 64% 36%, #D4F024 0%, #D4F024 13px, transparent 14px),
      radial-gradient(circle at 84% 42%, #D4F024 0%, #D4F024 16px, transparent 17px),
      linear-gradient(180deg, #D4F024 0%, #D8F428 24%, #FFA21C 32%, #FF6A13 42%, #FF5200 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1.2px #0D0D0D;
    paint-order: stroke fill;
    filter: 
      drop-shadow(0 2px 0 #000000)
      drop-shadow(0 5px 0 #D4F024)
      drop-shadow(0 8px 0 #000000)
      drop-shadow(3px 8px 0px #9DE869);
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
    font-size: 15px;
    font-weight: 800;
    color: #E2E8F0;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    opacity: 0.95;
    line-height: 1.5;
    margin-top: 6px;
  }

  /* MAIN WORKBENCH CARD (Moonlit Zombie Trio 100% Pure Vector SVG Backdrop) */
  .print-workbench {
    width: 100%;
    max-width: 1240px;
    background: #010B10;
    color: #FFFFFF;
    border: 4px solid #000000;
    border-radius: 28px;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.95), 8px 8px 0px #000000;
    padding: 34px 36px 38px;
    display: grid;
    grid-template-columns: 1.25fr 0.95fr;
    gap: 32px;
    position: relative;
    overflow: hidden;
  }

  .print-workbench::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/moonlit-zombie-trio.svg') center center / cover no-repeat;
    z-index: 0;
    pointer-events: none;
  }

  .print-workbench > * {
    position: relative;
    z-index: 1;
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
    height: 36px;
    margin-bottom: 12px;
  }

  /* SKETCHED HAND-DRAWN PROGRESS BAR (Pure Glassmorphism) */
  .print-progress-wrapper {
    grid-column: 1 / -1;
    margin-bottom: 26px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: rgba(3, 18, 14, 0.28);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 22px;
    padding: 18px 22px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.18);
    position: relative;
    overflow: hidden;
  }

  .print-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 4px;
    margin-bottom: 2px;
  }

  .print-progress-status {
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    color: var(--slime-green);
    letter-spacing: 0.8px;
  }

  .print-progress-steps-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .print-progress-tab {
    background: rgba(13, 13, 13, 0.75);
    backdrop-filter: blur(4px);
    border: 2px solid var(--border-dark);
    color: #E2E8F0;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    cursor: pointer;
    padding: 5px 12px;
    border-radius: 9999px;
    transition: all 0.15s ease;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.4);
  }

  .print-progress-tab:hover {
    color: #FFFFFF;
  }

  .print-progress-tab.active {
    color: var(--void-black);
    background: var(--hazard-gold);
    border: 2px solid var(--border-dark);
    box-shadow: 2px 2px 0px var(--border-dark);
  }

  .print-kid-track {
    width: 100%;
    min-width: 0;
    height: 42px;
    background: #FFFFFF;
    border: 3.5px solid #23272D;
    border-radius: 255px 25px 225px 25px/25px 225px 25px 255px;
    padding: 4px;
    box-shadow: 4px 4px 0px #0D0D0D;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    filter: url(#kid-pen-wobble);
    margin-top: 4px;
    contain: paint;
  }

  .print-kid-fill {
    height: 100%;
    border-radius: 255px 20px 225px 20px/20px 225px 20px 255px;
    border: 2.5px solid #1E232B;
    background-color: #8DE045;
    background-image: repeating-linear-gradient(
      -55deg,
      #8DE045 0px,
      #8DE045 6.5px,
      #1F2916 7.5px,
      #1F2916 9px,
      #8DE045 10px
    );
    box-shadow: 0 0 0 3px rgba(134, 214, 60, 0.7);
    transition: width 2.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.8s ease;
    position: relative;
    will-change: width;
  }

  @media (max-width: 680px) {
    .print-progress-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  /* STEP ACTIONS FOOTER */
  .print-step-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;
    padding-top: 18px;
    border-top: 2px dashed rgba(255, 255, 255, 0.28);
    gap: 12px;
  }

  .print-step-btn-back {
    background: var(--card-surface);
    color: #FFFFFF;
    border: 2.5px solid var(--border-dark);
    border-radius: 9999px;
    padding: 10px 20px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: var(--shadow-solid-sm);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .print-step-btn-back:hover {
    background: #272D3A;
    transform: translate(-1.5px, -1.5px);
    box-shadow: 3.5px 3.5px 0px var(--border-dark);
  }

  .print-step-btn-next {
    background: var(--slime-green);
    color: var(--void-black);
    border: 3px solid var(--border-dark);
    border-radius: 9999px;
    padding: 12px 24px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    box-shadow: var(--shadow-solid-sm);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
  }

  .print-step-btn-next:hover {
    background: #B4FF7B;
    transform: translate(-1.5px, -1.5px);
    box-shadow: 4.5px 4.5px 0px var(--border-dark);
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
    margin: 0;
  }

  /* LEFT COLUMN (CONFIG) */
  .print-col-config {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .print-step-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
  }

  /* DROPZONE (Pure Glassmorphism) */
  .print-dropzone {
    border: 3px dashed var(--slime-green);
    border-radius: 24px;
    background: rgba(3, 18, 14, 0.25);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    padding: 36px 24px;
    min-height: 320px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    cursor: pointer;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.16);
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
    opacity: 0 !important;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 10;
    font-size: 0;
    color: transparent;
  }

  .print-drop-icon {
    font-size: 38px;
    margin-bottom: 12px;
    display: inline-block;
  }

  .print-drop-main {
    font-family: 'Archivo Black', sans-serif;
    font-size: 18px;
    text-transform: uppercase;
    margin-bottom: 6px;
    color: var(--slime-green);
  }

  .print-drop-sub {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-muted);
  }

  /* FILE DETECTED CARD (Glassmorphic) */
  .print-file-ready {
    background: rgba(3, 18, 14, 0.28);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    color: #FFFFFF;
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 24px;
    padding: 26px 28px;
    min-height: 320px;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }

  .print-file-top-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 2px dashed rgba(0,0,0,0.25);
  }

  .print-file-badge {
    background: var(--void-black);
    color: var(--slime-green);
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    font-weight: 900;
    padding: 4px 12px;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: none;
  }

  .print-file-status-text {
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #A3E635;
    text-shadow: 1px 1px 0px #000000;
  }

  .print-file-center-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: auto 0;
    width: 100%;
    max-width: 90%;
  }

  .print-file-doc-icon {
    width: 64px;
    height: 64px;
    background: var(--void-black);
    color: var(--slime-green);
    border-radius: 50%;
    border: 3px solid #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px 0px rgba(0,0,0,0.4);
    margin-bottom: 4px;
  }

  .print-file-name {
    font-family: 'Archivo Black', sans-serif;
    font-size: 21px;
    color: #FFFFFF;
    word-break: break-word;
    line-height: 1.25;
    margin: 0;
    text-shadow: 1px 1px 0px #000000;
  }

  .print-file-pages-box {
    display: inline-block;
    background: rgba(0, 0, 0, 0.45);
    border: 2px solid rgba(163, 230, 53, 0.4);
    padding: 6px 18px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 900;
    color: #A3E635;
  }

  .print-reupload-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 900;
    color: #FFFFFF;
    background: rgba(1, 20, 16, 0.7);
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    padding: 9px 22px;
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,0.4);
    transition: all 0.15s ease;
  }

  .print-reupload-label:hover {
    transform: translateY(-2px);
    background: rgba(1, 158, 112, 0.35);
    border-color: rgba(163, 230, 53, 0.4);
    box-shadow: 0 6px 18px rgba(0,0,0,0.5);
  }

  .print-cancel-order-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 900;
    color: #FFA8A8;
    background: rgba(230, 57, 70, 0.25);
    border: 1.5px solid rgba(230, 57, 70, 0.5);
    padding: 9px 20px;
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,0.4);
    transition: all 0.15s ease;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .print-cancel-order-btn:hover {
    transform: translateY(-2px);
    background: rgba(230, 57, 70, 0.45);
    color: #FFFFFF;
    box-shadow: 0 6px 18px rgba(0,0,0,0.5);
  }

  .print-cancel-pill {
    background: rgba(0,0,0,0.15);
    color: var(--void-black);
    border: 2px solid var(--border-dark);
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.1s ease;
  }
  .print-cancel-pill:hover {
    background: #E63946;
    color: #FFFFFF;
    border-color: #000000;
    transform: scale(1.05);
  }

  /* COLOR MODE SELECTOR (NEOBRUTAL CARDS - EXPANDED & BOLD) */
  .print-mode-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    flex: 1;
    min-height: 250px;
    margin: 6px 0 0;
  }

  .print-mode-btn {
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 24px;
    padding: 24px 22px;
    background: rgba(3, 18, 14, 0.35);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    color: #FFFFFF;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.16);
    transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    position: relative;
  }

  .print-mode-btn:hover:not(.active) {
    background: rgba(1, 158, 112, 0.2);
    border-color: rgba(163, 230, 53, 0.35);
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0,0,0,0.45), 0 0 16px rgba(1, 158, 112, 0.25);
  }

  .print-mode-btn.active {
    background: rgba(163, 230, 53, 0.22);
    color: #FFFFFF;
    border: 2px solid #A3E635;
    transform: translate(-2px, -2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 22px rgba(163, 230, 53, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }

  .print-mode-btn.active.color-active {
    background: rgba(3, 194, 128, 0.25);
    color: #FFFFFF;
    border: 2px solid #03C280;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 22px rgba(3, 194, 128, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }

  .print-mode-btn-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }

  .print-mode-icon-circle {
    width: 54px;
    height: 54px;
    background: rgba(1, 15, 12, 0.7);
    color: #A3E635;
    border-radius: 16px;
    border: 2px solid rgba(163, 230, 53, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    transition: all 0.15s ease;
  }

  .print-mode-btn.active .print-mode-icon-circle {
    background: rgba(0, 0, 0, 0.6);
    color: #A3E635;
    border-color: #A3E635;
    box-shadow: 0 0 14px rgba(163, 230, 53, 0.4);
  }

  .print-mode-btn.active.color-active .print-mode-icon-circle {
    background: rgba(0, 0, 0, 0.6);
    color: #03C280;
    border-color: #03C280;
    box-shadow: 0 0 14px rgba(3, 194, 128, 0.45);
  }

  .print-mode-rate-pill {
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 15px;
    font-weight: 900;
    border: 1.5px solid rgba(163, 230, 53, 0.4);
    background: rgba(1, 25, 20, 0.7);
    color: #CCFB9A;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    letter-spacing: -0.2px;
    transition: all 0.15s ease;
  }

  .print-mode-btn.active .print-mode-rate-pill {
    background: rgba(163, 230, 53, 0.28);
    color: #FFFFFF;
    border-color: #A3E635;
    box-shadow: 0 0 12px rgba(163, 230, 53, 0.35);
  }

  .print-mode-btn.active.color-active .print-mode-rate-pill {
    background: rgba(3, 194, 128, 0.32);
    color: #FFFFFF;
    border-color: #03C280;
    box-shadow: 0 0 12px rgba(3, 194, 128, 0.4);
  }

  .print-mode-btn-bottom {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 18px;
  }

  .print-mode-btn-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: 21px;
    text-transform: uppercase;
    letter-spacing: -0.4px;
    line-height: 1.15;
  }

  .print-mode-btn-sub {
    font-size: 12px;
    font-weight: 800;
    opacity: 0.85;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* COPIES STEPPER & PRESETS (Glassmorphic) */
  .print-stepper-hero-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(3, 18, 14, 0.3);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    padding: 28px 24px 22px;
    flex: 1;
    min-height: 200px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.16);
    margin: 6px 0 0;
  }

  .print-stepper-ctrl-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
    width: 100%;
  }

  .print-step-btn {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    background: rgba(1, 28, 22, 0.75);
    color: #CCFB9A;
    border: 1.5px solid rgba(163, 230, 53, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,0.4);
    transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
    user-select: none;
  }

  .print-step-btn.plus-btn {
    background: rgba(1, 158, 112, 0.3);
    color: #A3E635;
    border-color: #A3E635;
  }

  .print-step-btn:hover {
    transform: translateY(-2px);
    background: rgba(1, 158, 112, 0.45);
    color: #FFFFFF;
    border-color: #A3E635;
    box-shadow: 0 6px 18px rgba(0,0,0,0.5), 0 0 14px rgba(163, 230, 53, 0.3);
  }

  .print-step-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  }

  .print-step-value-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 130px;
  }

  .print-step-value {
    font-family: 'Archivo Black', sans-serif;
    font-size: 64px;
    color: #A3E635;
    line-height: 1;
    letter-spacing: -2px;
    text-shadow: 0 0 18px rgba(163, 230, 53, 0.4), 2px 2px 0px #000000;
    user-select: none;
  }

  .print-step-value-label {
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #88C5A8;
    margin-top: 6px;
  }

  .print-presets-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 100%;
    margin-top: 20px;
    border-top: 1.5px dashed rgba(255, 255, 255, 0.2);
    padding-top: 16px;
  }

  .print-preset-pill {
    text-align: center;
    padding: 12px 6px;
    background: rgba(1, 20, 16, 0.6);
    color: #88C5A8;
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 14px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .print-preset-pill.active {
    background: rgba(163, 230, 53, 0.25);
    color: #FFFFFF;
    border: 2px solid #A3E635;
    transform: translate(-2px, -2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.5), 0 0 16px rgba(163, 230, 53, 0.35);
  }

  .print-preset-pill:hover:not(.active) {
    background: rgba(1, 158, 112, 0.25);
    color: #FFFFFF;
    border-color: rgba(163, 230, 53, 0.35);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.5);
  }

  /* RIGHT COLUMN: SUMMARY & CTA */
  .print-col-summary {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-top: 0px;
  }

  .print-summary-mascot-row {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 36px;
    margin-bottom: 12px;
    position: relative;
  }

  .print-zombie-head-mascot {
    width: 62px;
    height: 62px;
    object-fit: contain;
    filter: drop-shadow(2px 4px 0px rgba(0,0,0,0.85));
    position: absolute;
    bottom: -14px;
    right: 27.5px;
    z-index: 5;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: pointer;
  }

  .print-zombie-head-mascot:hover {
    transform: scale(1.1) rotate(-4deg);
  }

  .print-summary-card {
    background: rgba(3, 18, 14, 0.3);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    color: #FFFFFF;
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 20px;
    padding: 18px 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.18);
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .print-summary-title-row {
    margin-bottom: 10px;
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.16);
    padding-bottom: 8px;
    text-align: center;
  }

  .print-summary-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: -0.3px;
    color: #A3E635;
    margin: 0;
    text-shadow: 0 0 12px rgba(163, 230, 53, 0.3), 1px 1px 0px #000000;
  }

  .print-calc-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
  }

  .print-calc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13.5px;
    font-weight: 700;
    color: #F1F5F9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .print-calc-total-box {
    background: rgba(1, 18, 14, 0.65);
    color: #FFFFFF;
    border: 1.5px solid rgba(163, 230, 53, 0.4);
    border-radius: 14px;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  .print-total-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 15px;
    text-transform: uppercase;
    color: #FFFFFF;
    letter-spacing: 0.5px;
  }

  .print-total-price {
    font-family: 'Archivo Black', sans-serif;
    font-size: 26px;
    color: #A3E635;
    letter-spacing: -0.5px;
    text-shadow: 0 0 16px rgba(163, 230, 53, 0.45);
  }

  /* SPEC TAGS */
  .print-spec-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .print-spec-pill {
    background: rgba(1, 20, 16, 0.65);
    color: #E2E8F0;
    border: 1.5px solid rgba(255, 255, 255, 0.18);
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
    background: var(--slime-green);
    color: var(--void-black);
    border: 3.5px solid var(--border-dark);
    border-radius: 9999px;
    padding: 13px 20px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 15px;
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
    background: #B4FF7B;
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

// IndexedDB persistence for active print job so page refresh preserves state
const DB_NAME = "OdysseyPrintDB";
const STORE_NAME = "active_print_job";

const getDB = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });

const saveActiveJob = async (fileObj, stateObj) => {
  try {
    const db = await getDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({ file: fileObj, ...stateObj }, "current");
  } catch (e) {
    console.warn("IndexedDB save failed:", e);
  }
};

const loadActiveJob = async () => {
  try {
    const db = await getDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get("current");
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
};

const clearActiveJob = async () => {
  try {
    const db = await getDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete("current");
  } catch (e) {
    console.warn("IndexedDB clear failed:", e);
  }
};

function Print() {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(0);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState("bw");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const rate = color === "bw" ? 1 : 10;
  const total = (pages || 0) * rate * (copies || 1);

  // Keyboard shortcut: Escape returns to base
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Restore active job from IndexedDB on refresh
  useEffect(() => {
    loadActiveJob().then((saved) => {
      if (saved && saved.file) {
        setFile(saved.file);
        if (saved.pages) setPages(saved.pages);
        if (saved.color) setColor(saved.color);
        if (saved.copies) setCopies(saved.copies);
        if (saved.currentStep) setCurrentStep(saved.currentStep);
      }
    });
  }, []);

  // Save changes to IndexedDB so refresh never loses state
  useEffect(() => {
    if (file) {
      saveActiveJob(file, { pages, color, copies, currentStep });
    }
  }, [file, pages, color, copies, currentStep]);

  const handleCancel = async () => {
    await clearActiveJob();
    setFile(null);
    setPages(0);
    setColor("bw");
    setCopies(1);
    setCurrentStep(1);
    showToastMessage("Order cancelled & document removed", "info");
  };

  const showToastMessage = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2200);
  };

  const goToStep = (step) => {
    if (step > 1 && !file) {
      showToastMessage("Please upload a PDF document first", "error");
      return;
    }
    setCurrentStep(step);
  };

  // Fast, bulletproof PDF page-count parser
  const countPdfPages = (uint8Array) => {
    try {
      const text = new TextDecoder("latin1").decode(uint8Array);
      // Strategy 1: Find root page count (/Type /Pages ... /Count N)
      const countMatch = text.match(/\/Type\s*\/Pages[^>]*?\/Count\s+(\d+)/i) ||
                         text.match(/\/Count\s+(\d+)[^>]*?\/Type\s*\/Pages/i);
      if (countMatch && countMatch[1]) {
        const c = parseInt(countMatch[1], 10);
        if (c > 0) return c;
      }

      // Strategy 2: Count all page objects
      const pageMatches = text.match(/\/Type\s*\/Page\b/g);
      if (pageMatches && pageMatches.length > 0) {
        return pageMatches.length;
      }
    } catch (e) {
      console.warn("Direct PDF page extraction error:", e);
    }
    return null;
  };

  const handleFileUpload = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // Accept by MIME type or .pdf extension
    const isPdf = selected.type === "application/pdf" || selected.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      showToastMessage("Please upload a valid PDF document", "error");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onload = async function () {
      try {
        const buffer = this.result;
        const typedArray = new Uint8Array(buffer);
        let numPages = countPdfPages(typedArray);

        // Fallback to pdfjsLib if fast regex did not find page count
        if (!numPages) {
          try {
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
            numPages = pdf.numPages;
          } catch (pdfErr) {
            console.warn("pdfjsLib getDocument error:", pdfErr);
          }
        }

        const finalPages = numPages && numPages > 0 ? numPages : 1;
        setPages(finalPages);
        setFile(selected);
        showToastMessage(`PDF verified: ${finalPages} page${finalPages !== 1 ? "s" : ""} detected!`, "success");
      } catch (err) {
        console.error("PDF reading error:", err);
        // Fallback gracefully so user can proceed
        setPages(1);
        setFile(selected);
        showToastMessage("PDF accepted: 1 page counted", "info");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setLoading(false);
      showToastMessage("Could not read file from disk. Please try again.", "error");
    };

    reader.readAsArrayBuffer(selected);
  };

  const handleAdd = () => {
    if (!file) {
      showToastMessage("Upload a PDF document first!", "error");
      return;
    }

    if (!copies || Number(copies) < 1) {
      showToastMessage("Minimum 1 copy required!", "error");
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

    clearActiveJob();
    showToastMessage("Added to survival loadout!", "success");
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
            OUTBREAK PRINT BUNKER
          </h1>
          <p className="print-subtitle">
            High-speed document printing for campus survival. Upload your PDF and collect at the library desk.
          </p>
        </div>

        {/* WORKBENCH CARD */}
        <main className="print-workbench">
          {/* SKETCHED PROGRESS BAR (Matching reference image) */}
          <div className="print-progress-wrapper">
            <div className="print-progress-header">
              <span className="print-progress-status">
                MISSION PROGRESS: STEP {currentStep} OF 3
              </span>
              <div className="print-progress-steps-row">
                <button
                  type="button"
                  className={`print-progress-tab ${currentStep === 1 ? "active" : ""}`} aria-current={currentStep === 1 ? "step" : undefined}
                  onClick={() => goToStep(1)}
                >
                  1. Upload
                </button>
                <button
                  type="button"
                  className={`print-progress-tab ${currentStep === 2 ? "active" : ""}`} aria-current={currentStep === 2 ? "step" : undefined}
                  onClick={() => goToStep(2)}
                >
                  2. Color
                </button>
                <button
                  type="button"
                  className={`print-progress-tab ${currentStep === 3 ? "active" : ""}`} aria-current={currentStep === 3 ? "step" : undefined}
                  onClick={() => goToStep(3)}
                >
                  3. Copies & Review
                </button>
              </div>
            </div>

            {/* INLINE SVG FILTER FOR HAND-DRAWN PEN JITTER WITH ANTI-ALIASING */}
            <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>
              <defs>
                <filter id="kid-pen-wobble" x="-5%" y="-10%" width="110%" height="120%" colorInterpolationFilters="sRGB">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02 0.04" numOctaves="2" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.0" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                  <feGaussianBlur in="displaced" stdDeviation="0.35" result="softened" />
                  <feMerge>
                    <feMergeNode in="softened" />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* FULL-WIDTH LEFT-TO-RIGHT TRACK MATCHING IMAGE */}
            <div className="print-kid-track" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3} aria-valuetext={`Step ${currentStep} of 3`}>
              <div
                className="print-kid-fill"
                style={{
                  width: currentStep === 1 ? "35%" : currentStep === 2 ? "68%" : "100%",
                }}
              />
            </div>
          </div>

          {/* LEFT: CURRENT SEQUENTIAL STEP CONFIG */}
          <div className="print-col-config">
            {/* STEP 1: UPLOAD MANUSCRIPT */}
            {currentStep === 1 && (
              <div className="print-step-content">
                <div className="print-sec-header">
                  <span className="print-sec-tag">Step 1 of 3</span>
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
                    <div className="print-file-top-bar">
                      <span className="print-file-badge">PDF Verified</span>
                      <span className="print-file-status-text">Decontaminated</span>
                    </div>

                    <div className="print-file-center-body">
                      <div className="print-file-doc-icon">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <path d="m9 15 2 2 4-4" />
                        </svg>
                      </div>

                      <h3 className="print-file-name" title={file.name}>
                        {file.name}
                      </h3>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                        <div className="print-file-pages-box">
                          {loading ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <span className="print-spinner" /> Reading pages...
                            </span>
                          ) : (
                            `Total: ${pages} page${pages !== 1 ? "s" : ""} counted`
                          )}
                        </div>
                        {file?.size && (
                          <div className="print-file-pages-box" style={{ background: "rgba(0, 0, 0, 0.08)" }}>
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", flexWrap: "wrap", width: "100%" }}>
                      <label className="print-reupload-label">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
                        />
                        ↺ Replace with another PDF
                      </label>
                      <button
                        type="button"
                        className="print-cancel-order-btn"
                        onClick={handleCancel}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: COLOR MODE */}
            {currentStep === 2 && (
              <div className="print-step-content">
                <div className="print-sec-header">
                  <span className="print-sec-tag">Step 2 of 3</span>
                  <h2 className="print-sec-title">Select Color Mode</h2>
                </div>

                <div className="print-mode-grid">
                  <div
                    className={`print-mode-btn ${color === "bw" ? "active" : ""}`}
                    onClick={() => setColor("bw")}
                  >
                    <div className="print-mode-btn-top">
                      <div className="print-mode-icon-circle">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
                        </svg>
                      </div>
                      <span className="print-mode-rate-pill">₹1 / page</span>
                    </div>

                    <div className="print-mode-btn-bottom">
                      <span className="print-mode-btn-title">
                        Black & White
                      </span>
                      <span className="print-mode-btn-sub">Laser Monochromatic</span>
                    </div>
                  </div>

                  <div
                    className={`print-mode-btn ${color === "color" ? "active color-active" : ""}`}
                    onClick={() => setColor("color")}
                  >
                    <div className="print-mode-btn-top">
                      <div className="print-mode-icon-circle">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="8" r="3" fill="#FF70A6" stroke="none" />
                          <circle cx="8" cy="14" r="3" fill="#9DE869" stroke="none" />
                          <circle cx="16" cy="14" r="3" fill="#F7B919" stroke="none" />
                        </svg>
                      </div>
                      <span className="print-mode-rate-pill">₹10 / page</span>
                    </div>

                    <div className="print-mode-btn-bottom">
                      <span className="print-mode-btn-title">
                        Full Color
                      </span>
                      <span className="print-mode-btn-sub">Vibrant CMYK Gloss</span>
                    </div>
                  </div>
                </div>

                <div className="print-step-footer" style={{ justifyContent: "flex-start" }}>
                  <button
                    type="button"
                    className="print-step-btn-back"
                    onClick={() => goToStep(1)}
                  >
                    ← Back to Upload
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: COPIES */}
            {currentStep === 3 && (
              <div className="print-step-content">
                <div className="print-sec-header">
                  <span className="print-sec-tag">Step 3 of 3</span>
                  <h2 className="print-sec-title">Number of Copies</h2>
                </div>

                <div className="print-stepper-hero-card">
                  <div className="print-stepper-ctrl-row">
                    <button
                      type="button"
                      className="print-step-btn"
                      onClick={() => setCopies((prev) => Math.max(1, (Number(prev) || 1) - 1))}
                      aria-label="Decrease copies"
                    >
                      −
                    </button>

                    <div className="print-step-value-col">
                      <div className="print-step-value">{copies || 1}</div>
                      <span className="print-step-value-label">Copies Selected</span>
                    </div>

                    <button
                      type="button"
                      className="print-step-btn plus-btn"
                      onClick={() => setCopies((prev) => (Number(prev) || 1) + 1)}
                      aria-label="Increase copies"
                    >
                      +
                    </button>
                  </div>

                  <div className="print-presets-grid">
                    {[1, 2, 5, 10].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`print-preset-pill ${copies === preset ? "active" : ""}`}
                        onClick={() => setCopies(preset)}
                      >
                        {preset} {preset === 1 ? "Copy" : "Copies"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="print-step-footer" style={{ justifyContent: "flex-start" }}>
                  <button
                    type="button"
                    className="print-step-btn-back"
                    onClick={() => goToStep(2)}
                  >
                    ← Back to Color
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: LIVE ESTIMATE & CHECKOUT */}
          <div className="print-col-summary">
            {/* Mascot row above card matching left column header so blue box top aligns with green dropzone */}
            <div className="print-summary-mascot-row">
              <img
                src="/zombie-head-transparent.png"
                alt="Zombie Mascot"
                className="print-zombie-head-mascot"
              />
            </div>

            <div className="print-summary-card">
              <div className="print-summary-title-row">
                <h3 className="print-summary-title">Order Breakdown</h3>
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
            </div>

            {/* ACTION CTA */}
            <div style={{ marginTop: "12px" }}>
              {currentStep < 3 ? (
                <button
                  className="print-action-cta"
                  style={{
                    background: "var(--slime-green)",
                    color: "var(--void-black)",
                  }}
                  onClick={() => goToStep(currentStep + 1)}
                >
                  {currentStep === 1 ? "Continue to Color Selection →" : "Continue to Copies & Review →"}
                </button>
              ) : (
                <button
                  className="print-action-cta"
                  style={{
                    background: "var(--slime-green)",
                    color: "var(--void-black)",
                  }}
                  onClick={handleAdd}
                >
                  Add to Survival Loadout • ₹{total}
                </button>
              )}
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
