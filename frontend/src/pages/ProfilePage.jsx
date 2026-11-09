import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { downloadOrPrintReceipt, generateCode128Svg } from "../utils/printReceipt";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&family=Cinzel:wght@600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap');

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
    --parchment-dark: #EDECE2;
    --border-dark: #0D0D0D;
    --shadow-comic: 4px 4px 0px #0D0D0D;
    --shadow-comic-sm: 2.5px 2.5px 0px #0D0D0D;
    --shadow-comic-lg: 6px 6px 0px #0D0D0D;
  }

  body {
    background-color: var(--void-black);
  }

  .pf-page-root {
    min-height: 100vh;
    background-color: var(--void-black);
    color: var(--void-black);
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding-bottom: 90px;
    letter-spacing: 0.2px;
    position: relative;
  }

  /* ── TOP HEADER / NAVBAR ── */
  .pf-header-wrapper {
    background-color: var(--slime-green);
    border-bottom: 4px solid var(--border-dark);
    padding: 22px 0 30px;
    position: relative;
    box-shadow: 0 4px 0px rgba(0, 0, 0, 0.2);
  }

  .pf-navbar {
    max-width: 1540px;
    width: 95%;
    margin: 0 auto 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .pf-nav-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .pf-back-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 42px;
    padding: 0 16px;
    background: var(--parchment);
    color: var(--void-black);
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    text-transform: uppercase;
    text-decoration: none;
    border: 3px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: var(--shadow-comic-sm);
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .pf-back-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  .pf-nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .pf-nav-logo {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 22px;
    color: var(--void-black);
    letter-spacing: 1.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pf-nav-badge {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    background: var(--hazard-gold);
    color: var(--void-black);
    font-size: 11px;
    letter-spacing: 0.8px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 2px solid var(--border-dark);
    box-shadow: 2px 2px 0px var(--border-dark);
  }

  .pf-nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .pf-nav-btn {
    height: 42px;
    padding: 0 18px;
    border-radius: 8px;
    border: 3px solid var(--border-dark);
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    text-transform: uppercase;
    box-shadow: var(--shadow-comic-sm);
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .pf-nav-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  .pf-nav-cart {
    background: var(--brain-pink);
    color: var(--void-black);
  }

  .pf-nav-logout {
    background: var(--hazard-gold);
    color: var(--void-black);
  }

  /* ── HERO BANNER TITLE ── */
  .pf-banner-content {
    max-width: 1540px;
    width: 95%;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .pf-banner-titles {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pf-page-heading {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(28px, 4.2vw, 46px);
    text-transform: uppercase;
    color: var(--brain-pink);
    -webkit-text-stroke: 2.5px var(--border-dark);
    paint-order: stroke fill;
    text-shadow: 4px 4px 0px var(--border-dark);
    line-height: 1.1;
    letter-spacing: 1.5px;
  }

  .pf-page-subtext {
    font-size: 14px;
    font-weight: 700;
    color: var(--void-black);
  }

  .pf-banner-counter {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    background: var(--parchment);
    color: var(--void-black);
    font-size: 13px;
    padding: 8px 18px;
    border-radius: 999px;
    border: 3px solid var(--border-dark);
    box-shadow: var(--shadow-comic-sm);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── MAIN CONTENT CONTAINER ── */
  .pf-container {
    max-width: 1540px;
    width: 95%;
    margin: 36px auto 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  /* ── CADET IDENTITY CARD ── */
  .pf-identity-card {
    background: var(--parchment);
    border: 3.5px solid var(--border-dark);
    border-radius: 20px;
    box-shadow: var(--shadow-comic-lg);
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .pf-identity-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    border-bottom: 2.5px dashed rgba(13, 13, 13, 0.2);
    padding-bottom: 22px;
  }

  .pf-identity-profile-summary {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .pf-avatar-box {
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 16px;
    border: 3.5px solid var(--border-dark);
    box-shadow: var(--shadow-comic-sm);
    background: var(--hazard-gold);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .pf-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .pf-avatar-fallback {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 34px;
    color: var(--void-black);
    text-transform: uppercase;
  }

  .pf-avatar-online-dot {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--slime-green);
    border: 3px solid var(--border-dark);
  }

  .pf-identity-title-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pf-identity-name {
    font-family: 'Bangers', cursive, sans-serif;
    font-size: 38px;
    font-weight: 400;
    color: var(--void-black);
    text-transform: uppercase;
    letter-spacing: 2px;
    line-height: 1;
    margin: 0;
  }

  .pf-identity-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .pf-chip-badge {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding: 4px 12px;
    border-radius: 999px;
    border: 2px solid var(--border-dark);
    box-shadow: 2px 2px 0px var(--border-dark);
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .pf-chip-lime {
    background: var(--slime-green);
    color: var(--void-black);
  }

  .pf-chip-gold {
    background: var(--hazard-gold);
    color: var(--void-black);
  }

  .pf-chip-pink {
    background: var(--brain-pink);
    color: var(--void-black);
  }

  /* Stat Summary Blocks */
  .pf-identity-stats {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .pf-stat-box {
    background: var(--parchment-dark);
    border: 2.5px solid var(--border-dark);
    border-radius: 12px;
    box-shadow: var(--shadow-comic-sm);
    padding: 12px 20px;
    text-align: center;
    min-width: 110px;
  }

  .pf-stat-num {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 24px;
    color: var(--void-black);
    line-height: 1.1;
  }

  .pf-stat-lbl {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #555;
    margin-top: 4px;
  }

  /* Dossier Narrative Box */
  .pf-identity-lore {
    background: var(--parchment-dark);
    border: 2.5px solid var(--border-dark);
    box-shadow: var(--shadow-comic-sm);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .pf-identity-lore-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #555;
  }

  .pf-identity-lore-header::after {
    content: '';
    flex: 1;
    height: 1.5px;
    background: rgba(13, 13, 13, 0.15);
  }

  .pf-identity-lore-p {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #1a1a1a;
    font-weight: 600;
    margin: 0;
  }

  .pf-identity-lore-notice {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    line-height: 1.55;
    color: #2b3a20;
    border-left: 3.5px solid var(--slime-green);
    padding: 8px 14px;
    background: rgba(157, 232, 105, 0.16);
    border-radius: 0 8px 8px 0;
    margin: 0;
  }

  .pf-identity-lore-notice strong {
    color: #0d0d0d;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 4px;
  }

  @media (max-width: 860px) {
    .pf-identity-card {
      padding: 22px 18px;
    }
    .pf-identity-header-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 18px;
    }
    .pf-identity-stats {
      width: 100%;
      justify-content: space-between;
    }
    .pf-stat-box {
      flex: 1;
      min-width: 85px;
      padding: 10px 12px;
    }
  }

  /* ── SECTION HEADER & TABS ── */
  .pf-orders-section {
    padding-top: 18px;
  }

  .pf-section-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .pf-section-title {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 24px;
    text-transform: uppercase;
    color: var(--parchment);
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pf-filter-tabs {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pf-tab-btn {
    height: 42px;
    padding: 0 18px;
    border-radius: 8px;
    border: 3px solid #000000;
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    background: var(--parchment);
    color: var(--void-black);
    box-shadow: 4px 4px 0px var(--slime-green);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.08s ease, box-shadow 0.08s ease, background 0.12s ease;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .pf-tab-btn:hover {
    background: #FFF;
  }

  .pf-tab-btn:active {
    transform: translate(3px, 3px);
    box-shadow: 1px 1px 0px var(--slime-green);
  }

  .pf-tab-btn.active {
    background: #FFFFFF;
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--slime-green);
  }

  /* ── ORDERS MANIFEST LIST ── */
  .pf-orders-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .pf-order-card {
    background: #FFFFFF; /* Pure white card */
    border: 3.5px solid var(--border-dark);
    border-radius: 16px;
    box-shadow: 5px 5px 0px var(--border-dark);
    overflow: hidden;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .pf-order-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0px var(--border-dark);
  }

  /* Order Card Header - seamless white, no horizontal line */
  .pf-order-card-header {
    background: #FFFFFF;
    border-bottom: none;
    padding: 18px 22px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }

  .pf-order-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .pf-order-id-badge {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    letter-spacing: 0.8px;
    background: var(--void-black);
    color: var(--slime-green);
    padding: 5px 12px;
    border-radius: 6px;
    border: 2px solid var(--border-dark);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .pf-order-date {
    font-size: 12.5px;
    font-weight: 700;
    color: #666677;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  /* Status Badges */
  .pf-status-badge {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 999px;
    border: 2.5px solid var(--border-dark);
    box-shadow: 2px 2px 0px var(--border-dark);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .pf-status-badge.ready {
    background: var(--slime-green);
    color: var(--void-black);
  }

  .pf-status-badge.printing {
    background: var(--seafoam);
    color: var(--void-black);
  }

  .pf-status-badge.pending {
    background: var(--hazard-gold);
    color: var(--void-black);
  }

  .pf-status-badge.other {
    background: #E5E5EB;
    color: var(--void-black);
  }

  .pf-status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--void-black);
  }

  /* Order Items Body - unboxed clean items */
  .pf-order-items-table {
    padding: 6px 22px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pf-item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 6px 0;
    background: transparent;
    border: none;
  }

  .pf-item-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .pf-item-icon-tag {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: var(--slime-green);
    border: 2px solid var(--border-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .pf-item-name {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 14.5px;
    color: var(--void-black);
    line-height: 1.2;
  }

  .pf-item-qty-pill {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    background: var(--hazard-gold);
    color: var(--void-black);
    padding: 3px 8px;
    border-radius: 6px;
    border: 1.5px solid var(--border-dark);
    margin-left: 8px;
    white-space: nowrap;
  }

  .pf-item-pricing {
    text-align: right;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pf-item-total {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    color: var(--void-black);
    white-space: nowrap;
  }

  /* Order Footer - seamless bottom without horizontal divider line */
  .pf-order-card-footer {
    background: #FFFFFF;
    border-top: none;
    padding: 10px 22px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }

  .pf-order-total-block {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .pf-order-total-line {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .pf-total-label {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #666677;
  }

  .pf-total-val {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 22px;
    color: var(--void-black);
  }

  .pf-order-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pf-btn-receipt {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    padding: 9px 18px;
    background: var(--brain-pink);
    color: var(--void-black);
    border: 2.5px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: var(--shadow-comic-sm);
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .pf-btn-receipt:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  .pf-btn-reorder {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    padding: 9px 18px;
    background: var(--slime-green);
    color: var(--void-black);
    border: 2.5px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: var(--shadow-comic-sm);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .pf-btn-reorder:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  /* ── EMPTY ORDERS STATE ── */
  .pf-empty-card {
    background: var(--parchment);
    border: 3.5px solid var(--border-dark);
    border-radius: 18px;
    box-shadow: var(--shadow-comic-lg);
    padding: 56px 32px 46px;
    text-align: center;
    max-width: 580px;
    margin: 20px auto;
  }

  .pf-empty-mascot {
    width: 260px;
    height: auto;
    max-height: 230px;
    object-fit: contain;
    margin-bottom: 16px;
    display: inline-block;
    user-select: none;
    pointer-events: none;
    filter: drop-shadow(4px 4px 0px rgba(13, 13, 13, 0.15));
  }

  .pf-empty-title {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 26px;
    color: var(--void-black);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 10px;
  }

  .pf-empty-desc {
    font-size: 14px;
    font-weight: 600;
    color: #4b4b4b;
    max-width: 440px;
    margin: 0 auto 28px;
    line-height: 1.5;
  }

  .pf-empty-actions {
    display: flex;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .pf-empty-btn {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    text-transform: uppercase;
    padding: 12px 24px;
    border: 3px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: var(--shadow-comic-sm);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .pf-empty-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  .pf-empty-btn-stationery {
    background: var(--brain-pink);
    color: var(--void-black);
  }

  .pf-empty-btn-print {
    background: var(--slime-green);
    color: var(--void-black);
  }

  /* ── TOAST NOTIFICATION ── */
  .pf-toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: var(--slime-green);
    color: var(--void-black);
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    letter-spacing: 0.6px;
    padding: 14px 22px;
    border: 3.5px solid var(--border-dark);
    border-radius: 12px;
    box-shadow: var(--shadow-comic);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
    animation: toastSlideUp 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }

  /* ── RECEIPT MODAL POPUP ── */
  .rcpt-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(13, 13, 13, 0.88);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: rcptFadeIn 0.15s ease-out;
  }

  @keyframes rcptFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .rcpt-modal-dialog {
    max-width: 540px;
    width: 100%;
    max-height: 92vh;
    background: #0D0D0D;
    border: 3.5px solid var(--border-dark);
    border-radius: 16px;
    box-shadow: 8px 8px 0px var(--slime-green);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: rcptScaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes rcptScaleUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .rcpt-modal-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 18px;
    background: #171720;
    border-bottom: 2.5px solid #282836;
  }

  .rcpt-modal-title {
    font-family: 'Titan One', 'Archivo Black', sans-serif;
    font-size: 13.5px;
    letter-spacing: 0.8px;
    color: var(--slime-green);
    text-transform: uppercase;
  }

  .rcpt-modal-close-btn {
    background: #282836;
    color: #FFFFFF;
    border: 2px solid #3A3A4E;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: 800;
    font-size: 15px;
    transition: background 0.15s ease, transform 0.1s ease;
  }

  .rcpt-modal-close-btn:hover {
    background: var(--brain-pink);
    color: var(--void-black);
    border-color: var(--border-dark);
  }

  .rcpt-modal-scroll-area {
    padding: 18px;
    overflow-y: auto;
    background: #0D0D0D;
    display: flex;
    justify-content: center;
  }

  .rcpt-modal-card {
    width: 100%;
    background: #daead4;
    background-image: 
      radial-gradient(ellipse at 50% 12%, rgba(255, 255, 255, 0.45) 0%, rgba(218, 234, 212, 0.25) 55%, rgba(193, 214, 185, 0.45) 100%),
      linear-gradient(180deg, #daead4 0%, #d4e5ce 45%, #c5dec0 100%);
    border: 2px solid #0f1c13;
    outline: 1px solid rgba(15, 28, 19, 0.35);
    outline-offset: -5px;
    padding: 18px 20px 16px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #0b140e;
    box-sizing: border-box;
  }

  .rcpt-modal-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2px;
  }

  .rcpt-modal-emblem-wrap {
    width: 44px;
    height: 44px;
    margin-bottom: 2px;
  }

  .rcpt-modal-pretitle {
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.26em;
    color: #1a2a1f;
    font-weight: 700;
  }

  .rcpt-modal-doc-title {
    font-family: 'Cinzel', serif;
    font-size: 19px;
    font-weight: 900;
    letter-spacing: 0.12em;
    color: #0b140e;
    margin: 2px 0;
  }

  .rcpt-modal-subtitle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7px;
    letter-spacing: 0.2em;
    color: #2b4533;
    font-weight: 600;
    text-transform: uppercase;
  }

  .rcpt-modal-ornate-divider {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 3px 0;
  }

  .rcpt-modal-ornate-divider::before,
  .rcpt-modal-ornate-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(15, 28, 19, 0.4);
  }

  .rcpt-modal-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px 14px;
    padding: 7px 10px;
    background: rgba(15, 28, 19, 0.04);
    border: 1px solid rgba(15, 28, 19, 0.18);
    border-radius: 2px;
  }

  .rcpt-modal-meta-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .rcpt-modal-meta-lbl {
    font-family: 'Cinzel', serif;
    font-size: 7.5px;
    letter-spacing: 0.18em;
    color: #2e4a36;
    font-weight: 700;
  }

  .rcpt-modal-meta-val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10.5px;
    font-weight: 800;
    color: #0b140e;
  }

  .rcpt-modal-meta-val.mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
  }

  .rcpt-modal-meta-val.status-badge {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    font-weight: 700;
    background: rgba(82, 227, 137, 0.35);
    border: 1px solid rgba(15, 28, 19, 0.35);
    padding: 2px 6px;
    border-radius: 2px;
    align-self: flex-start;
  }

  .rcpt-modal-manifest {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .rcpt-modal-th-row {
    display: flex;
    justify-content: space-between;
    padding-bottom: 3px;
    border-bottom: 1px solid rgba(15, 28, 19, 0.3);
    font-family: 'Cinzel', serif;
    font-size: 7.5px;
    letter-spacing: 0.16em;
    color: #2b4533;
    font-weight: 800;
  }

  .rcpt-modal-item-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 2px 0;
    border-bottom: 1px dotted rgba(15, 28, 19, 0.18);
  }

  .rcpt-modal-item-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10.5px;
    font-weight: 800;
    color: #0b140e;
  }

  .rcpt-modal-total-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 12px;
    background: rgba(15, 28, 19, 0.08);
    border: 1.5px solid #0f1c13;
  }

  .rcpt-modal-total-amt {
    font-family: 'Cinzel', serif;
    font-size: 19px;
    font-weight: 900;
    color: #0b140e;
  }

  .rcpt-modal-barcode-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding-top: 5px;
    border-top: 1px dashed rgba(15, 28, 19, 0.35);
  }

  .rcpt-modal-barcode-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5px;
    font-weight: 700;
    letter-spacing: 0.28em;
    color: #122116;
  }

  .rcpt-modal-footer-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    background: #171720;
    border-top: 2.5px solid #282836;
  }

  .rcpt-modal-print-btn {
    font-family: 'Titan One', 'Archivo Black', sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    padding: 10px 18px;
    background: var(--slime-green);
    color: var(--void-black);
    border: 2px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 3px 3px 0px var(--border-dark);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.1s ease;
  }

  .rcpt-modal-print-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }
`;

function getStatusBadgeClass(status) {
  if (!status) return "pending";
  const s = String(status).toUpperCase();
  if (s === "READY" || s === "COMPLETED") return "ready";
  if (s === "PRINTING" || s === "PROCESSING") return "printing";
  if (s === "PENDING" || s === "AWAITING PAYMENT") return "pending";
  return "other";
}

function formatStatusText(status) {
  if (!status) return "PENDING";
  return String(status).toUpperCase();
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [displayName, setDisplayName] = useState("PETER PARKER");
  const [photo, setPhoto] = useState("");
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL"); // "ALL", "ACTIVE", "READY"
  const [toastMsg, setToastMsg] = useState("");
  const [activeReceiptModal, setActiveReceiptModal] = useState(null);

  const cartCount = (cartItems || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // 1. Resolve user profile info
    const storedUser = sessionStorage.getItem("user") || "peter.parker@empire.edu";

    // If storedUser looks like an email or name
    if (storedUser.includes("@")) {
      setDisplayName("PETER PARKER");
    } else if (storedUser) {
      setDisplayName(storedUser);
    }

    // 2. Load stored orders from localStorage
    const localOrders = JSON.parse(localStorage.getItem("odysseyOrders")) || [];

    // 3. Try to sync with server orders
    const fetchServerOrders = async () => {
      try {
        const studentId = sessionStorage.getItem("user");
        if (studentId) {
          const profileRes = await axios.get(
            `http://localhost:5000/api/profile/${studentId}`
          );
          if (profileRes.data?.profilePhoto) {
            setPhoto("http://localhost:5000" + profileRes.data.profilePhoto);
          }
          if (profileRes.data?.name) {
            setDisplayName(profileRes.data.name);
          }
        }

        const ordersRes = await axios.get("http://localhost:5000/api/orders");
        if (Array.isArray(ordersRes.data)) {
          // Normalize server orders
          const normalizedServerOrders = ordersRes.data.map((o) => ({
            orderId: o.orderNumber || o._id,
            mongoId: o._id,
            date: o.createdAt
              ? new Date(o.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Recent",
            items:
              (o.stationeryItems && o.stationeryItems.length > 0)
                ? o.stationeryItems.map((si) => ({
                    name: si.name,
                    quantity: si.quantity || 1,
                    price: 25, // default fallback price if not in DB
                  }))
                : (o.documents && o.documents.length > 0)
                ? o.documents.map((doc) => ({
                    name: `Print: ${doc.originalName || "Document"}`,
                    quantity: doc.copies || 1,
                    price: doc.color ? 10 : 3,
                    isDocument: true,
                  }))
                : [],
            total: o.total || (o.stationeryItems?.length ? o.stationeryItems.reduce((acc, it) => acc + (it.quantity || 1) * 25, 0) : 40),
            status: (o.status || "PENDING").toUpperCase(),
          }));

          // Merge server orders with localOrders preventing duplicates
          const merged = [...localOrders];
          normalizedServerOrders.forEach((so) => {
            const exists = merged.some(
              (lo) =>
                lo.orderId === so.orderId ||
                lo.orderId === so.mongoId ||
                lo._id === so.mongoId
            );
            if (!exists) {
              merged.push(so);
            }
          });

          // Sort descending by date if available
          setOrders(merged.reverse());
          return;
        }
      } catch (err) {
        console.warn("Could not fetch remote orders, using local:", err.message);
      }

      setOrders(localOrders.slice().reverse());
    };

    fetchServerOrders();
  }, []);

  // Filter orders according to active tab
  const filteredOrders = orders.filter((order) => {
    const s = String(order.status || "").toUpperCase();
    if (activeTab === "ACTIVE") {
      return s === "PRINTING" || s === "PROCESSING" || s === "PENDING" || s === "AWAITING PAYMENT";
    }
    if (activeTab === "READY") {
      return s === "READY" || s === "COMPLETED";
    }
    return true;
  });

  // Calculate high-level stats
  const totalOrdersCount = orders.length;
  const totalSpent = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  const activeOrdersCount = orders.filter((o) => {
    const s = String(o.status || "").toUpperCase();
    return s === "PRINTING" || s === "PROCESSING" || s === "PENDING" || s === "AWAITING PAYMENT";
  }).length;

  // View Receipt handler - opens receipt modal popup directly on the page
  const handleViewReceipt = (order) => {
    setActiveReceiptModal({
      orderId: order.orderId || order._id || "OD-ONLINE",
      items: order.items || [],
      total: order.total || 0,
      date: order.date || new Date().toLocaleString(),
      status: (order.status || "CONFIRMED").toUpperCase(),
      pickupCounter: "MAIN LIBRARY BASECAMP • PICKUP DESK 04",
    });
  };

  // Re-order items
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) {
      showToast("No items to re-order!");
      return;
    }
    order.items.forEach((item) => {
      addToCart({
        name: item.name,
        price: item.price || 20,
        quantity: item.quantity || 1,
      });
    });
    showToast(`Re-ordered ${order.items.length} items to cart!`);
  };

  return (
    <>
      <style>{css}</style>
      <div className="pf-page-root">
        {/* TOP SLIME HEADER */}
        <header className="pf-header-wrapper">
          <nav className="pf-navbar">
            <div className="pf-nav-left">
              <button
                className="pf-back-btn"
                onClick={() => navigate("/student")}
              >
                ← BACK TO BASECAMP
              </button>
            </div>

            <div className="pf-nav-actions">
              <button
                className="pf-nav-btn pf-nav-cart"
                onClick={() => navigate("/cart")}
              >
                CART ({cartCount})
              </button>

              <button
                className="pf-nav-btn pf-nav-logout"
                onClick={() => {
                  sessionStorage.clear();
                  window.location.replace("/");
                }}
              >
                LOGOUT
              </button>
            </div>
          </nav>

          {/* BANNER CONTENT */}
          <div className="pf-banner-content">
            <div className="pf-banner-titles">
              <h1 className="pf-page-heading">STUDENT PROFILE & ORDER VAULT</h1>
              <p className="pf-page-subtext">
                Your personal vault for all print and stationery orders.
              </p>
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTAINER */}
        <main className="pf-container">
          {/* 1. COMPACT CADET IDENTITY CARD (NO EDIT PHOTO, NO PASSWORD FORM) */}
          <section className="pf-identity-card">
            {/* Top row: Avatar + Name/Badges on left, Stats on right */}
            <div className="pf-identity-header-row">
              <div className="pf-identity-profile-summary">
                <div className="pf-avatar-box">
                  <img
                    src={photo || "/avatar.jpg"}
                    alt="Student Profile"
                    className="pf-avatar-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <span className="pf-avatar-fallback" style={{ display: "none" }}>
                    {displayName.charAt(0)}
                  </span>
                  <div className="pf-avatar-online-dot" title="Operative Online" />
                </div>

                <div className="pf-identity-title-area">
                  <h2 className="pf-identity-name">{displayName}</h2>
                  <div className="pf-identity-badges">
                    <span className="pf-chip-badge pf-chip-lime">
                      UNINFECTED
                    </span>
                    <span className="pf-chip-badge pf-chip-gold">
                      UNCAUGHT
                    </span>
                    <span className="pf-chip-badge pf-chip-pink">
                      UNBROKEN
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stat Blocks aligned on the right */}
              <div className="pf-identity-stats">
                <div className="pf-stat-box">
                  <div className="pf-stat-num">{totalOrdersCount}</div>
                  <div className="pf-stat-lbl">Orders Placed</div>
                </div>

                <div className="pf-stat-box">
                  <div className="pf-stat-num">₹{totalSpent}</div>
                  <div className="pf-stat-lbl">Total Spent</div>
                </div>

                <div className="pf-stat-box">
                  <div className="pf-stat-num" style={{ color: activeOrdersCount > 0 ? "var(--seafoam)" : "inherit" }}>
                    {activeOrdersCount}
                  </div>
                  <div className="pf-stat-lbl">Active Runs</div>
                </div>
              </div>
            </div>

            {/* Bottom: Full-width Narrative & Archive Notice */}
            <div className="pf-identity-lore">
              <div className="pf-identity-lore-header">
                ACADEMIC REGISTRY — STUDENT FILE #084
              </div>
              <p className="pf-identity-lore-p">
                A brilliant, soft-spoken college student who stepped up as our primary supply runner when the undead horde overran campus. Every night, he risks everything navigating quarantined halls to scavenge vital paper, printing ink, and evacuation maps so our lifeline stays alive, ensuring isolated students across safe-zones never lose hope even when the night falls quiet outside the walls.
              </p>
              <p className="pf-identity-lore-notice">
                <strong>Record Notice:</strong> This photo captures him back when campus was peaceful. Following the tragedy that wiped out his circle, no recent photo exists—we only hope he is still holding out there.
              </p>
            </div>
          </section>

          {/* 2. ORDER HISTORY SECTION */}
          <section className="pf-orders-section">
            <div className="pf-section-toolbar">
              <h3 className="pf-section-title">
                <span>DISPATCH LOGS & ORDER HISTORY</span>
              </h3>

              <div className="pf-filter-tabs">
                <button
                  className={`pf-tab-btn ${activeTab === "ALL" ? "active" : ""}`}
                  onClick={() => setActiveTab("ALL")}
                >
                  ALL ORDERS ({orders.length})
                </button>
                <button
                  className={`pf-tab-btn ${activeTab === "ACTIVE" ? "active" : ""}`}
                  onClick={() => setActiveTab("ACTIVE")}
                >
                  ACTIVE / PRINTING ({activeOrdersCount})
                </button>
                <button
                  className={`pf-tab-btn ${activeTab === "READY" ? "active" : ""}`}
                  onClick={() => setActiveTab("READY")}
                >
                  READY FOR PICKUP ({orders.filter((o) => ["READY", "COMPLETED"].includes(String(o.status || "").toUpperCase())).length})
                </button>
              </div>
            </div>

            {/* Orders List or Empty State */}
            <div className="pf-orders-grid" style={{ marginTop: 22 }}>
              {filteredOrders.length === 0 ? (
                <div className="pf-empty-card">
                  <img
                    src="/empty-box-scavenger.png"
                    alt="Empty Vault Scavenger Box"
                    className="pf-empty-mascot"
                    onError={(e) => {
                      e.target.src = "/empty-box-scavenger.jpg";
                    }}
                  />
                  <h4 className="pf-empty-title">
                    {activeTab === "ALL"
                      ? "NO PREVIOUS ORDERS FOUND!"
                      : `NO ${activeTab} ORDERS RECORDED!`}
                  </h4>
                  <p className="pf-empty-desc">
                    {activeTab === "ALL"
                      ? "Your vault is empty. Requisition fresh stationery or dispatch documents to our campus printers."
                      : `You currently have no orders in the ${activeTab.toLowerCase()} queue. Explore our catalog below to dispatch a new job.`}
                  </p>

                  <div className="pf-empty-actions">
                    <button
                      className="pf-empty-btn pf-empty-btn-stationery"
                      onClick={() => navigate("/writing")}
                    >
                      BROWSE STATIONERY
                    </button>
                    <button
                      className="pf-empty-btn pf-empty-btn-print"
                      onClick={() => navigate("/printing")}
                    >
                      START A PRINT RUN
                    </button>
                  </div>
                </div>
              ) : (
                filteredOrders.map((order, idx) => {
                  const badgeClass = getStatusBadgeClass(order.status);
                  const statusLabel = formatStatusText(order.status);
                  const itemsList = order.items || [];

                  return (
                    <article key={order.orderId || order._id || idx} className="pf-order-card">
                      {/* Order Card Top Bar */}
                      <div className="pf-order-card-header">
                        <div className="pf-order-meta">
                          <span className="pf-order-id-badge">
                            #{order.orderId || `OD-${1000 + idx}`}
                          </span>
                        </div>

                        <div className={`pf-status-badge ${badgeClass}`}>
                          <span className="pf-status-indicator" />
                          <span>{statusLabel}</span>
                        </div>
                      </div>

                      {/* Itemized Manifest Rows */}
                      <div className="pf-order-items-table">
                        {itemsList.length === 0 ? (
                          <div className="pf-item-row">
                            <div className="pf-item-info">
                              <span className="pf-item-name">Standard Stationery / Print Requisition</span>
                            </div>
                            <div className="pf-item-pricing">
                              <span className="pf-item-total">₹{order.total || 0}</span>
                            </div>
                          </div>
                        ) : (
                          itemsList.map((item, itemIdx) => (
                            <div key={itemIdx} className="pf-item-row">
                              <div className="pf-item-info">
                                <div>
                                  <span className="pf-item-name">{item.name}</span>
                                  <span className="pf-item-qty-pill">
                                    QTY: {item.quantity || 1}
                                  </span>
                                </div>
                              </div>

                              <div className="pf-item-pricing">
                                <span className="pf-item-total">
                                  ₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Order Card Footer */}
                      <div className="pf-order-card-footer">
                        <div className="pf-order-total-block">
                          <div className="pf-order-total-line">
                            <span className="pf-total-label">Grand Total:</span>
                            <span className="pf-total-val">₹{order.total || 0}</span>
                          </div>
                          <span className="pf-order-date">
                            {order.date || "Recent Dispatch"}
                          </span>
                        </div>

                        <div className="pf-order-actions">
                          <button
                            className="pf-btn-receipt"
                            onClick={() => handleViewReceipt(order)}
                          >
                            VIEW RECEIPT
                          </button>
                          <button
                            className="pf-btn-reorder"
                            onClick={() => handleReorder(order)}
                          >
                            RE-ORDER
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </main>

        {/* TOAST FEEDBACK */}
        {toastMsg && (
          <div className="pf-toast">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* RECEIPT MODAL POPUP */}
        {activeReceiptModal && (() => {
          const codeString = `ODY-${String(activeReceiptModal.orderId).replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toUpperCase()}`;
          const { bars, totalWidth } = generateCode128Svg(codeString);

          return (
            <div
              className="rcpt-modal-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) setActiveReceiptModal(null);
              }}
            >
              <div className="rcpt-modal-dialog">
                <div className="rcpt-modal-topbar">
                  <span className="rcpt-modal-title">OFFICIAL RECEIPT DISPATCH</span>
                  <button
                    className="rcpt-modal-close-btn"
                    onClick={() => setActiveReceiptModal(null)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="rcpt-modal-scroll-area">
                  <div className="rcpt-modal-card">
                    {/* Header Crest */}
                    <div className="rcpt-modal-head">
                      <div className="rcpt-modal-emblem-wrap">
                        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                          <circle cx="40" cy="40" r="37" stroke="#0e1a12" strokeWidth="1.5" strokeDasharray="3 2" />
                          <circle cx="40" cy="40" r="33" stroke="#0e1a12" strokeWidth="0.8" />
                          <circle cx="40" cy="40" r="30" stroke="rgba(35, 133, 75, 0.4)" strokeWidth="0.5" />
                          <path d="M40 18 C35 24 33 30 33 36 C33 39 34 41 36 43 C30 43 25 46 23 51 C29 50 34 50 38 52 C37 55 35 59 33 63 C37 60 41 57 44 57 C42 61 41 64 40 68 C46 62 51 56 54 49 C56 49 58 49 60 48 C58 47 57 46 55 45 C57 41 57 34 52 27 C48 22 44 19 40 18 Z" fill="#0e1a12" />
                          <circle cx="43" cy="28" r="1.8" fill="#52e389" />
                          <path d="M40 8.2 L41.1 12 L44.5 13 L41.1 14 L40 17.5 L38.9 14 L35.5 13 L38.9 12 Z" fill="#23854b" />
                        </svg>
                      </div>
                      <span className="rcpt-modal-pretitle">— THE RAVEN ARCHIVES • EST. 2026 —</span>
                      <h2 className="rcpt-modal-doc-title">SUPPLY ORDER RECEIPT</h2>
                      <span className="rcpt-modal-subtitle">AUTHENTICATED CAMPUS SCRIPTORIUM DISPATCH RECORD</span>
                      <div className="rcpt-modal-ornate-divider">
                        <span style={{ padding: "0 8px", fontSize: 8, color: "#1e452c" }}>❖</span>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="rcpt-modal-meta-grid">
                      <div className="rcpt-modal-meta-cell">
                        <span className="rcpt-modal-meta-lbl">ORDER REFERENCE</span>
                        <span className="rcpt-modal-meta-val mono">{activeReceiptModal.orderId}</span>
                      </div>
                      <div className="rcpt-modal-meta-cell">
                        <span className="rcpt-modal-meta-lbl">DISPATCH STATUS</span>
                        <span className="rcpt-modal-meta-val status-badge">{activeReceiptModal.status}</span>
                      </div>
                      <div className="rcpt-modal-meta-cell">
                        <span className="rcpt-modal-meta-lbl">COLLECTION POINT</span>
                        <span className="rcpt-modal-meta-val">{activeReceiptModal.pickupCounter}</span>
                      </div>
                      <div className="rcpt-modal-meta-cell">
                        <span className="rcpt-modal-meta-lbl">RECORDED AT</span>
                        <span className="rcpt-modal-meta-val">{activeReceiptModal.date}</span>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px dashed rgba(15, 28, 19, 0.35)", margin: "2px 0" }} />

                    {/* Manifest Table */}
                    <div className="rcpt-modal-manifest">
                      <div className="rcpt-modal-th-row">
                        <span style={{ flex: 1, textAlign: "left" }}>ITEM DESCRIPTION</span>
                        <span style={{ width: 44, textAlign: "center" }}>QTY</span>
                        <span style={{ width: 68, textAlign: "right" }}>AMOUNT</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {(activeReceiptModal.items || []).map((item, idx) => (
                          <div key={idx} className="rcpt-modal-item-row">
                            <div style={{ flex: 1, textAlign: "left" }}>
                              <div className="rcpt-modal-item-name">{item.name || item.title || "Item"}</div>
                              {item.specs && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, color: "#3b5742" }}>{item.specs}</div>}
                            </div>
                            <div style={{ width: 44, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600, color: "#1a2a1f" }}>
                              ×{item.quantity || item.qty || 1}
                            </div>
                            <div style={{ width: 68, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 800, color: "#0b140e" }}>
                              ₹{((Number(item.price) || 0) * (Number(item.quantity || item.qty) || 1)).toFixed(0)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Box */}
                    <div className="rcpt-modal-total-box">
                      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", color: "#0b140e" }}>TOTAL OFFERING PAID</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 6.5, letterSpacing: "0.14em", color: "#315139" }}>OFFICIALLY TENDERED & SETTLED</span>
                      </div>
                      <span className="rcpt-modal-total-amt">₹{activeReceiptModal.total}</span>
                    </div>

                    {/* Barcode Section */}
                    <div className="rcpt-modal-barcode-wrap">
                      <svg viewBox={`0 0 ${totalWidth} 32`} preserveAspectRatio="none" style={{ width: "72%", maxWidth: 240, height: 30, display: "block", shapeRendering: "crispEdges" }}>
                        {bars.map((bar, idx) => (
                          <rect key={idx} x={bar.x} y="0" width={bar.w} height="32" fill="#0b160e" />
                        ))}
                      </svg>
                      <span className="rcpt-modal-barcode-text">* {codeString} *</span>
                    </div>

                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 6.5, letterSpacing: "0.22em", color: "#3b5742", textAlign: "center", fontWeight: 700, textTransform: "uppercase" }}>
                      ODYSSEY SCRIPTORIUM • ARCHIVAL DISPATCH VERIFICATION SEAL
                    </div>
                  </div>
                </div>

                <div className="rcpt-modal-footer-bar">
                  <button
                    className="rcpt-modal-print-btn"
                    onClick={() => downloadOrPrintReceipt(activeReceiptModal)}
                  >
                    🖨 PRINT / DOWNLOAD PDF
                  </button>
                  <button
                    className="rcpt-modal-close-btn"
                    style={{ width: "auto", padding: "0 14px", fontSize: 12, fontFamily: "'Titan One', sans-serif" }}
                    onClick={() => setActiveReceiptModal(null)}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}
