import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { downloadOrPrintReceipt, generateCode128Svg } from "../utils/printReceipt";
import SoundToggleButton from "../components/SoundToggleButton";

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

  .pf-nav-sound {
    background: var(--brain-pink);
    color: var(--void-black);
  }

  .pf-nav-sound:hover {
    background: #FF5A96;
  }

  .pf-nav-sound.is-sound-on,
  .pf-nav-sound.is-sound-off {
    background: var(--brain-pink);
    color: var(--void-black);
  }

  .pf-nav-cart {
    background: var(--brain-pink);
    color: var(--void-black);
  }

  .pf-nav-exit {
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
    position: relative;
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
    background: #FFFFFF;
    border: 3px solid var(--border-dark);
    border-radius: 16px;
    box-shadow: 5px 5px 0px var(--border-dark);
    overflow: hidden;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    display: flex;
    flex-direction: column;
  }

  .pf-order-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0px var(--border-dark);
  }

  /* ── Order Card Header (Meta & Status) ── */
  .pf-order-card-header {
    background: #FAF9F5;
    border-bottom: 2.5px solid var(--border-dark);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }

  .pf-order-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .pf-order-id-group {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--void-black);
    padding: 5px 12px;
    border-radius: 8px;
    border: 2px solid var(--border-dark);
    box-shadow: 2px 2px 0px var(--border-dark);
  }

  .pf-order-id-prefix {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #94A3B8;
    text-transform: uppercase;
  }

  .pf-order-id-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: var(--slime-green);
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pf-order-date {
    font-size: 12.5px;
    font-weight: 700;
    color: #555566;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .pf-order-date svg {
    color: #888899;
    flex-shrink: 0;
  }

  /* Status Badges */
  .pf-status-badge {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 999px;
    border: 2px solid var(--border-dark);
    box-shadow: 2px 2px 0px var(--border-dark);
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .pf-status-badge.ready {
    background: var(--slime-green);
    color: var(--void-black);
  }

  .pf-status-badge.printing {
    background: var(--seafoam);
    color: var(--void-black);
  }

  .pf-status-badge.confirmed {
    background: var(--seafoam);
    color: var(--void-black);
  }

  .pf-status-badge.confirmed .pf-status-indicator {
    display: none;
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
    animation: pf-pulse 2s infinite ease-in-out;
  }

  @keyframes pf-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.65; }
  }

  /* ── Order Items Body ── */
  .pf-order-items-table {
    padding: 14px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #FFFFFF;
  }

  .pf-item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 0;
    background: transparent;
    border-bottom: 1.5px dashed #E5E7EB;
  }

  .pf-item-row:last-child {
    border-bottom: none;
    padding-bottom: 4px;
  }

  .pf-item-info {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .pf-item-details {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    min-width: 0;
  }

  .pf-item-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pf-item-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14.5px;
    font-weight: 800;
    color: var(--void-black);
    line-height: 1.3;
    letter-spacing: -0.2px;
  }

  .pf-item-qty-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 800;
    background: var(--hazard-gold);
    color: var(--void-black);
    padding: 2px 8px;
    border-radius: 6px;
    border: 1.5px solid var(--border-dark);
    box-shadow: 1.5px 1.5px 0px var(--border-dark);
    white-space: nowrap;
    letter-spacing: 0.3px;
  }

  .pf-item-variant {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    color: #64748B;
    line-height: 1.3;
  }

  .pf-item-unit-rate {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    font-weight: 700;
    color: #888899;
  }

  .pf-item-pricing {
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex-shrink: 0;
  }

  .pf-item-total {
    font-family: 'JetBrains Mono', monospace;
    font-size: 16px;
    font-weight: 800;
    color: var(--void-black);
    white-space: nowrap;
    letter-spacing: -0.2px;
  }

  /* ── Order Footer (Total & Actions) ── */
  .pf-order-card-footer {
    background: #FAF9F5;
    border-top: 2.5px solid var(--border-dark);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .pf-order-total-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .pf-order-item-count {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #71717A;
    font-family: 'JetBrains Mono', monospace;
  }

  .pf-order-total-line {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .pf-total-label {
    font-size: 12.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #4B5563;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .pf-total-val {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 24px;
    color: var(--void-black);
    letter-spacing: 0.3px;
  }

  .pf-order-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pf-btn-receipt {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 9px 16px;
    background: #FFFFFF;
    color: var(--void-black);
    border: 2px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: var(--shadow-comic-sm);
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
  }

  .pf-btn-receipt:hover {
    background: var(--brain-pink);
    transform: translate(1.5px, 1.5px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  .pf-btn-reorder {
    font-family: 'Titan One', 'Archivo Black', 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 9px 18px;
    background: var(--slime-green);
    color: var(--void-black);
    border: 2px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: var(--shadow-comic-sm);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .pf-btn-reorder:hover {
    transform: translate(1.5px, 1.5px);
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
    right: 50px;
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

  @keyframes toastSlideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ── RECEIPT MODAL POPUP (MATCHES AUTHENTIC PAPER RECEIPT DESIGN) ── */
  .rcpt-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9990;
    background: rgba(6, 10, 7, 0.90);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 14px;
    overflow-y: auto;
    animation: rcptFadeIn 0.18s ease-out;
  }

  .rcpt-modal-overlay::-webkit-scrollbar {
    width: 8px;
  }
  .rcpt-modal-overlay::-webkit-scrollbar-track {
    background: transparent;
  }
  .rcpt-modal-overlay::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
  .rcpt-modal-overlay::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.28);
  }

  @keyframes rcptFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .rcpt-modal-container {
    position: relative;
    max-width: 520px;
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: rcptScaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes rcptScaleUp {
    from { transform: scale(0.94); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .rcpt-modal-floating-close,
  .rcpt-modal-ticket-card .rcpt-modal-floating-close {
    position: absolute !important;
    top: 14px !important;
    right: 16px !important;
    left: auto !important;
    z-index: 50 !important;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #0f1c13;
    color: #dcebd7;
    border: 1.5px solid rgba(35, 133, 75, 0.45);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 900;
    transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .rcpt-modal-floating-close:hover {
    transform: scale(1.08);
    background: #182e20;
    color: #ffffff;
    border-color: #52e389;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
  }

  .rcpt-modal-raven-wrap {
    position: relative;
    width: 100%;
    margin-bottom: -3px;
    z-index: 5;
    pointer-events: none;
    user-select: none;
    display: flex;
    justify-content: center;
    filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.75));
  }

  .rcpt-modal-raven-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  /* Authentic Engraved Vellum Paper Card Body */
  .rcpt-modal-ticket-card {
    position: relative;
    width: 100%;
    background-color: #daead4;
    background-image: 
      radial-gradient(ellipse at 50% 15%, rgba(255, 255, 255, 0.35) 0%, rgba(218, 234, 212, 0.2) 60%, rgba(185, 206, 177, 0.45) 100%),
      linear-gradient(180deg, #daead4 0%, #d2e4cb 40%, #c8dcbf 100%);
    color: #0f1a13;
    border: 1px solid rgba(18, 30, 21, 0.45);
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    padding: 30px 30px 42px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    z-index: 4;
    box-shadow: 
      inset 0 0 35px rgba(20, 32, 22, 0.08),
      inset 0 0 2px rgba(15, 26, 17, 0.25),
      0 24px 48px rgba(0, 0, 0, 0.85);
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

  .rcpt-modal-ticket-card::before {
    content: '';
    position: absolute;
    inset: 10px 12px 24px;
    border: 1px solid rgba(18, 30, 21, 0.28);
    pointer-events: none;
    z-index: 1;
  }

  .rcpt-modal-ticket-card::after {
    content: '';
    position: absolute;
    inset: 13px 15px 27px;
    border: 0.5px solid rgba(18, 30, 21, 0.14);
    pointer-events: none;
    z-index: 1;
  }

  .rcpt-modal-ticket-card > *:not(.rcpt-modal-floating-close) {
    position: relative;
    z-index: 2;
  }

  .rcpt-modal-tkt-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 3px;
    padding-top: 2px;
  }

  .rcpt-modal-tkt-pretitle {
    font-family: 'Cinzel', serif;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.28em;
    color: #2b4533;
    text-transform: uppercase;
  }

  .rcpt-modal-tkt-title {
    font-family: 'Cinzel', serif;
    font-size: 21px;
    font-weight: 900;
    letter-spacing: 0.1em;
    color: #0b140e;
    margin: 3px 0 1px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  .rcpt-modal-tkt-divider-double {
    width: 100%;
    height: 4px;
    border-top: 1.5px solid #0f1c13;
    border-bottom: 0.5px solid #0f1c13;
    margin: 4px 0 2px;
  }

  .rcpt-modal-tkt-meta-group {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 2px 2px;
  }

  .rcpt-modal-tkt-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
  }

  .rcpt-modal-tkt-label {
    font-family: 'Cinzel', serif;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #2a4231;
    white-space: nowrap;
  }

  .rcpt-modal-tkt-val {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    font-weight: 700;
    color: #0c150f;
    text-align: right;
    white-space: nowrap;
    letter-spacing: 0.04em;
  }

  .rcpt-modal-tkt-status-pill {
    display: inline-flex;
    align-items: center;
    font-family: 'Cinzel', serif;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #164023;
    white-space: nowrap;
  }

  .rcpt-modal-tkt-copy-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    margin-left: 8px;
    padding: 1.5px 0;
    text-align: center;
    border-radius: 2px;
    background: rgba(18, 34, 23, 0.08);
    color: #122417;
    border: 1px solid rgba(18, 34, 23, 0.35);
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .rcpt-modal-tkt-copy-btn.copied,
  .rcpt-modal-tkt-copy-btn:hover {
    background: #122417;
    color: #e5f2de;
  }

  .rcpt-modal-tkt-divider-dashed {
    width: 100%;
    border-bottom: 1px dashed rgba(18, 32, 22, 0.35);
    margin: 2px 0;
  }

  .rcpt-modal-manifest-wrap {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .rcpt-modal-manifest-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid rgba(18, 30, 21, 0.3);
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.18);
  }

  .rcpt-modal-item-title {
    font-family: 'Cinzel', serif;
    font-size: 12.5px;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: #0b140e;
  }

  .rcpt-modal-item-qty {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    font-weight: 600;
    color: #354d3d;
    font-style: italic;
    margin-top: 1px;
  }

  .rcpt-modal-item-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13.5px;
    font-weight: 800;
    color: #0c160f;
    margin-left: 12px;
    white-space: nowrap;
  }

  .rcpt-modal-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 2px;
    padding: 7px 10px;
    border-top: 1.5px solid #0f1c13;
    border-bottom: 3px double #0f1c13;
    background: rgba(18, 32, 22, 0.04);
  }

  .rcpt-modal-total-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
    font-weight: 900;
    color: #0b150e;
  }

  .rcpt-modal-barcode-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    padding-top: 10px;
    border-top: 1px dashed rgba(18, 32, 22, 0.35);
    width: 100%;
  }

  .rcpt-modal-barcode-svg {
    width: 86%;
    max-width: 320px;
    height: 38px;
    display: block;
    shape-rendering: crispEdges;
  }

  .rcpt-modal-barcode-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.3em;
    color: #1a2a1f;
  }

  .rcpt-modal-btn-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 8px;
    width: 100%;
  }

  .rcpt-modal-btn {
    flex: 1;
    padding: 11px 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cinzel', serif;
    font-weight: 900;
    font-size: 11px;
    letter-spacing: 0.12em;
    cursor: pointer;
    border-radius: 2px;
    user-select: none;
    transition: transform 0.12s ease, background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  }

  .rcpt-modal-btn.primary {
    background: #0e1911;
    color: #e3f2dc;
    border: 1.5px solid #0e1911;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.4);
  }

  .rcpt-modal-btn.primary:hover {
    background: #1a3022;
    border-color: #1a3022;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 2px 3px 0px rgba(0, 0, 0, 0.55);
  }

  .rcpt-modal-btn.secondary {
    background: rgba(15, 28, 19, 0.08);
    color: #0e1911;
    border: 1.5px solid #0f1c13;
    box-shadow: 2px 2px 0px rgba(15, 28, 19, 0.3);
  }

  .rcpt-modal-btn.secondary:hover {
    background: #0f1c13;
    color: #e3f2dc;
    border-color: #0f1c13;
    transform: translateY(-1px);
    box-shadow: 2px 3px 0px rgba(15, 28, 19, 0.5);
  }

  .rcpt-modal-btn:active {
    transform: translateY(1px);
    box-shadow: 1px 1px 0px rgba(15, 28, 19, 0.35);
  }

  /* ── THE SOUNDS OF ODYSSEY (AUDITORY LORE & TRIBUTE) ── */
  .pf-sounds-section {
    margin-top: 48px;
    background: var(--parchment);
    border: 3.5px solid var(--border-dark);
    border-radius: 20px;
    box-shadow: var(--shadow-comic-lg);
    padding: 36px 32px 48px;
  }

  .pf-sounds-header-box {
    margin-bottom: 28px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    border-bottom: 2px dashed rgba(13, 13, 13, 0.2);
    padding-bottom: 20px;
  }

  .pf-sounds-pill {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: var(--void-black);
    color: var(--slime-green);
    padding: 5px 12px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
  }

  .pf-sounds-title {
    font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: clamp(24px, 3.2vw, 34px);
    color: var(--void-black);
    letter-spacing: 0.5px;
    line-height: 1.15;
    margin: 0;
  }

  .pf-sounds-subtitle {
    font-size: 13.5px;
    font-weight: 600;
    color: #4A564F;
    margin-top: 4px;
    max-width: 100%;
    line-height: 1.5;
  }

  .pf-sounds-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
  }

  .pf-sound-card {
    background: #FFFFFF;
    border: 3px solid var(--border-dark);
    border-radius: 16px;
    padding: 24px 22px;
    box-shadow: var(--shadow-comic);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .pf-sound-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-comic-lg);
  }

  .pf-sound-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .pf-sound-tag {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 4px 10px;
    border: 2px solid var(--border-dark);
    border-radius: 999px;
    box-shadow: 1.5px 1.5px 0px var(--border-dark);
  }

  .pf-sound-tag.tag-gf {
    background: var(--hazard-gold);
    color: var(--void-black);
  }

  .pf-sound-tag.tag-locked {
    background: var(--void-black);
    color: var(--brain-pink);
  }

  .pf-sound-tag.tag-unlocked {
    background: #BE2E2E;
    color: #FFFFFF;
  }

  .pf-sound-track-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 21px;
    font-weight: 800;
    letter-spacing: -0.015em;
    color: var(--void-black);
    line-height: 1.25;
    margin-bottom: 5px;
  }

  .pf-sound-artist {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 800;
    color: #D81B60;
    margin-bottom: 10px;
  }

  .pf-sound-role-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--void-black);
    background: var(--slime-green);
    border: 1.5px solid var(--border-dark);
    padding: 3px 8px;
    border-radius: 6px;
    display: inline-block;
    margin-bottom: 14px;
    width: fit-content;
  }

  .pf-sound-desc {
    font-size: 13px;
    line-height: 1.6;
    color: #2F3934;
    font-weight: 500;
  }

  /* ✦ YIN & YANG THEMED SOUND CARDS ✦ */
  .pf-sound-card.pf-sound-card-yang {
    background: #FFFFFF !important;
    border: 3.5px solid var(--border-dark) !important;
    border-radius: 16px;
    box-shadow: 5px 5px 0px var(--border-dark) !important;
    color: var(--void-black);
  }

  .pf-sound-card.pf-sound-card-yang:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0px var(--border-dark) !important;
  }

  .pf-sound-card.pf-sound-card-yang .pf-sound-track-name {
    color: var(--void-black);
  }

  .pf-sound-card.pf-sound-card-yang .pf-sound-artist {
    color: #4A5568;
  }

  .pf-sound-card.pf-sound-card-yang .pf-sound-role-chip {
    background: #FFFFFF;
    color: var(--void-black);
    border: 1.5px solid var(--border-dark);
  }

  .pf-sound-card.pf-sound-card-yang .pf-sound-desc {
    color: #2D3748;
  }

  /* YIN (DARK / ABYSSAL) */
  .pf-sound-card.pf-sound-card-yin {
    background: #0B0E0D !important;
    border: 2.5px solid #FFFFFF !important;
    border-radius: 16px;
    box-shadow: 0 0 0 2px var(--border-dark), 5px 5px 0px var(--border-dark) !important;
    color: #FFFFFF;
  }

  .pf-sound-card.pf-sound-card-yin:hover {
    transform: translate(-2px, -2px);
    box-shadow: 0 0 0 2px var(--border-dark), 7px 7px 0px var(--border-dark) !important;
  }

  .pf-sound-card.pf-sound-card-yin .pf-sound-track-name {
    color: #FFFFFF !important;
  }

  .pf-sound-card.pf-sound-card-yin .pf-sound-artist {
    color: rgba(255, 255, 255, 0.72) !important;
  }

  .pf-sound-card.pf-sound-card-yin .pf-sound-role-chip {
    background: rgba(255, 255, 255, 0.1) !important;
    color: #E2E8F0 !important;
    border: 1.5px solid rgba(255, 255, 255, 0.28) !important;
  }

  .pf-sound-card.pf-sound-card-yin .pf-sound-desc {
    color: rgba(240, 240, 240, 0.82) !important;
  }

  .pf-sound-card.pf-sound-card-yin .pf-sound-desc strong {
    color: #FFFFFF !important;
  }

  /* Locked / Unlocked subtle distinctions for Yin card */
  .pf-sound-card.pf-sound-card-yin.is-locked .pf-sound-track-name {
    letter-spacing: 0.5px;
  }
