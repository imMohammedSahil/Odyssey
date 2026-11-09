import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Plus+Jakarta+Sans:wght@700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

  body, html {
    margin: 0;
    padding: 0;
    background: #000000;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  .rcpt-root {
    min-height: 100vh;
    width: 100vw;
    background: #000000;
    position: relative;
    overflow-x: hidden;
    overflow-y: hidden;
    cursor: pointer;
    user-select: none;
  }

  .rcpt-root.revealed {
    overflow-y: auto;
    cursor: default;
  }

  /* ── 100% PURE VECTOR BACKDROP ── */
  .rcpt-bg-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
    background: #000000;
  }

  .rcpt-bg-vector {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  /* Hero Section Fold (100vh) */
  .rcpt-hero-fold {
    position: relative;
    min-height: 100vh;
    width: 100%;
    z-index: 5;
  }

  /* Smooth outward environmental floor fade to black on scroll */
  .rcpt-hero-fold::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 380px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(1, 6, 3, 0.15) 25%,
      rgba(1, 6, 3, 0.50) 55%,
      rgba(0, 0, 0, 0.85) 80%,
      #000000 100%
    );
    pointer-events: none;
    z-index: 6;
  }

  /* ── ORGANIC PAINT CANVAS MASK (Controls black sheet & reveal waves) ── */
  .rcpt-paint-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    pointer-events: none;
    display: block;
  }

  /* Ambient depth vignette (disabled to keep pristine solid contrast) */
  .rcpt-bg-vignette {
    display: none;
  }

  /* ── AWWWARDS ENCHANTED CURSOR FOLLOWER PILL ── */
  .awwwards-cursor-pill {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 11px 28px;
    background: linear-gradient(135deg, #23854b 0%, #13552e 100%);
    border: 1.5px solid #52e389;
    border-radius: 9999px;
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
    color: #ffffff;
    font-family: 'Cinzel', serif;
    font-size: 11.5px;
    font-weight: 900;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    transition: opacity 0.4s ease, border-color 0.25s ease, background 0.25s ease, transform 0.1s ease-out;
  }

  /* Top Return Button */
  .rcpt-nav-back {
    position: fixed;
    top: 24px;
    left: 24px;
    z-index: 50;
    background: rgba(2, 11, 7, 0.85);
    border: 1.5px solid #5fe291;
    color: #e8fff0;
    padding: 9px 18px;
    border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 3px 3px 0px #020804;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .rcpt-nav-back:hover {
    background: #145a37;
    transform: translate(-1px, -1px);
  }

  /* ── BELOW-THE-FOLD BESPOKE GOTHIC CAMPUS RECEIPT ── */
  .rcpt-record-section {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 240px 16px 160px;
    background: #000000;
    cursor: default;
  }

  .rcpt-ticket-assembly {
    position: relative;
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    align-items: center;
    filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.95));
  }

  .rcpt-raven-top-wrap {
    position: relative;
    width: calc(100% * (1024 / 554));
    max-width: 960px;
    margin-bottom: -3px;
    z-index: 5;
    pointer-events: none;
    user-select: none;
    display: flex;
    justify-content: center;
  }

  .rcpt-raven-top-svg {
    width: 100%;
    height: auto;
    display: block;
    pointer-events: none;
    user-select: none;
  }

  /* ── AUTHENTIC ENGRAVED VELLUM PARCHMENT CARD ── */
  .rcpt-ticket-card {
    position: relative;
    width: 100%;
    background-color: #daead4;
    background-image: 
      radial-gradient(ellipse at 50% 15%, rgba(255, 255, 255, 0.35) 0%, rgba(218, 234, 212, 0.2) 60%, rgba(185, 206, 177, 0.45) 100%),
      linear-gradient(180deg, #daead4 0%, #d2e4cb 40%, #c8dcbf 100%);
    color: #0f1a13;
    padding: 28px 36px 46px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    user-select: text !important;
    -webkit-user-select: text !important;
    z-index: 4;
    box-shadow: 
      inset 0 0 35px rgba(20, 32, 22, 0.08),
      inset 0 0 2px rgba(15, 26, 17, 0.25);
    /* Thermal parchment jagged serrated sawtooth tear edge strictly at bottom */
    clip-path: polygon(
      0% 0px, 100% 0px,
      100% calc(100% - 12px), 97.5% 100%, 95% calc(100% - 12px), 92.5% 100%, 90% calc(100% - 12px), 87.5% 100%,
      85% calc(100% - 12px), 82.5% 100%, 80% calc(100% - 12px), 77.5% 100%, 75% calc(100% - 12px), 72.5% 100%,
      70% calc(100% - 12px), 67.5% 100%, 65% calc(100% - 12px), 62.5% 100%, 60% calc(100% - 12px), 57.5% 100%,
      55% calc(100% - 12px), 52.5% 100%, 50% calc(100% - 12px), 47.5% 100%, 45% calc(100% - 12px), 42.5% 100%,
      40% calc(100% - 12px), 37.5% 100%, 35% calc(100% - 12px), 32.5% 100%, 30% calc(100% - 12px), 27.5% 100%,
      25% calc(100% - 12px), 22.5% 100%, 20% calc(100% - 12px), 17.5% 100%, 15% calc(100% - 12px), 12.5% 100%,
      10% calc(100% - 12px), 7.5% 100%, 5% calc(100% - 12px), 2.5% 100%, 0% calc(100% - 12px)
    );
  }

  /* Fine Engraved Ornamental Inset Frame */
  .rcpt-ticket-card::before {
    content: '';
    position: absolute;
    inset: 10px 12px 24px;
    border: 1px solid rgba(18, 30, 21, 0.28);
    pointer-events: none;
    z-index: 1;
  }

  .rcpt-ticket-card::after {
    content: '';
    position: absolute;
    inset: 13px 15px 27px;
    border: 0.5px solid rgba(18, 30, 21, 0.14);
    pointer-events: none;
    z-index: 1;
  }

  .rcpt-ticket-card * {
    user-select: text !important;
    -webkit-user-select: text !important;
    position: relative;
    z-index: 2;
  }

  /* Header Branding */
  .rcpt-tkt-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 4px;
    padding-top: 4px;
  }

  .rcpt-tkt-pretitle {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.28em;
    color: #2b4533;
    text-transform: uppercase;
  }

  .rcpt-tkt-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(20px, 3.4vw, 25px);
    font-weight: 900;
    letter-spacing: 0.1em;
    color: #0b140e;
    margin: 4px 0 2px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  /* Classical Engraved Double-Hairline Rules */
  .rcpt-tkt-divider-double {
    width: 100%;
    height: 4px;
    border-top: 1.5px solid #0f1c13;
    border-bottom: 0.5px solid #0f1c13;
    margin: 6px 0 2px;
  }

  .rcpt-tkt-divider-dashed {
    width: 100%;
    border-bottom: 1px dashed rgba(18, 32, 22, 0.35);
    margin: 2px 0;
  }

  /* Metadata Rows - Refined Scriptorium Typography */
  .rcpt-tkt-meta-group {
    display: flex;
    flex-direction: column;
    gap: 11px;
    padding: 2px 2px;
  }

  .rcpt-tkt-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    position: relative;
  }

  .rcpt-tkt-label {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #2a4231;
    background: none;
    padding: 0;
    border-radius: 0;
    clip-path: none;
    box-shadow: none;
    white-space: nowrap;
  }

  .rcpt-tkt-val {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #0c150f;
    text-align: right;
    white-space: nowrap;
    letter-spacing: 0.04em;
  }

  .rcpt-tkt-status-pill {
    display: inline-flex;
    align-items: center;
    font-family: 'Cinzel', serif;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #164023;
    white-space: nowrap;
  }

  .rcpt-tkt-copy-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    min-width: 54px;
    max-width: 54px;
    box-sizing: border-box;
    margin-left: 8px;
    padding: 2px 0;
    text-align: center;
    border-radius: 2px;
    background: rgba(18, 34, 23, 0.08);
    color: #122417;
    border: 1px solid rgba(18, 34, 23, 0.35);
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    cursor: pointer !important;
    user-select: none !important;
    white-space: nowrap;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .rcpt-tkt-copy-btn.copied {
    background: #122417;
    color: #e5f2de;
    border-color: #122417;
  }

  .rcpt-tkt-copy-btn:hover {
    background: #122417;
    color: #e5f2de;
    border-color: #122417;
  }

  /* Manifest Section - Classical Inscribed Ledger */
  .rcpt-tkt-manifest-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .rcpt-tkt-manifest-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(18, 32, 22, 0.25);
    padding-bottom: 4px;
  }

  .rcpt-tkt-manifest-header .rcpt-tkt-label {
    font-size: 10.5px;
    letter-spacing: 0.18em;
  }

  .rcpt-tkt-manifest-box {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 12px 14px;
    border: 1px solid rgba(18, 30, 21, 0.3);
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.18);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.03);
  }

  .rcpt-tkt-item-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 7px;
    border-bottom: 1px dotted rgba(20, 36, 24, 0.22);
  }

  .rcpt-tkt-item-row:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .rcpt-tkt-item-title {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: #0b140e;
  }

  .rcpt-tkt-item-qty {
    font-family: 'Cinzel', serif;
    font-size: 10.5px;
    font-weight: 600;
    color: #354d3d;
    font-style: italic;
    margin-top: 2px;
    letter-spacing: 0.03em;
  }

  .rcpt-tkt-item-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 800;
    color: #0c160f;
    margin-left: 14px;
    white-space: nowrap;
  }

  /* Total Paid Callout - High-Craftsmanship Engraved Frame */
  .rcpt-tkt-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
    padding: 8px 12px;
    border-top: 1.5px solid #0f1c13;
    border-bottom: 3px double #0f1c13;
    background: rgba(18, 32, 22, 0.04);
  }

  .rcpt-tkt-total-row .rcpt-tkt-label {
    font-size: 12px;
    letter-spacing: 0.16em;
    color: #101c13;
  }

  .rcpt-tkt-total-badge {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(22px, 3.8vw, 27px);
    font-weight: 900;
    color: #0b150e;
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
    letter-spacing: -0.01em;
  }

  /* Scannable Code 128 SVG Barcode - Crisp Optical Precision */
  .rcpt-tkt-barcode-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    margin-top: 8px;
    padding-top: 14px;
    border-top: 1px dashed rgba(18, 32, 22, 0.35);
    width: 100%;
  }

  .rcpt-tkt-barcode-svg {
    width: 88%;
    max-width: 340px;
    height: 44px;
    display: block;
    shape-rendering: crispEdges;
  }

  .rcpt-tkt-barcode-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.32em;
    color: #1a2a1f;
  }

  /* Action Buttons - Dark Scriptorium Craftsmanship */
  .rcpt-tkt-btn-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
  }

  .rcpt-tkt-btn {
    flex: 1;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cinzel', serif;
    font-weight: 900;
    font-size: 11.5px;
    letter-spacing: 0.12em;
    color: #0e1a12;
    background: rgba(255, 255, 255, 0.35);
    border: 1.5px solid #0f1c13;
    border-radius: 2px;
    box-shadow: 2px 2px 0px rgba(15, 28, 19, 0.35);
    cursor: pointer !important;
    user-select: none !important;
    transition: transform 0.12s ease, background 0.15s ease, color 0.15s ease;
  }

  .rcpt-tkt-btn:hover {
    background: #0f1c13;
    color: #e5f2de;
    transform: translateY(-1px);
    box-shadow: 2px 3px 0px rgba(15, 28, 19, 0.5);
  }

  .rcpt-tkt-btn:active {
    transform: translateY(1px);
    box-shadow: 1px 1px 0px rgba(15, 28, 19, 0.4);
  }

  .rcpt-tkt-btn.primary {
    background: #0e1911;
    color: #e3f2dc;
    border: 1.5px solid #0e1911;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
  }

  .rcpt-tkt-btn.primary:hover {
    background: #1a2f21;
    border-color: #1a2f21;
    color: #ffffff;
  }

  /* ── PRINT / PDF DOCUMENT STYLES (Hidden on Screen) ── */
  .rcpt-screen-view {
    display: block;
    width: 100%;
  }

  .rcpt-pdf-document {
    display: none;
  }

  /* ── FULL-BLEED ZERO-MARGIN PURE BLACK PDF / PRINT REDESIGN (EXACTLY 1 PAGE) ── */
  @page {
    size: A4 portrait;
    margin: 0mm;
  }

  @media print {
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      box-sizing: border-box !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm !important;
      height: 297mm !important;
      max-height: 297mm !important;
      background: #000000 !important;
      background-color: #000000 !important;
      color: #0b140e !important;
      overflow: hidden !important;
    }

    .rcpt-root {
      background: #000000 !important;
      background-color: #000000 !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm !important;
      height: 297mm !important;
      max-height: 297mm !important;
      overflow: hidden !important;
      cursor: default !important;
      page-break-after: avoid !important;
      page-break-before: avoid !important;
      break-after: avoid !important;
      break-inside: avoid !important;
    }

    /* Hide entire web interactive flow in print */
    .rcpt-screen-view {
      display: none !important;
    }

    /* Bespoke 1-Page Archival PDF Document */
    .rcpt-pdf-document {
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 210mm !important;
      height: 297mm !important;
      max-height: 297mm !important;
      margin: 0 !important;
      padding: 9mm 12mm 7mm !important;
      background: #000000 !important;
      background-color: #000000 !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      page-break-after: avoid !important;
      page-break-before: avoid !important;
      page-break-inside: avoid !important;
      break-after: avoid !important;
      break-inside: avoid !important;
    }

    .rcpt-pdf-frame {
      width: 100% !important;
      height: 100% !important;
      max-height: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      align-items: center !important;
      border: 1px solid rgba(82, 227, 137, 0.45) !important;
      outline: 1px solid rgba(218, 234, 212, 0.16) !important;
      outline-offset: -4px !important;
      padding: 7mm 7mm 5mm !important;
      box-sizing: border-box !important;
      position: relative !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    /* Central Authentic Parchment Certificate Card */
    .rcpt-pdf-card {
      width: 100% !important;
      max-width: 170mm !important;
      background: #daead4 !important;
      background-image: 
        radial-gradient(ellipse at 50% 12%, rgba(255, 255, 255, 0.45) 0%, rgba(218, 234, 212, 0.25) 55%, rgba(193, 214, 185, 0.45) 100%),
        linear-gradient(180deg, #daead4 0%, #d4e5ce 45%, #c5dec0 100%) !important;
      border: 1.8px solid #0f1c13 !important;
      outline: 1px solid rgba(15, 28, 19, 0.35) !important;
      outline-offset: -5px !important;
      padding: 16px 22px 14px !important;
      box-sizing: border-box !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    /* Scriptorium Header & Insignia */
    .rcpt-pdf-head {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
      gap: 2px !important;
    }

    .rcpt-pdf-emblem-wrap {
      width: 44px !important;
      height: 44px !important;
      margin-bottom: 2px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .rcpt-pdf-emblem-svg {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
    }

    .rcpt-pdf-pretitle {
      font-family: 'Cinzel', serif !important;
      font-size: 8.5px !important;
      letter-spacing: 0.28em !important;
      color: #1a2a1f !important;
      font-weight: 700 !important;
    }

    .rcpt-pdf-title {
      font-family: 'Cinzel', serif !important;
      font-size: 20px !important;
      font-weight: 900 !important;
      letter-spacing: 0.12em !important;
      color: #0b140e !important;
      margin: 1px 0 !important;
      line-height: 1.15 !important;
    }

    .rcpt-pdf-subtitle {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 7.5px !important;
      letter-spacing: 0.22em !important;
      color: #2b4533 !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
    }

    .rcpt-pdf-divider-ornate {
      width: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      position: relative !important;
      margin: 3px 0 !important;
    }

    .rcpt-pdf-divider-ornate::before,
    .rcpt-pdf-divider-ornate::after {
      content: '' !important;
      flex: 1 !important;
      height: 1px !important;
      background: rgba(15, 28, 19, 0.4) !important;
    }

    .rcpt-pdf-ornate-diamond {
      padding: 0 8px !important;
      font-size: 8px !important;
      color: #1e452c !important;
    }

    /* Minimalist Metadata Grid */
    .rcpt-pdf-meta-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 7px 16px !important;
      padding: 7px 12px !important;
      background: rgba(15, 28, 19, 0.04) !important;
      border: 1px solid rgba(15, 28, 19, 0.18) !important;
      border-radius: 2px !important;
    }

    .rcpt-pdf-meta-cell {
      display: flex !important;
      flex-direction: column !important;
      gap: 2px !important;
    }

    .rcpt-pdf-meta-label {
      font-family: 'Cinzel', serif !important;
      font-size: 7.5px !important;
      letter-spacing: 0.18em !important;
      color: #2e4a36 !important;
      font-weight: 700 !important;
    }

    .rcpt-pdf-meta-val {
      font-family: 'Plus Jakarta Sans', sans-serif !important;
      font-size: 11px !important;
      font-weight: 800 !important;
      color: #0b140e !important;
    }

    .rcpt-pdf-meta-val.mono {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 9.5px !important;
      letter-spacing: 0.04em !important;
    }

    .rcpt-pdf-meta-val.status-badge {
      display: inline-block !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 8.5px !important;
      font-weight: 700 !important;
      letter-spacing: 0.1em !important;
      color: #0b140e !important;
      background: rgba(82, 227, 137, 0.35) !important;
      border: 1px solid rgba(15, 28, 19, 0.35) !important;
      padding: 2px 6px !important;
      border-radius: 2px !important;
      align-self: flex-start !important;
    }

    .rcpt-pdf-divider-dashed {
      border-top: 1px dashed rgba(15, 28, 19, 0.35) !important;
      margin: 1px 0 !important;
    }

    /* Minimalist Order Manifest Table */
    .rcpt-pdf-manifest {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
    }

    .rcpt-pdf-table-head {
      display: flex !important;
      justify-content: space-between !important;
      padding-bottom: 3px !important;
      border-bottom: 1px solid rgba(15, 28, 19, 0.3) !important;
    }

    .rcpt-pdf-th {
      font-family: 'Cinzel', serif !important;
      font-size: 7.5px !important;
      letter-spacing: 0.16em !important;
      color: #2b4533 !important;
      font-weight: 800 !important;
    }

    .rcpt-pdf-th.desc { flex: 1 !important; text-align: left !important; }
    .rcpt-pdf-th.qty { width: 44px !important; text-align: center !important; }
    .rcpt-pdf-th.price { width: 68px !important; text-align: right !important; }

    .rcpt-pdf-table-body {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
    }

    .rcpt-pdf-table-row {
      display: flex !important;
      justify-content: space-between !important;
      align-items: baseline !important;
      padding: 2px 0 !important;
      border-bottom: 1px dotted rgba(15, 28, 19, 0.18) !important;
    }

    .rcpt-pdf-td.desc { flex: 1 !important; text-align: left !important; }
    .rcpt-pdf-td.qty {
      width: 44px !important;
      text-align: center !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 9.5px !important;
      font-weight: 600 !important;
      color: #1a2a1f !important;
    }
    .rcpt-pdf-td.price {
      width: 68px !important;
      text-align: right !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 11.5px !important;
      font-weight: 800 !important;
      color: #0b140e !important;
    }

    .rcpt-pdf-item-name {
      font-family: 'Plus Jakarta Sans', sans-serif !important;
      font-size: 10.5px !important;
      font-weight: 800 !important;
      color: #0b140e !important;
    }

    .rcpt-pdf-item-specs {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 7.5px !important;
      color: #3b5742 !important;
      margin-top: 1px !important;
    }

    /* Total Offering Paid Box */
    .rcpt-pdf-total-box {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 7px 12px !important;
      background: rgba(15, 28, 19, 0.08) !important;
      border: 1.5px solid #0f1c13 !important;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3) !important;
    }

    .rcpt-pdf-total-left {
      display: flex !important;
      flex-direction: column !important;
      gap: 1px !important;
    }

    .rcpt-pdf-total-label {
      font-family: 'Cinzel', serif !important;
      font-size: 9px !important;
      font-weight: 900 !important;
      letter-spacing: 0.18em !important;
      color: #0b140e !important;
    }

    .rcpt-pdf-total-sub {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 6.5px !important;
      letter-spacing: 0.14em !important;
      color: #315139 !important;
    }

    .rcpt-pdf-total-amount {
      font-family: 'Cinzel', serif !important;
      font-size: 19px !important;
      font-weight: 900 !important;
      letter-spacing: 0.06em !important;
      color: #0b140e !important;
    }

    /* Scannable Code 128 Barcode Section */
    .rcpt-pdf-barcode-section {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 4px !important;
      padding-top: 5px !important;
      border-top: 1px dashed rgba(15, 28, 19, 0.35) !important;
    }

    .rcpt-pdf-barcode-svg {
      width: 72% !important;
      max-width: 250px !important;
      height: 32px !important;
      display: block !important;
      shape-rendering: crispEdges !important;
    }

    .rcpt-pdf-barcode-text {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 8px !important;
      font-weight: 700 !important;
      letter-spacing: 0.28em !important;
      color: #122116 !important;
    }

    .rcpt-pdf-card-stamp {
      font-family: 'Cinzel', serif !important;
      font-size: 6.5px !important;
      letter-spacing: 0.22em !important;
      color: #3b5742 !important;
      text-align: center !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
    }

    /* True Bottom Page Footer (Strictly at the footer of Page 1) */
    .rcpt-pdf-page-footer {
      width: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 5px !important;
      margin-top: auto !important;
      padding-top: 6px !important;
    }

    .rcpt-pdf-footer-rule {
      width: 100% !important;
      height: 1px !important;
      background: linear-gradient(90deg, transparent, rgba(82, 227, 137, 0.45) 20%, rgba(82, 227, 137, 0.45) 80%, transparent) !important;
    }

    .rcpt-pdf-footer-row {
      width: 100% !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      font-family: 'Cinzel', serif !important;
      font-size: 7px !important;
      letter-spacing: 0.2em !important;
      color: rgba(218, 234, 212, 0.7) !important;
      text-transform: uppercase !important;
    }
  }
`;

function getWandScreenPos(width, height) {
  const imgAspect = 1672 / 941;
  const screenAspect = width / height;
  let renderW, renderH, offsetX, offsetY;

  if (screenAspect > imgAspect) {
    renderW = width;
    renderH = width / imgAspect;
    offsetX = 0;
    offsetY = (height - renderH) / 2;
  } else {
    renderH = height;
    renderW = height * imgAspect;
    offsetX = (width - renderW) / 2;
    offsetY = 0;
  }

  const originX = offsetX + (910 / 1672) * renderW;
  const originY = offsetY + (331 / 941) * renderH;
  const scale = renderW / 1672;
  return { originX, originY, renderW, renderH, offsetX, offsetY, scale };
}

function projectPt(x, y, renderW, renderH, offsetX, offsetY) {
  return {
    x: offsetX + (x / 1672) * renderW,
    y: offsetY + (y / 941) * renderH
  };
}

// Draws a stroke path from vertex 0 up to currentDistance from wand tip
function drawStrokeLine(ctx, stroke, currentDist, renderW, renderH, offsetX, offsetY) {
  if (currentDist < stroke.minD) return null;

  const pts = stroke.pts;
  if (!pts || pts.length < 2) return null;

  let fraction = 1.0;
  if (currentDist < stroke.maxD && stroke.maxD > stroke.minD) {
    fraction = Math.max(0, Math.min(1.0, (currentDist - stroke.minD) / (stroke.maxD - stroke.minD)));
  }

  const numSegments = pts.length - 1;
  const targetSegment = fraction * numSegments;
  const fullSegments = Math.floor(targetSegment);
  const segFraction = targetSegment - fullSegments;

  ctx.beginPath();
  const p0 = projectPt(pts[0][0], pts[0][1], renderW, renderH, offsetX, offsetY);
  ctx.moveTo(p0.x, p0.y);

  let lastX = p0.x;
  let lastY = p0.y;

  for (let i = 1; i <= fullSegments; i++) {
    const pt = projectPt(pts[i][0], pts[i][1], renderW, renderH, offsetX, offsetY);
    ctx.lineTo(pt.x, pt.y);
    lastX = pt.x;
    lastY = pt.y;
  }

  if (segFraction > 0 && fullSegments < numSegments) {
    const pPrev = projectPt(pts[fullSegments][0], pts[fullSegments][1], renderW, renderH, offsetX, offsetY);
    const pNext = projectPt(pts[fullSegments + 1][0], pts[fullSegments + 1][1], renderW, renderH, offsetX, offsetY);
    lastX = pPrev.x + (pNext.x - pPrev.x) * segFraction;
    lastY = pPrev.y + (pNext.y - pPrev.y) * segFraction;
    ctx.lineTo(lastX, lastY);
  }

  return { tipX: lastX, tipY: lastY, fraction, isComplete: fraction >= 1.0 };
}

// ── ISO/IEC 15417 Code 128B Specification (Genuinely Scannable) ──
const CODE128_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
];

function generateCode128Svg(rawText) {
  const text = String(rawText || "ODY-CAMPUS");
  const codes = [104]; // Start Code B
  let checkSum = 104;

  for (let i = 0; i < text.length; i++) {
    const val = text.charCodeAt(i) - 32;
    if (val >= 0 && val <= 95) {
      codes.push(val);
      checkSum += (i + 1) * val;
    }
  }

  codes.push(checkSum % 103);
  codes.push(106); // Stop Code (7 elements)

  const bars = [];
  let x = 10; // 10-module standard quiet zone

  for (let c = 0; c < codes.length; c++) {
    const pattern = CODE128_PATTERNS[codes[c]];
    if (!pattern) continue;
    for (let p = 0; p < pattern.length; p++) {
      const w = parseInt(pattern[p], 10);
      const isBar = p % 2 === 0;
      if (isBar) {
        bars.push({ x, w });
      }
      x += w;
    }
  }

  x += 10; // Ending quiet zone
  return { bars, totalWidth: x };
}

export default function ReceiptPage() {
  const navigate = useNavigate();

  // 0 = pitch black | 0.5 = tease 1 | 1 = waiting click 2 | 1.5 = tease 2 | 2 = waiting click 3 | 3 = paint spill flowing | 4 = fully revealed
  const [stage, setStage] = useState(0);
  const [copied, setCopied] = useState(false);

  // Load real order data from localStorage with graceful fallback
  const [receiptData] = useState(() => {
    try {
      const stored = localStorage.getItem("odysseyReceipt");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          orderId: parsed.orderId ? (parsed.orderId.startsWith("#") ? parsed.orderId : `#${parsed.orderId}`) : "#ORD-9428-CAMPUS",
          items: parsed.items && parsed.items.length > 0 ? parsed.items : [
            { name: "Odyssey Bond Paper Ream (75 GSM)", quantity: 1, price: 100, specs: "500 Sheets • Crisp White" },
            { name: "Toxic Neon Highlighters (Pack of 3)", quantity: 1, price: 50, specs: "Emerald • Amber • Magenta" }
          ],
          total: parsed.total || 150,
          date: parsed.date || new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          status: "IN PRINT QUEUE",
          pickupCounter: "MAIN LIBRARY BASECAMP • PICKUP DESK 04",
          estimatedTime: "Ready in ~10 mins",
          paymentMethod: "UPI Scanned (odysseycampus@upi)"
        };
      }
    } catch (e) {}
    return {
      orderId: "#ORD-9428-CAMPUS",
      items: [
        { name: "Odyssey Bond Paper Ream (75 GSM)", quantity: 1, price: 100, specs: "500 Sheets • Crisp White" },
        { name: "Toxic Neon Highlighters (Pack of 3)", quantity: 1, price: 50, specs: "Emerald • Amber • Magenta" }
      ],
      total: 150,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "IN PRINT QUEUE",
      pickupCounter: "MAIN LIBRARY BASECAMP • PICKUP DESK 04",
      estimatedTime: "Ready in ~10 mins",
      paymentMethod: "UPI Scanned (odysseycampus@upi)"
    };
  });

  // Awwwards cursor follower
  const cursorRef = useRef(null);
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Canvas ref for both Click 1 tease and Click 2 paint spill
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const bgImgRef = useRef(null);

  useEffect(() => {
    fetch("/wizard-ink-strokes.json")
      .then((res) => res.json())
      .then((data) => {
        strokesRef.current = data;
      })
      .catch((err) => console.error("Error loading ink strokes:", err));
  }, []);

  useEffect(() => {
    let animId;
    const onMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const updateCursor = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.16;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.16;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener("mousemove", onMouseMove);
    animId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ✦ CANVAS LIFECYCLE FOR CLICK 1 TEASE & CLICK 2 SPILL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (stage < 3) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (stage === 0 || stage === 1 || stage === 2) {
      // Solid black sheet & background stays 100% crystal-clear underneath (zero blur)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (bgImgRef.current) {
        bgImgRef.current.style.filter = "none";
      }
      return () => window.removeEventListener("resize", resizeCanvas);
    }

    if (stage === 0.5 || stage === 1.5) {
      // ✦ CLICK 1 & CLICK 2: 100% Crystal-Clear Sharp Tease Reveal!
      if (bgImgRef.current) {
        bgImgRef.current.style.filter = "none";
      }
      const { originX, originY, scale } = getWandScreenPos(canvas.width, canvas.height);
      const isSecondClick = stage === 1.5;
      const targetReach = (isSecondClick ? 150 : 92) * scale;
      const startTime = performance.now();
      const durationMs = isSecondClick ? 1000 : 880;

      const animateTease = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / durationMs);

        // Wave expands out (0-40%), breathes softly (40-62%), then dissolves back to black (62-100%)
        let drawProg, waveAlpha;
        if (progress < 0.40) {
          drawProg = progress / 0.40;
          drawProg = 1 - Math.pow(1 - drawProg, 2.0);
          waveAlpha = 1.0;
        } else if (progress < 0.62) {
          drawProg = 1.0;
          waveAlpha = 1.0 - 0.05 * Math.sin(((progress - 0.40) / 0.22) * Math.PI);
        } else {
          drawProg = 1.0;
          waveAlpha = Math.max(0, (1.0 - progress) / 0.38);
        }

        const currentR = targetReach * drawProg;

        ctx.save();
        // 1. Black sheet
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (waveAlpha > 0 && currentR > 4) {
          ctx.globalCompositeOperation = "destination-out";

          // Crisp, crystal-clear reveal with zero dark vignette border
          const waveGrad = ctx.createRadialGradient(
            originX, originY, 0,
            originX, originY, currentR
          );
          waveGrad.addColorStop(0, `rgba(0, 0, 0, ${waveAlpha})`);
          waveGrad.addColorStop(0.97, `rgba(0, 0, 0, ${waveAlpha})`);
          waveGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = waveGrad;
          ctx.beginPath();
          ctx.arc(originX, originY, currentR, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (progress < 1.0) {
          animationId = requestAnimationFrame(animateTease);
        } else {
          setStage(stage === 0.5 ? 1 : 2);
        }
      };

      animationId = requestAnimationFrame(animateTease);
      return () => {
        window.removeEventListener("resize", resizeCanvas);
        if (animationId) cancelAnimationFrame(animationId);
      };
    }

    if (stage === 3) {
      // ✦ CLICK 3: The whole background unblurs in real-time as the wave reveals the page!
      const { originX, originY, scale } = getWandScreenPos(canvas.width, canvas.height);
      const maxCanvasDist = Math.hypot(
        Math.max(originX, canvas.width - originX),
        Math.max(originY, canvas.height - originY)
      );

      const durationMs = 2600; // Crisp cinematic pacing
      const startTime = performance.now();

      const animateFormation = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / durationMs);

        // Dynamically unblur the background image from 24px down to 0px!
        if (bgImgRef.current) {
          const blurVal = Math.max(0, (1 - progress) * 24);
          bgImgRef.current.style.filter = blurVal > 0.2 ? `blur(${blurVal.toFixed(1)}px)` : "none";
        }

        let ease;
        if (progress <= 0.45) {
          const u = progress / 0.45;
          ease = 0.38 * Math.pow(u, 1.4);
        } else {
          const v = (progress - 0.45) / 0.55;
          ease = 0.38 + 0.62 * (1.0 - Math.pow(1.0 - v, 2.0));
        }

        const waveR = maxCanvasDist * ease;

        ctx.save();
        // 1. Redraw black sheet
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Carve out to reveal pure, crystal-clear artwork with smooth outward leading edge
        ctx.globalCompositeOperation = "destination-out";

        if (waveR > 4) {
          const featherW = Math.min(80 * scale, waveR * 0.35);
          const waveGrad = ctx.createRadialGradient(
            originX, originY, Math.max(0, waveR - featherW),
            originX, originY, waveR
          );
          waveGrad.addColorStop(0, "#000000"); // 100% revealed artwork
          waveGrad.addColorStop(0.40, "rgba(0, 0, 0, 0.85)");
          waveGrad.addColorStop(0.70, "rgba(0, 0, 0, 0.40)");
          waveGrad.addColorStop(0.90, "rgba(0, 0, 0, 0.10)");
          waveGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = waveGrad;
          ctx.beginPath();
          ctx.arc(originX, originY, waveR, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        if (progress < 1.0) {
          animationId = requestAnimationFrame(animateFormation);
        } else {
          // Painting completely revealed — 100% crisp, zero blur!
          if (bgImgRef.current) bgImgRef.current.style.filter = "none";
          setStage(4);
        }
      };

      animationId = requestAnimationFrame(animateFormation);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [stage]);

  const handleScreenClick = (e) => {
    if (e.target.closest(".rcpt-nav-back")) return;

    if (stage === 0) {
      // ✦ FIRST CLICK: Trigger the tease reveal of the circled artwork zone
      setStage(0.5);
    } else if (stage === 1) {
      // ✦ SECOND CLICK: Same tease reveal of the circled artwork zone
      setStage(1.5);
    } else if (stage === 2) {
      // ✦ THIRD CLICK: Organic liquid paint spills across the sheet to reveal the entire page
      setStage(3);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`rcpt-root ${stage >= 3 ? "revealed" : ""}`} onClick={handleScreenClick}>
        
        {/* ── INTERACTIVE WEB FLOW (Hidden during print) ── */}
        <div className="rcpt-screen-view">
          {/* HERO FOLD (100vh) */}
          <div className="rcpt-hero-fold">
            {/* 100% PURE VECTOR BACKDROP (Unblurs dynamically on reveal) */}
            <div className="rcpt-bg-layer" aria-hidden="true">
              <img
                ref={bgImgRef}
                src="/wizard-enchanted-greenlight.svg"
                alt="Enchanted Greenlight Vector Canvas"
                className="rcpt-bg-vector"
              />
            </div>

            {/* Dynamic Organic Paint Spill Canvas */}
            {stage < 4 && <canvas ref={canvasRef} className="rcpt-paint-canvas" aria-hidden="true" />}

            {/* Awwwards Cursor Follower Pill (Shown before third click) */}
            {stage < 3 && (
              <div ref={cursorRef} className="awwwards-cursor-pill">
                {stage === 0 || stage === 0.5 ? "CLICK TO ENTER" : "CLICK AGAIN"}
              </div>
            )}

            {/* Minimal Nav to Return */}
            <button
              onClick={() => navigate("/student")}
              className="rcpt-nav-back"
            >
              ← BACK TO HOME
            </button>
          </div>

          {/* BELOW-THE-FOLD BESPOKE GOTHIC CAMPUS RECEIPT WITH RAVEN PERCH HEADER */}
          {stage >= 3 && (
            <section className="rcpt-record-section">
              <div className="rcpt-ticket-assembly" onClick={(e) => e.stopPropagation()}>
                
                {/* SVG Raven Scroll Rod Top Header */}
                <div className="rcpt-raven-top-wrap" aria-hidden="true">
                  <img
                    src="/raven-receipt-top.svg?v=4"
                    alt="Hooded Crow Perched on Scroll Header"
                    className="rcpt-raven-top-svg"
                  />
                </div>

                {/* Dynamic Gothic Receipt Card Body */}
                <div className="rcpt-ticket-card">
                  
                  {/* Receipt Header */}
                  <div className="rcpt-tkt-head">
                    <span className="rcpt-tkt-pretitle">— THE RAVEN ARCHIVES • EST. 2026 —</span>
                    <h2 className="rcpt-tkt-title">SUPPLY ORDER RECEIPT</h2>
                    <div className="rcpt-tkt-divider-double" />
                  </div>

                  {/* Order Metadata */}
                  <div className="rcpt-tkt-meta-group">
                    <div className="rcpt-tkt-row">
                      <span className="rcpt-tkt-label">Order Reference</span>
                      <span className="rcpt-tkt-val">
                        <span>{receiptData.orderId}</span>
                        <button
                          className={`rcpt-tkt-copy-btn ${copied ? "copied" : ""}`}
                          title="Copy Order ID"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(receiptData.orderId);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1600);
                          }}
                        >
                          {copied ? "COPIED" : "COPY"}
                        </button>
                      </span>
                    </div>

                    <div className="rcpt-tkt-row">
                      <span className="rcpt-tkt-label">Order Status</span>
                      <span className="rcpt-tkt-status-pill">{receiptData.status}</span>
                    </div>

                    <div className="rcpt-tkt-row">
                      <span className="rcpt-tkt-label">Pickup Counter</span>
                      <span className="rcpt-tkt-val">{receiptData.pickupCounter}</span>
                    </div>

                    <div className="rcpt-tkt-row">
                      <span className="rcpt-tkt-label">Recorded At</span>
                      <span className="rcpt-tkt-val">{receiptData.date}</span>
                    </div>
                  </div>

                  <div className="rcpt-tkt-divider-dashed" />

                  {/* Order Manifest */}
                  <div className="rcpt-tkt-manifest-wrap">
                    <div className="rcpt-tkt-manifest-header">
                      <span className="rcpt-tkt-label">
                        Order Manifest ({receiptData.items.length} Items)
                      </span>
                    </div>

                    <div className="rcpt-tkt-manifest-box">
                      {receiptData.items.map((item, idx) => (
                        <div key={idx} className="rcpt-tkt-item-row">
                          <div>
                            <div className="rcpt-tkt-item-title">{item.name || item.title}</div>
                            <div className="rcpt-tkt-item-qty">
                              Qty: {item.quantity || item.qty || 1} {item.specs ? `• ${item.specs}` : ""}
                            </div>
                          </div>
                          <div className="rcpt-tkt-item-price">
                            ₹{((item.price || 0) * (item.quantity || item.qty || 1)).toFixed(0)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Offering Paid */}
                  <div className="rcpt-tkt-total-row">
                    <span className="rcpt-tkt-label" style={{ fontSize: "12px", padding: "4px 12px" }}>
                      Total Offering Paid
                    </span>
                    <span className="rcpt-tkt-total-badge">
                      ₹{receiptData.total}
                    </span>
                  </div>

                  {/* Genuinely Scannable ISO/IEC Code 128 SVG Barcode */}
                  {(() => {
                    const codeString = `ODY-${receiptData.orderId?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toUpperCase()}`;
                    const { bars, totalWidth } = generateCode128Svg(codeString);
                    return (
                      <div className="rcpt-tkt-barcode-wrap" title={`Scannable Order Barcode: ${codeString}`}>
                        <svg
                          viewBox={`0 0 ${totalWidth} 44`}
                          preserveAspectRatio="none"
                          className="rcpt-tkt-barcode-svg"
                          aria-label={`Code 128 Barcode for ${codeString}`}
                        >
                          {bars.map((bar, idx) => (
                            <rect
                              key={idx}
                              x={bar.x}
                              y="0"
                              width={bar.w}
                              height="44"
                              fill="#0b160e"
                            />
                          ))}
                        </svg>
                        <span className="rcpt-tkt-barcode-code">
                          * {codeString} *
                        </span>
                      </div>
                    );
                  })()}

                  {/* Actions */}
                  <div className="rcpt-tkt-btn-row">
                    <button
                      className="rcpt-tkt-btn primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.print();
                      }}
                    >
                      PRINT RECEIPT
                    </button>
                    <button
                      className="rcpt-tkt-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/student");
                      }}
                    >
                      RETURN TO BASECAMP
                    </button>
                  </div>

                </div>
              </div>
            </section>
          )}
        </div>

        {/* ── BESPOKE 1-PAGE ARCHIVAL PDF / PRINT DOCUMENT ── */}
        <div className="rcpt-pdf-document" aria-hidden="true">
          <div className="rcpt-pdf-frame">
            
            {/* Central Parchment Certificate Card */}
            <div className="rcpt-pdf-card">
              
              {/* Scriptorium Crest & Headers */}
              <div className="rcpt-pdf-head">
                <div className="rcpt-pdf-emblem-wrap">
                  <svg className="rcpt-pdf-emblem-svg" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="37" stroke="#0e1a12" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="40" cy="40" r="33" stroke="#0e1a12" strokeWidth="0.8" />
                    <circle cx="40" cy="40" r="30" stroke="rgba(35, 133, 75, 0.4)" strokeWidth="0.5" />
                    <path d="M40 18 C35 24 33 30 33 36 C33 39 34 41 36 43 C30 43 25 46 23 51 C29 50 34 50 38 52 C37 55 35 59 33 63 C37 60 41 57 44 57 C42 61 41 64 40 68 C46 62 51 56 54 49 C56 49 58 49 60 48 C58 47 57 46 55 45 C57 41 57 34 52 27 C48 22 44 19 40 18 Z" fill="#0e1a12" />
                    <circle cx="43" cy="28" r="1.8" fill="#52e389" />
                    <path d="M40 5 L41.2 9 L45 10 L41.2 11 L40 15 L38.8 11 L35 10 L38.8 9 Z" fill="#23854b" />
                  </svg>
                </div>
                <span className="rcpt-pdf-pretitle">— THE RAVEN ARCHIVES • EST. 2026 —</span>
                <h1 className="rcpt-pdf-title">SUPPLY ORDER RECEIPT</h1>
                <span className="rcpt-pdf-subtitle">AUTHENTICATED CAMPUS SCRIPTORIUM DISPATCH RECORD</span>
                <div className="rcpt-pdf-divider-ornate">
                  <span className="rcpt-pdf-ornate-diamond">❖</span>
                </div>
              </div>

              {/* Minimalist 4-Quadrant Metadata Grid */}
              <div className="rcpt-pdf-meta-grid">
                <div className="rcpt-pdf-meta-cell">
                  <span className="rcpt-pdf-meta-label">ORDER REFERENCE</span>
                  <span className="rcpt-pdf-meta-val mono">{receiptData.orderId}</span>
                </div>
                <div className="rcpt-pdf-meta-cell">
                  <span className="rcpt-pdf-meta-label">DISPATCH STATUS</span>
                  <span className="rcpt-pdf-meta-val status-badge">{receiptData.status}</span>
                </div>
                <div className="rcpt-pdf-meta-cell">
                  <span className="rcpt-pdf-meta-label">COLLECTION POINT</span>
                  <span className="rcpt-pdf-meta-val">{receiptData.pickupCounter}</span>
                </div>
                <div className="rcpt-pdf-meta-cell">
                  <span className="rcpt-pdf-meta-label">RECORDED AT</span>
                  <span className="rcpt-pdf-meta-val">{receiptData.date}</span>
                </div>
              </div>

              <div className="rcpt-pdf-divider-dashed" />

              {/* Order Manifest Table */}
              <div className="rcpt-pdf-manifest">
                <div className="rcpt-pdf-table-head">
                  <span className="rcpt-pdf-th desc">ITEM DESCRIPTION</span>
                  <span className="rcpt-pdf-th qty">QTY</span>
                  <span className="rcpt-pdf-th price">AMOUNT</span>
                </div>

                <div className="rcpt-pdf-table-body">
                  {(receiptData.items || []).map((item, idx) => (
                    <div key={idx} className="rcpt-pdf-table-row">
                      <div className="rcpt-pdf-td desc">
                        <div className="rcpt-pdf-item-name">{item.name || item.title}</div>
                        {item.specs && <div className="rcpt-pdf-item-specs">{item.specs}</div>}
                      </div>
                      <div className="rcpt-pdf-td qty">
                        ×{item.quantity || item.qty || 1}
                      </div>
                      <div className="rcpt-pdf-td price">
                        ₹{((item.price || 0) * (item.quantity || item.qty || 1)).toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Offering Paid Box */}
              <div className="rcpt-pdf-total-box">
                <div className="rcpt-pdf-total-left">
                  <span className="rcpt-pdf-total-label">TOTAL OFFERING PAID</span>
                  <span className="rcpt-pdf-total-sub">OFFICIALLY TENDERED & SETTLED</span>
                </div>
                <span className="rcpt-pdf-total-amount">₹{receiptData.total}</span>
              </div>

              {/* Scannable Code 128 Barcode Section */}
              {(() => {
                const codeString = `ODY-${receiptData.orderId?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toUpperCase()}`;
                const { bars, totalWidth } = generateCode128Svg(codeString);
                return (
                  <div className="rcpt-pdf-barcode-section">
                    <svg
                      viewBox={`0 0 ${totalWidth} 32`}
                      preserveAspectRatio="none"
                      className="rcpt-pdf-barcode-svg"
                      aria-label={`Code 128 Barcode for ${codeString}`}
                    >
                      {bars.map((bar, idx) => (
                        <rect
                          key={idx}
                          x={bar.x}
                          y="0"
                          width={bar.w}
                          height="32"
                          fill="#0b160e"
                        />
                      ))}
                    </svg>
                    <span className="rcpt-pdf-barcode-text">* {codeString} *</span>
                  </div>
                );
              })()}

              <div className="rcpt-pdf-card-stamp">
                ODYSSEY SCRIPTORIUM • ARCHIVAL DISPATCH VERIFICATION SEAL
              </div>

            </div>

            {/* True Bottom Page Footer (Strictly at the footer of Page 1) */}
            <div className="rcpt-pdf-page-footer">
              <div className="rcpt-pdf-footer-rule" />
              <div className="rcpt-pdf-footer-row">
                <span>ODYSSEY CAMPUS PRINT ARCHIVES</span>
                <span>FOLIO 1 OF 1</span>
                <span>RECORD REF: {receiptData.orderId}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