`;

function getStatusBadgeClass(status) {
  if (!status) return "pending";
  const s = String(status).toUpperCase();
  if (s === "CONFIRMED") return "confirmed";
  if (s === "READY" || s === "COMPLETED") return "ready";
  if (s === "PRINTING" || s === "PROCESSING" || s === "IN PRINT QUEUE") return "printing";
  if (s === "PENDING" || s === "AWAITING PAYMENT") return "pending";
  return "other";
}

function formatStatusText(status) {
  if (!status) return "PENDING";
  return String(status).toUpperCase();
}

function parseItemDetails(rawName = "") {
  if (!rawName) return { title: "Stationery Item", variant: null };
  // Split title and parentheses e.g. "Camlin Exam Geometry Box (Standard Student, 0.5mm Fine)"
  const match = rawName.match(/^([^(]+)(?:\((.*)\))?$/);
  if (match) {
    const title = match[1].trim();
    const variant = match[2] ? match[2].trim() : null;
    return { title, variant };
  }
  return { title: rawName, variant: null };
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
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [hasUnlockedAltarSong, setHasUnlockedAltarSong] = useState(() => {
    try {
      return localStorage.getItem("odyssey_unlocked_altar_theme") === "true";
    } catch (_) {
      return false;
    }
  });

  useEffect(() => {
    try {
      const unlocked = localStorage.getItem("odyssey_unlocked_altar_theme") === "true";
      setHasUnlockedAltarSong(unlocked);
    } catch (_) {}
  }, []);



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

    // 2. Load stored orders from localStorage with guaranteed odysseyReceipt sync
    let localOrders = JSON.parse(localStorage.getItem("odysseyOrders")) || [];
    try {
      const storedReceipt = JSON.parse(localStorage.getItem("odysseyReceipt"));
      if (storedReceipt && storedReceipt.orderId) {
        const cleanReceiptId = String(storedReceipt.orderId).replace(/^#/, "");
        const alreadyInLocal = localOrders.some(
          (o) => String(o.orderId || o._id || "").replace(/^#/, "") === cleanReceiptId
        );
        if (!alreadyInLocal) {
          localOrders.unshift({
            orderId: cleanReceiptId,
            items: storedReceipt.items || [],
            total: storedReceipt.total || 0,
            date: storedReceipt.date || new Date().toLocaleString(),
            status: storedReceipt.status || "IN PRINT QUEUE",
          });
          localStorage.setItem("odysseyOrders", JSON.stringify(localOrders));
        }
      }
    } catch (e) {}

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
            mongoId: String(o._id || ""),
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

          // Merge: local orders take precedence because they contain full item details, prices, specs & correct total!
          const merged = [...localOrders];
          normalizedServerOrders.forEach((so) => {
            const cleanSoId = String(so.orderId || "").replace(/^#/, "");
            const cleanSoMongo = String(so.mongoId || "").replace(/^#/, "");

            const exists = merged.some((lo) => {
              const cleanLoId = String(lo.orderId || lo._id || "").replace(/^#/, "");
              const cleanLoMongo = String(lo.mongoId || "").replace(/^#/, "");
              return (
                cleanLoId === cleanSoId ||
                cleanLoId === cleanSoMongo ||
                (cleanLoMongo && cleanLoMongo === cleanSoMongo)
              );
            });
            if (!exists) {
              merged.push(so);
            }
          });

          // Most recent orders first
          setOrders(merged);
          return;
        }
      } catch (err) {
        console.warn("Could not fetch remote orders, using local:", err.message);
      }

      setOrders(localOrders);
    };

    fetchServerOrders();
  }, []);

  // Filter orders according to active tab
  const filteredOrders = orders.filter((order) => {
    const s = String(order.status || "").toUpperCase();
    if (activeTab === "ACTIVE") {
      return (
        s === "PRINTING" ||
        s === "PROCESSING" ||
        s === "PENDING" ||
        s === "AWAITING PAYMENT" ||
        s === "IN PRINT QUEUE" ||
        s === "CONFIRMED"
      );
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
    return (
      s === "PRINTING" ||
      s === "PROCESSING" ||
      s === "PENDING" ||
      s === "AWAITING PAYMENT" ||
      s === "IN PRINT QUEUE" ||
      s === "CONFIRMED"
    );
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
              <SoundToggleButton className="pf-nav-btn pf-nav-sound" />

              <button
                className="pf-nav-btn pf-nav-cart"
                onClick={() => navigate("/cart")}
              >
                CART ({cartCount})
              </button>

              <button
                className="pf-nav-btn pf-nav-exit"
                onClick={() => {
                  navigate("/");
                }}
              >
                EXIT TO MAIN
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
                  <div className="pf-avatar-online-dot" />
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
                  const totalItemsCount = itemsList.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);

                  return (
                    <article key={order.orderId || order._id || idx} className="pf-order-card">
                      {/* Order Card Top Bar (Meta & Status) */}
                      <div className="pf-order-card-header">
                        <div className="pf-order-meta">
                          <div className="pf-order-id-group">
                            <span className="pf-order-id-prefix">ORDER</span>
                            <span className="pf-order-id-badge">
                              #{String(order.orderId || `OD-${1000 + idx}`).replace(/^#/, "")}
                            </span>
                          </div>

                          <span className="pf-order-date">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {order.date || "Recent Dispatch"}
                          </span>
                        </div>

                        <div className={`pf-status-badge ${badgeClass}`}>
                          {statusLabel !== "CONFIRMED" && <span className="pf-status-indicator" />}
                          <span>{statusLabel}</span>
                        </div>
                      </div>

                      {/* Itemized Manifest Rows */}
                      <div className="pf-order-items-table">
                        {itemsList.length === 0 ? (
                          <div className="pf-item-row">
                            <div className="pf-item-info">
                              <div className="pf-item-details">
                                <span className="pf-item-name">Standard Stationery / Print Requisition</span>
                              </div>
                            </div>
                            <div className="pf-item-pricing">
                              <span className="pf-item-total">₹{order.total || 0}</span>
                            </div>
                          </div>
                        ) : (
                          itemsList.map((item, itemIdx) => {
                            const details = parseItemDetails(item.name);
                            const qty = Number(item.quantity) || 1;
                            const unitPrice = Number(item.price) || 0;
                            const itemRowTotal = unitPrice > 0 
                              ? unitPrice * qty 
                              : (itemsList.length === 1 ? (Number(order.total) || 0) : 0);

                            return (
                              <div key={itemIdx} className="pf-item-row">
                                <div className="pf-item-info">
                                  <div className="pf-item-details">
                                    <div className="pf-item-title-row">
                                      <span className="pf-item-name">{details.title}</span>
                                      <span className="pf-item-qty-pill">QTY: {qty}</span>
                                    </div>
                                    {details.variant && (
                                      <span className="pf-item-variant">{details.variant}</span>
                                    )}
                                    {unitPrice > 0 && qty > 1 && (
                                      <span className="pf-item-unit-rate">₹{unitPrice} each</span>
                                    )}
                                  </div>
                                </div>

                                <div className="pf-item-pricing">
                                  <span className="pf-item-total">
                                    ₹{itemRowTotal > 0 ? itemRowTotal : (Number(item.price) || 0) * qty}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Order Card Footer */}
                      <div className="pf-order-card-footer">
                        <div className="pf-order-total-block">
                          <span className="pf-order-item-count">
                            {totalItemsCount} {totalItemsCount === 1 ? "ITEM ORDERED" : "ITEMS ORDERED"}
                          </span>
                          <div className="pf-order-total-line">
                            <span className="pf-total-label">Grand Total:</span>
                            <span className="pf-total-val">₹{order.total || 0}</span>
                          </div>
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

          {/* 3. THE SOUNDS OF ODYSSEY: AUDITORY LORE & TRIBUTE */}
          <section className="pf-sounds-section">
            <div className="pf-sounds-header-box">
              <div>
                <h2 className="pf-sounds-title">The Sounds of Odyssey</h2>
                <p className="pf-sounds-subtitle">
                  From the dreamlike Oregon woods to the subterranean abyss of the offering altar — honoring the masters behind our frequencies.
                </p>
              </div>
            </div>

            <div className="pf-sounds-grid">
              {/* ✦ 1. FIRST TRACK (YANG): GRAVITY FALLS / DREAMSCAPERERS ✦ */}
              <div className="pf-sound-card pf-sound-card-yang">
                <div>
                  <h3 className="pf-sound-track-name">Dreamscaperers Outro</h3>
                  <div className="pf-sound-artist">Composed by Brad Breeck · Created by Alex Hirsch · Gravity Falls OST</div>
                  <div className="pf-sound-role-chip">Landing Page · Basecamp · All 6 Terminal Stations</div>
                  <p className="pf-sound-desc">
                    Originally crafted by visionary composer <strong>Brad Breeck</strong> for <em>Gravity Falls</em>. Built around warm kalimba chimes, nostalgic analog keys, and surreal woodblock echoes, this loop encapsulates the cozy mystery of the Pacific Northwest mystery shack before the storm hits.
                  </p>

                  {/* WRITTEN TRIBUTE */}
                  <div
                    style={{
                      background: "rgba(13, 13, 13, 0.04)",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      marginTop: "16px",
                      fontSize: "12px",
                      lineHeight: "1.6",
                      color: "#1F2937",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        color: "#4B5563",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      A WRITTEN TRIBUTE
                    </div>
                    <p style={{ margin: "0 0 6px 0", fontStyle: "italic", color: "#374151" }}>
                      &ldquo;To Alex Hirsch and Brad Breeck: Thank you for crafting a world brimming with mystery, laughter, and wonder. Gravity Falls inspired the curious soul and adventurous spirit of Odyssey — proving that the strangest mysteries feel like home when built with heart.&rdquo;
                    </p>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "var(--void-black)",
                      }}
                    >
                      — Mohammed Sahil, Creator of Odyssey
                    </div>
                  </div>
                </div>
              </div>

              {/* ✦ 2. SECOND TRACK (YIN): SURPRISE / LOCKED OR UNLOCKED ✦ */}
              {!hasUnlockedAltarSong ? (
                <div className="pf-sound-card pf-sound-card-yin is-locked">
                  <div>
                    <h3 className="pf-sound-track-name">??? · The Abyssal Frequency</h3>
                    <div className="pf-sound-artist">Classified Occult Composer · Sealed Vault</div>
                    <div className="pf-sound-role-chip">Grim Reaper's Offering Shrine · Checkout Gate</div>
                    <p className="pf-sound-desc">
                      A cosmic dark-ambient frequency resting in subterranean depths. This tribute remains shrouded in cemetery fog until you journey past Basecamp, place your offering with the Grim Reaper at the payment altar, and hear it echo through the graveyard.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="pf-sound-card pf-sound-card-yin is-unlocked">
                  <div>
                    <h3 className="pf-sound-track-name">Cthulhu: Abyssal Drone</h3>
                    <div className="pf-sound-artist">A Cryo Chamber Collaboration · Simon Heath</div>
                    <div className="pf-sound-role-chip">The Grim Reaper's Altar · Archival Manifest</div>
                    <p className="pf-sound-desc">
                      A monument to cosmic dread crafted by dark ambient imprint <strong>Cryo Chamber</strong> and <strong>Simon Heath</strong>. Layered with cavernous modular sub-bass, subterranean tomb reverbs, and suffocating tension — soundtracking your trial before the Grim Reaper.
                    </p>

                    {/* WRITTEN TRIBUTE */}
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        marginTop: "16px",
                        fontSize: "12px",
                        lineHeight: "1.6",
                        color: "#D1D5DB",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "9px",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          color: "#FFFFFF",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        A WRITTEN TRIBUTE
                      </div>
                      <p style={{ margin: "0 0 6px 0", fontStyle: "italic", color: "#E5E7EB" }}>
                        &ldquo;To Simon Heath and Cryo Chamber: Thank you for mastering the art of sonic darkness and cosmic atmosphere. Your subterranean drones gave the Grim Reaper&rsquo;s Altar its spine-chilling weight and cinematic depth.&rdquo;
                      </p>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#F9FAFB",
                        }}
                      >
                        — Mohammed Sahil, Creator of Odyssey
                      </div>
                    </div>
                  </div>
                </div>
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

        {/* RECEIPT MODAL POPUP (MATCHES AUTHENTIC PAPER RECEIPT DESIGN) */}
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
              <div className="rcpt-modal-container">
                {/* Authentic Engraved Vellum Paper Card Body */}
                <div className="rcpt-modal-ticket-card">
                  {/* Seal Close Button */}
                  <button
                    className="rcpt-modal-floating-close"
                    onClick={() => setActiveReceiptModal(null)}
                    aria-label="Close Receipt"
                  >
                    ✕
                  </button>
                  {/* Receipt Header */}
                  <div className="rcpt-modal-tkt-head">
                    <div style={{ width: 52, height: 52, margin: "0 auto 4px" }}>
                      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                        <circle cx="40" cy="40" r="37" stroke="#0e1a12" strokeWidth="1.5" strokeDasharray="3 2" />
                        <circle cx="40" cy="40" r="33" stroke="#0e1a12" strokeWidth="0.8" />
                        <circle cx="40" cy="40" r="30" stroke="rgba(35, 133, 75, 0.4)" strokeWidth="0.5" />
                        <path d="M40 18 C35 24 33 30 33 36 C33 39 34 41 36 43 C30 43 25 46 23 51 C29 50 34 50 38 52 C37 55 35 59 33 63 C37 60 41 57 44 57 C42 61 41 64 40 68 C46 62 51 56 54 49 C56 49 58 49 60 48 C58 47 57 46 55 45 C57 41 57 34 52 27 C48 22 44 19 40 18 Z" fill="#0e1a12" />
                        <circle cx="43" cy="28" r="1.8" fill="#52e389" />
                        <path d="M40 11.2 L40.8 13.3 L43.5 14 L40.8 14.7 L40 16.8 L39.2 14.7 L36.5 14 L39.2 13.3 Z" fill="#23854b" />
                      </svg>
                    </div>
                    <span className="rcpt-modal-tkt-pretitle">— THE RAVEN ARCHIVES • EST. 2026 —</span>
                    <h2 className="rcpt-modal-tkt-title">SUPPLY ORDER RECEIPT</h2>
                    <div className="rcpt-modal-tkt-divider-double" />
                  </div>

                  {/* Order Metadata */}
                  <div className="rcpt-modal-tkt-meta-group">
                    <div className="rcpt-modal-tkt-row">
                      <span className="rcpt-modal-tkt-label">Order Reference</span>
                      <span className="rcpt-modal-tkt-val">
                        <span>{String(activeReceiptModal.orderId).startsWith("#") ? activeReceiptModal.orderId : `#${activeReceiptModal.orderId}`}</span>
                        <button
                          className={`rcpt-modal-tkt-copy-btn ${copiedOrderId ? "copied" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(activeReceiptModal.orderId);
                            setCopiedOrderId(true);
                            setTimeout(() => setCopiedOrderId(false), 2000);
                          }}
                        >
                          {copiedOrderId ? "✓ COPIED" : "COPY"}
                        </button>
                      </span>
                    </div>

                    <div className="rcpt-modal-tkt-row">
                      <span className="rcpt-modal-tkt-label">Dispatch Status</span>
                      <span className="rcpt-modal-tkt-status-pill">
                        {activeReceiptModal.status}
                      </span>
                    </div>

                    <div className="rcpt-modal-tkt-row">
                      <span className="rcpt-modal-tkt-label">Collection Desk</span>
                      <span className="rcpt-modal-tkt-val" style={{ fontSize: "10px" }}>
                        {activeReceiptModal.pickupCounter || "MAIN LIBRARY BASECAMP • PICKUP DESK 04"}
                      </span>
                    </div>

                    <div className="rcpt-modal-tkt-row">
                      <span className="rcpt-modal-tkt-label">Recorded At</span>
                      <span className="rcpt-modal-tkt-val" style={{ fontSize: "10.5px" }}>
                        {activeReceiptModal.date}
                      </span>
                    </div>
                  </div>

                  <div className="rcpt-modal-tkt-divider-dashed" />

                  {/* Manifest Section */}
                  <div className="rcpt-modal-manifest-wrap">
                    <div className="rcpt-modal-tkt-row" style={{ paddingBottom: 2 }}>
                      <span className="rcpt-modal-tkt-label">ITEM MANIFEST</span>
                      <span className="rcpt-modal-tkt-label">LINE TOTAL</span>
                    </div>

                    <div className="rcpt-modal-manifest-box">
                      {(activeReceiptModal.items || []).map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            paddingBottom: idx === (activeReceiptModal.items || []).length - 1 ? 0 : 6,
                            borderBottom: idx === (activeReceiptModal.items || []).length - 1 ? "none" : "1px dotted rgba(18, 30, 21, 0.22)",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <span className="rcpt-modal-item-title">
                              {item.name || item.title || "Supply Item"}
                            </span>
                            <span className="rcpt-modal-item-qty">
                              QTY: {item.quantity || item.qty || 1}
                              {item.specs ? ` • ${item.specs}` : ""}
                            </span>
                          </div>
                          <span className="rcpt-modal-item-price">
                            ₹{((Number(item.price) || 0) * (Number(item.quantity || item.qty) || 1)).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Offering Row */}
                  <div className="rcpt-modal-total-row">
                    <span className="rcpt-modal-tkt-label" style={{ fontSize: "12px", color: "#0c150e" }}>
                      TOTAL OFFERING
                    </span>
                    <span className="rcpt-modal-total-val">
                      ₹{activeReceiptModal.total}
                    </span>
                  </div>

                  {/* Scannable Barcode Section */}
                  <div className="rcpt-modal-barcode-section">
                    <svg
                      className="rcpt-modal-barcode-svg"
                      viewBox={`0 0 ${totalWidth} 32`}
                      preserveAspectRatio="none"
                    >
                      {bars.map((bar, idx) => (
                        <rect key={idx} x={bar.x} y="0" width={bar.w} height="32" fill="#0c160f" />
                      ))}
                    </svg>
                    <span className="rcpt-modal-barcode-code">
                      * {codeString} *
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="rcpt-modal-btn-row">
                    <button
                      className="rcpt-modal-btn primary"
                      onClick={() => downloadOrPrintReceipt(activeReceiptModal)}
                    >
                      🖨 PRINT / DOWNLOAD PDF
                    </button>
                    <button
                      className="rcpt-modal-btn secondary"
                      onClick={() => setActiveReceiptModal(null)}
                    >
                      CLOSE RECEIPT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </>
  );
}
