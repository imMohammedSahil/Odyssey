import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --void-black: #060911;
    --glass-bg: rgba(9, 14, 24, 0.52);
    --glass-bg-hover: rgba(14, 21, 35, 0.65);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-border-focus: rgba(255, 255, 255, 0.18);
    --accent-mint: #10B981;
    --accent-amber: #F59E0B;
    --accent-cyan: #06B6D4;
    --accent-violet: #8B5CF6;
    --accent-crimson: #EF4444;
    --text-primary: #F8FAFC;
    --text-secondary: #94A3B8;
    --text-muted: #64748B;
  }

  /* ── FILM NOIR THEMED SIDE SCROLLBAR & THUMB BUTTON ── */
  html::-webkit-scrollbar,
  body::-webkit-scrollbar,
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  html::-webkit-scrollbar-track,
  body::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track {
    background: #050B14;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
  }

  html::-webkit-scrollbar-thumb,
  body::-webkit-scrollbar-thumb,
  ::-webkit-scrollbar-thumb {
    background: #E11618;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(225, 22, 24, 0.45);
    transition: background 0.15s ease, box-shadow 0.15s ease;
  }

  html::-webkit-scrollbar-thumb:hover,
  body::-webkit-scrollbar-thumb:hover,
  ::-webkit-scrollbar-thumb:hover {
    background: #FF1E20;
    box-shadow: 0 0 16px rgba(255, 30, 32, 0.75);
  }

  html::-webkit-scrollbar-thumb:active,
  body::-webkit-scrollbar-thumb:active,
  ::-webkit-scrollbar-thumb:active {
    background: #B80E10;
  }

  html::-webkit-scrollbar-button,
  body::-webkit-scrollbar-button,
  ::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
  }

  html, body, * {
    scrollbar-width: thin;
    scrollbar-color: #E11618 #050B14;
  }

  /* ── FULL SCREEN FIXED BACKDROP ── */
  .ad-bg-layer {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    background: #050B14;
  }

  .ad-bg-vector {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
    filter: brightness(0.85) contrast(1.1);
  }

  .ad-bg-vignette {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 50% 25%, transparent 35%, rgba(5, 11, 20, 0.75) 90%);
    pointer-events: none;
    z-index: 1;
  }

  /* ── MAIN LAYOUT ── */
  .ad-root {
    min-height: 100vh;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--text-primary);
    padding-bottom: 0px !important;
    letter-spacing: 0.01em;
  }

  /* ── MINIMALIST GLASS NAVBAR ── */
  .ad-navbar {
    position: relative;
    z-index: 50;
    height: 60px;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(6, 10, 18, 0.58);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--glass-border);
  }

  .ad-nav-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .ad-btn-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    color: var(--text-secondary);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.15s ease;
    text-transform: uppercase;
  }

  .ad-btn-back:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
    border-color: var(--glass-border-focus);
  }

  .ad-nav-divider {
    width: 1px;
    height: 18px;
    background: var(--glass-border);
  }

  .ad-nav-brand-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ad-nav-brand {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #FFFFFF;
  }

  .ad-nav-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--accent-cyan);
    background: rgba(6, 182, 212, 0.1);
    border: 1px solid rgba(6, 182, 212, 0.25);
    padding: 2px 7px;
    border-radius: 4px;
    text-transform: uppercase;
  }

  .ad-nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ad-nav-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 32px;
    padding: 0 13px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    color: var(--text-secondary);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
    text-transform: uppercase;
  }

  .ad-nav-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
    border-color: var(--glass-border-focus);
    transform: translateY(-1px);
  }

  .ad-nav-btn.is-active {
    background: rgba(225, 22, 24, 0.18);
    color: #FF5A5C;
    border-color: rgba(225, 22, 24, 0.45);
    box-shadow: 0 0 12px rgba(225, 22, 24, 0.25);
  }

  /* ── CREDITS MODAL POPUP ── */
  .ad-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(4, 7, 13, 0.78);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: adFadeIn 0.2s ease;
  }

  @keyframes adFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes adScaleIn {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .ad-credits-modal {
    width: 100%;
    max-width: 550px;
    background: rgba(8, 12, 20, 0.96);
    border: 1px solid var(--glass-border);
    border-radius: 14px;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.9);
    overflow: hidden;
    animation: adScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    color: var(--text-primary);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .ad-modal-header {
    padding: 18px 22px;
    background: rgba(6, 9, 16, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ad-modal-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--accent-crimson);
    text-transform: uppercase;
    display: block;
    margin-bottom: 2px;
  }

  .ad-modal-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: #FFFFFF;
  }

  .ad-modal-close-btn {
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ad-modal-close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #FFFFFF;
  }

  .ad-modal-body {
    padding: 22px;
    max-height: 70vh;
    overflow-y: auto;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-size: 12.5px;
  }

  .ad-tribute-message {
    display: flex;
    flex-direction: column;
    gap: 13px;
    font-size: 13px;
    line-height: 1.7;
    color: #CBD5E1;
    text-wrap: pretty;
  }

  .ad-tribute-salutation {
    text-wrap: balance;
  }

  .ad-tribute-signoff {
    margin-top: 6px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    gap: 3px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #94A3B8;
  }

  .ad-tribute-signoff strong {
    color: #FFFFFF;
    letter-spacing: 0.04em;
    font-size: 11.5px;
  }

  .ad-modal-footer {
    padding: 12px 20px;
    background: rgba(6, 9, 16, 0.95);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .ad-btn-dismiss {
    height: 30px;
    padding: 0 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ad-btn-dismiss:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #FFFFFF;
  }

  /* ── MAIN CONTENT CONTAINER ── */
  .ad-container {
    max-width: 1400px;
    width: 94%;
    margin: 28px auto 0;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* ── TOP DECK / METRICS BAR ── */
  .ad-deck-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .ad-title-group {
    background: var(--glass-bg);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 14px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  }

  .ad-title-group h1 {
    font-size: 21px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #FFFFFF;
    margin-bottom: 0px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  }

  .ad-title-group p {
    font-size: 13px;
    font-weight: 500;
    color: #E2E8F0;
    letter-spacing: 0.01em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
  }

  .ad-metrics-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ad-metric-card {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    padding: 10px 18px;
    display: flex;
    flex-direction: column;
    min-width: 105px;
  }

  .ad-metric-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }

  .ad-metric-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    margin-top: 2px;
  }

  /* ── ORDERS CONSOLE (GLASS TABLE) ── */
  .ad-orders-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: 14px;
    overflow: hidden;
  }

  .ad-panel-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    background: rgba(255, 255, 255, 0.015);
  }

  .ad-panel-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-secondary);
    font-family: 'JetBrains Mono', monospace;
  }

  .ad-filter-pills {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ad-filter-pill {
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ad-filter-pill:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.03);
  }

  .ad-filter-pill.is-active {
    background: rgba(255, 255, 255, 0.07);
    border-color: var(--glass-border);
    color: #FFFFFF;
  }

  /* ── MASONRY DYNAMIC SQUARES GRID ── */
  .ad-orders-masonry {
    display: flex;
    gap: 16px;
    padding: 20px 24px;
    align-items: flex-start;
  }

  .ad-masonry-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }

  .ad-empty-orders {
    width: 100%;
    text-align: center;
    padding: 48px 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }

  .ad-order-card {
    background: rgba(14, 21, 35, 0.72);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 11px;
    transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  }

  .ad-order-card:hover {
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(20, 29, 48, 0.82);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }

  .ad-order-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .ad-order-id-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ad-order-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 0.04em;
  }

  .ad-order-count-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 600;
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.04em;
  }

  .ad-status-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 2px 7px;
    border-radius: 4px;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .ad-status-pill.ready {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: var(--accent-mint);
  }

  .ad-status-pill.printing {
    background: rgba(6, 182, 212, 0.15);
    border: 1px solid rgba(6, 182, 212, 0.35);
    color: var(--accent-cyan);
  }

  .ad-status-pill.pending {
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.35);
    color: var(--accent-amber);
  }

  .ad-order-user {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ad-user-label {
    color: var(--text-muted);
    font-size: 9.5px;
    font-weight: 600;
  }

  .ad-order-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 10px;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .ad-item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 11.5px;
    color: var(--text-primary);
  }

  .ad-item-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ad-item-qty {
    font-family: 'JetBrains Mono', monospace;
    color: var(--text-muted);
    font-size: 10.5px;
    flex-shrink: 0;
  }

  .ad-order-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
  }

  .ad-btn-action {
    flex: 1;
    height: 30px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    border-radius: 6px;
    border: 1px solid var(--glass-border);
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
    text-transform: uppercase;
  }

  .ad-btn-action:hover {
    background: rgba(255, 255, 255, 0.09);
    color: #FFFFFF;
    border-color: var(--glass-border-focus);
  }

  .ad-btn-action.ready-btn:hover {
    background: rgba(16, 185, 129, 0.15);
    color: var(--accent-mint);
    border-color: rgba(16, 185, 129, 0.35);
  }

  .ad-btn-action.tune-btn {
    border-color: rgba(6, 182, 212, 0.25);
    color: var(--accent-cyan);
  }

  .ad-btn-action.tune-btn:hover {
    background: rgba(6, 182, 212, 0.12);
  }

  .ad-empty-orders {
    grid-column: 1 / -1;
    padding: 36px 0;
    text-align: center;
    color: var(--text-muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
  }

  /* ── SECTION 3: THE BOTTOM SMARTPHONE DISPATCH TERMINAL (RESTING FLUSH AT PAGE BOTTOM) ── */
  .ad-terminal-section {
    margin-top: 280px;
    margin-bottom: 0px !important;
    padding-bottom: 0px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    position: relative;
    overflow: hidden;
    line-height: 0;
  }

  /* Hand Holding Phone Mockup */
  .ad-phone-container {
    position: relative;
    width: 100%;
    max-width: 440px;
    aspect-ratio: 1014 / 1292;
    filter: drop-shadow(0px -4px 20px rgba(0,0,0,0.85));
    user-select: none;
    margin-bottom: 0px !important;
    line-height: 0;
    display: block;
    transform: translateX(-36px);
  }

  @media (max-width: 480px) {
    .ad-phone-container {
      max-width: 320px;
      transform: translateX(-16px);
    }
  }

  /* Dynamic React Screen inside phone */
  .ad-phone-screen {
    position: absolute;
    left: 34.615%;
    top: 9.985%;
    width: 47.436%;
    height: 68.189%;
    z-index: 2;
    background: #0B0C10;
    border-radius: 7px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    line-height: normal;
  }

  .ad-phone-frame-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
    display: block;
  }

  /* Phone OS Status Bar */
  .ad-ps-statusbar {
    background: #14161E;
    padding: 3px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8px;
    font-weight: 800;
    color: #8E9AA0;
    border-bottom: 1.5px solid #0D0D0D;
    letter-spacing: 0.04em;
    flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
  }

  .ad-ps-battery-wrap {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .ad-ps-battery-gauge {
    position: relative;
    width: 14px;
    height: 7px;
    border: 1px solid #8E9AA0;
    border-radius: 2px;
    padding: 1px;
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.45);
    box-sizing: border-box;
  }

  .ad-ps-battery-gauge::after {
    content: '';
    position: absolute;
    right: -2.5px;
    top: 1.5px;
    width: 1.5px;
    height: 3px;
    background: #8E9AA0;
    border-radius: 0 1px 1px 0;
  }

  .ad-ps-battery-fill {
    height: 100%;
    border-radius: 1px;
    transition: width 0.3s ease, background-color 0.3s ease;
  }

  .ad-ps-bolt-icon {
    width: 7px;
    height: 7px;
    color: #FACC15;
    display: inline-block;
  }

  /* Phone Chat Header */
  .ad-ps-header {
    background: #171922;
    padding: 6px 9px;
    border-bottom: 2px solid #0D0D0D;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .ad-ps-header-left {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ad-ps-avatar {
    width: 24px;
    height: 24px;
    border: 2px solid #0D0D0D;
    border-radius: 50%;
    overflow: hidden;
    background: #191B22;
    flex-shrink: 0;
  }

  .ad-ps-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .ad-ps-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .ad-ps-name {
    font-size: 9.5px;
    font-weight: 800;
    color: #FFFFFF;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
  }

  .ad-ps-status {
    font-size: 7px;
    font-weight: 600;
    color: var(--accent-mint);
    letter-spacing: 0.04em;
    font-family: 'JetBrains Mono', monospace;
  }

  .ad-ps-channel-select {
    background: #0E1017;
    border: 1px solid #222634;
    border-radius: 4px;
    color: #CBD5E1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    padding: 2px 4px;
    outline: none;
    cursor: pointer;
    max-width: 90px;
  }

  /* Phone Messages Area */
  .ad-ps-messages {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 9px 7px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    background: linear-gradient(rgba(9, 10, 14, 0.2), rgba(9, 10, 14, 0.4)), url('/admin-phone-wallpaper.jpg') center/cover no-repeat;
    scroll-behavior: smooth;
    scrollbar-width: none;
  }

  .ad-ps-messages::-webkit-scrollbar {
    display: none;
  }

  .ad-ps-bubble-row {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .ad-ps-bubble-row.outgoing {
    align-items: flex-end;
  }

  .ad-ps-bubble-row.incoming {
    align-items: flex-start;
  }

  .ad-ps-bubble {
    max-width: 86%;
    padding: 5px 8px;
    border: 1.5px solid #0D0D0D;
    border-radius: 6px;
    font-size: 9.5px;
    font-weight: 600;
    line-height: 1.3;
    position: relative;
    word-break: break-word;
  }

  .ad-ps-bubble.outgoing {
    background: #E11618;
    color: #FFFFFF;
    border: 1px solid rgba(255, 255, 255, 0.16);
    box-shadow: 0 0 8px rgba(225, 22, 24, 0.35);
    border-bottom-right-radius: 1px;
  }

  .ad-ps-bubble.incoming {
    background: rgba(14, 21, 35, 0.85);
    color: #F8FAFC;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
    border-bottom-left-radius: 1px;
  }

  .ad-ps-bubble-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    font-size: 6.5px;
    font-weight: 700;
    margin-top: 3px;
    opacity: 0.8;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Phone Input Area (Locked State) */
  .ad-ps-input-area {
    background: #090B10;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding: 5px 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    opacity: 0.85;
    cursor: not-allowed;
  }

  .ad-ps-input {
    flex: 1;
    height: 24px;
    background: #06070B;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 4px;
    padding: 0 7px;
    font-size: 7.5px;
    font-weight: 600;
    color: #64748B;
    outline: none;
    cursor: not-allowed;
    user-select: none;
    letter-spacing: 0.03em;
    font-family: 'JetBrains Mono', monospace;
  }

  .ad-ps-input::placeholder {
    color: #7E8B9B;
    letter-spacing: 0.04em;
  }

  .ad-ps-send-btn {
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    color: #64748B;
    font-size: 9px;
    font-weight: 800;
    cursor: not-allowed;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    pointer-events: none;
  }
`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const storedUser = sessionStorage.getItem("user") || "PETER PARKER";
  const storedRole = sessionStorage.getItem("role") || "student";
  const isAdminMode = storedRole === "admin";
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Phone Chat Terminal State
  const [chat, setChat] = useState([]);
  const [activeFrequency, setActiveFrequency] = useState(storedUser);
  const [clockTime, setClockTime] = useState("");
  const messagesContainerRef = useRef(null);

  // Status clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Hardware Battery Status Sync via Web Battery API
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    let batteryInstance = null;
    let handleLevel = null;
    let handleCharging = null;

    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      navigator
        .getBattery()
        .then((battery) => {
          batteryInstance = battery;
          const updateBattery = () => {
            setBatteryLevel(Math.round(battery.level * 100));
            setIsCharging(Boolean(battery.charging));
          };
          updateBattery();

          handleLevel = () => updateBattery();
          handleCharging = () => updateBattery();
          battery.addEventListener("levelchange", handleLevel);
          battery.addEventListener("chargingchange", handleCharging);
        })
        .catch(() => {
          setBatteryLevel(98);
        });
    }

    return () => {
      if (batteryInstance) {
        if (handleLevel) batteryInstance.removeEventListener("levelchange", handleLevel);
        if (handleCharging) batteryInstance.removeEventListener("chargingchange", handleCharging);
      }
    };
  }, []);

  // Ambient YouTube Soundtrack (https://youtu.be/by2pM_0Sf8c)
  const hasVisitedAdmin = typeof window !== "undefined" && sessionStorage.getItem("odyssey_admin_visited") === "true";
  const savedAdminMusic = typeof window !== "undefined" ? localStorage.getItem("odyssey_admin_music") : null;

  // First time entering /admin: automatically start music
  // Subsequent visits or refreshes: obey manual sound button state
  const initialMusicOn = !hasVisitedAdmin ? true : (savedAdminMusic === null ? true : savedAdminMusic === "true");

  const [hasAudioStarted, setHasAudioStarted] = useState(initialMusicOn);
  const [isAudioPlaying, setIsAudioPlaying] = useState(initialMusicOn);
  const ytIframeRef = useRef(null);

  useEffect(() => {
    if (!hasVisitedAdmin && typeof window !== "undefined") {
      sessionStorage.setItem("odyssey_admin_visited", "true");
      localStorage.setItem("odyssey_admin_music", "true");
    }
  }, [hasVisitedAdmin]);

  const applyAudioVolume = (vol = 4) => {
    if (ytIframeRef.current && ytIframeRef.current.contentWindow) {
      try {
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "setVolume", args: [vol] }),
          "*"
        );
      } catch (e) {}
    }
  };

  const handleIframeLoad = () => {
    [300, 700, 1200, 2000, 3000].forEach((delay) => {
      setTimeout(() => applyAudioVolume(4), delay);
    });
  };

  // Re-apply low volume whenever YouTube player fires events
  useEffect(() => {
    const handleYTMessage = (event) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data && (data.event === "onReady" || data.event === "infoDelivery")) {
          applyAudioVolume(4);
        }
      } catch (e) {}
    };
    window.addEventListener("message", handleYTMessage);
    return () => window.removeEventListener("message", handleYTMessage);
  }, []);

  // Browser Autoplay fallback: if iframe autoplay is blocked, start smoothly on first user click
  useEffect(() => {
    if (isAudioPlaying) {
      const handleUserGesture = () => {
        applyAudioVolume(4);
        if (ytIframeRef.current && ytIframeRef.current.contentWindow) {
          try {
            ytIframeRef.current.contentWindow.postMessage(
              JSON.stringify({ event: "command", func: "playVideo", args: [] }),
              "*"
            );
          } catch (e) {}
        }
      };
      window.addEventListener("click", handleUserGesture, { once: true, passive: true });
      window.addEventListener("keydown", handleUserGesture, { once: true, passive: true });
      return () => {
        window.removeEventListener("click", handleUserGesture);
        window.removeEventListener("keydown", handleUserGesture);
      };
    }
  }, [isAudioPlaying]);

  const toggleAmbientAudio = () => {
    if (!hasAudioStarted) {
      setHasAudioStarted(true);
      setIsAudioPlaying(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("odyssey_admin_music", "true");
      }
      return;
    }

    if (isAudioPlaying) {
      if (ytIframeRef.current && ytIframeRef.current.contentWindow) {
        try {
          ytIframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
            "*"
          );
        } catch (e) {}
      }
      setIsAudioPlaying(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("odyssey_admin_music", "false");
      }
    } else {
      if (ytIframeRef.current && ytIframeRef.current.contentWindow) {
        try {
          applyAudioVolume(4);
          ytIframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "playVideo", args: [] }),
            "*"
          );
        } catch (e) {}
      }
      setIsAudioPlaying(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("odyssey_admin_music", "true");
      }
    }
  };

  // Credits Modal State & Keyboard Escape handler
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowCreditsModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Responsive Masonry column count (desktop: 4, large: 3, tablet: 2, mobile: 1)
  const [columnsCount, setColumnsCount] = useState(4);

  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      if (w < 680) setColumnsCount(1);
      else if (w < 1080) setColumnsCount(2);
      else if (w < 1440) setColumnsCount(3);
      else setColumnsCount(4);
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  // Sync orders from API & local storage
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      const serverOrders = Array.isArray(res.data) ? res.data : [];
      const localOrders = JSON.parse(localStorage.getItem("odysseyOrders")) || [];

      const combined = [...serverOrders];
      localOrders.forEach((lo) => {
        const loId = lo.orderId || lo._id;
        const exists = combined.some(
          (so) => (so._id && so._id === loId) || (so.orderNumber && so.orderNumber === loId)
        );
        if (!exists) {
          combined.push({
            _id: loId || `OD-${Date.now()}`,
            user: lo.user || storedUser,
            studentName: lo.studentName || storedUser,
            stationeryItems: lo.items || [],
            status: lo.status || "PENDING",
            createdAt: lo.date || new Date().toISOString(),
          });
        }
      });
      setOrders(combined);
    } catch (err) {
      const localOrders = JSON.parse(localStorage.getItem("odysseyOrders")) || [];
      setOrders(
        localOrders.map((lo) => ({
          _id: lo.orderId || `OD-${Date.now()}`,
          user: lo.user || storedUser,
          studentName: lo.studentName || storedUser,
          stationeryItems: lo.items || [],
          status: lo.status || "PENDING",
          createdAt: lo.date || new Date().toISOString(),
        }))
      );
    }
  };

  const updateStatus = async (id, status) => {
    if (!isAdminMode) return;
    try {
      await axios.patch(`http://localhost:5000/api/orders/${id}/status`, { status });
      fetchOrders();

      const localOrders = JSON.parse(localStorage.getItem("odysseyOrders")) || [];
      const updated = localOrders.map((o) =>
        o.orderId === id || o._id === id ? { ...o, status: status.toUpperCase() } : o
      );
      localStorage.setItem("odysseyOrders", JSON.stringify(updated));
    } catch (err) {
      console.warn("Status patch failed", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time Chat Sync
  const loadChat = () => {
    try {
      const stored = localStorage.getItem("odysseyChat");
      if (stored) {
        setChat(JSON.parse(stored));
      } else {
        setChat([]);
      }
    } catch (e) {
      setChat([]);
    }
  };

  useEffect(() => {
    loadChat();
    const handleStorage = (e) => {
      if (e.key === "odysseyChat") loadChat();
    };
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(loadChat, 600);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Distinct Student Frequencies available in dispatch
  const studentFrequencies = [
    ...new Set(
      chat
        .filter((msg) => msg.sender !== "Admin")
        .map((msg) => msg.name)
        .filter(
          (n) => n && n.trim() !== "" && n.toLowerCase() !== "admin" && n.toLowerCase() !== "student"
        )
    ),
  ];

  if (!studentFrequencies.includes(storedUser) && storedUser) {
    studentFrequencies.unshift(storedUser);
  }

  // Active channel for Admin terminal
  const currentFrequency = isAdminMode ? (activeFrequency || storedUser) : storedUser;

  // Filter messages for active frequency
  const frequencyMessages = chat.filter((msg) => {
    const freq = (currentFrequency || "Student").toLowerCase();
    const msgName = (msg.name || "").toLowerCase();
    const sender = (msg.sender || "").toLowerCase();
    return msgName === freq || sender === freq;
  });

  // Auto scroll chat
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [frequencyMessages.length]);


  // Filtered orders for console view
  const userFilteredOrders = isAdminMode
    ? orders
    : orders.filter((order) => {
        const owner = (order.user || order.username || order.studentName || "").toLowerCase().trim();
        const current = storedUser.toLowerCase().trim();
        return owner === current || owner === "" || current === "peter parker";
      });

  const displayedOrders = userFilteredOrders.filter((order) => {
    if (activeFilter === "ALL") return true;
    const s = (order.status || "PENDING").toUpperCase();
    return s === activeFilter;
  });

  const countTotal = userFilteredOrders.length;
  const countPrinting = userFilteredOrders.filter((o) => (o.status || "").toUpperCase() === "PRINTING").length;
  const countReady = userFilteredOrders.filter((o) => (o.status || "").toUpperCase() === "READY").length;

  const masonryColumns = Array.from({ length: columnsCount }, () => []);
  displayedOrders.forEach((order, idx) => {
    masonryColumns[idx % columnsCount].push(order);
  });

  return (
    <>
      <style>{styles}</style>

      {/* ── 1. FIXED GLASS VECTOR BACKDROP (FILM NOIR ALLEY) ── */}
      <div className="ad-bg-layer" aria-hidden="true">
        <img
          src="/film-noir-alley.svg"
          alt="Film Noir Vector Landscape"
          className="ad-bg-vector"
        />
      </div>
      <div className="ad-bg-vignette" aria-hidden="true" />

      {/* ── 2. MAIN APPLICATION LAYER ── */}
      <div className="ad-root">
        {/* TOP MINIMALIST GLASS NAVIGATION */}
        <header className="ad-navbar">
          <div className="ad-nav-left">
            <button
              className="ad-btn-back"
              onClick={() => navigate("/student")}
            >
              ← BASECAMP
            </button>

            <div className="ad-nav-divider" />

            <div className="ad-nav-brand-wrap">
              <span className="ad-nav-brand">ODYSSEY</span>
              <span className="ad-nav-badge">
                {isAdminMode ? "ADMIN TERMINAL" : `VIEW ONLY · @${storedUser}`}
              </span>
            </div>
          </div>

          {/* RIGHT ACTION BUTTONS: SOUND & CREDITS */}
          <div className="ad-nav-right">
            <button
              type="button"
              className={`ad-nav-btn ${isAudioPlaying ? "is-active" : ""}`}
              onClick={toggleAmbientAudio}
            >
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {isAudioPlaying ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </>
                ) : (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                )}
              </svg>
              <span>{isAudioPlaying ? "SOUND: ON" : "SOUND: OFF"}</span>
            </button>

            <button
              type="button"
              className="ad-nav-btn credits-btn"
              onClick={() => setShowCreditsModal(true)}
            >
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>CREDITS</span>
            </button>
          </div>
        </header>

        {/* MAIN COMMAND CONTAINER */}
        <main className="ad-container">
          {/* DECK HEADER & METRICS COUNTERS */}
          <section className="ad-deck-header">
            <div className="ad-title-group">
              <h1>DISPATCH & PRODUCTION MANIFEST</h1>
              <p>
                {isAdminMode
                  ? "Real-time order pipeline and bi-directional terminal dispatch."
                  : `Authenticated cadet session (@${storedUser}). Showing private manifest.`}
              </p>
            </div>

            <div className="ad-metrics-row">
              <div className="ad-metric-card">
                <span className="ad-metric-label">TOTAL</span>
                <span className="ad-metric-value">{countTotal}</span>
              </div>
              <div className="ad-metric-card">
                <span className="ad-metric-label">PRINTING</span>
                <span className="ad-metric-value" style={{ color: "var(--accent-cyan)" }}>
                  {countPrinting}
                </span>
              </div>
              <div className="ad-metric-card">
                <span className="ad-metric-label">READY</span>
                <span className="ad-metric-value" style={{ color: "var(--accent-mint)" }}>
                  {countReady}
                </span>
              </div>
            </div>
          </section>

          {/* ORDERS CONSOLE PANEL */}
          <section className="ad-orders-panel">
            <div className="ad-panel-header">
              <span className="ad-panel-title">
                {isAdminMode ? "PRODUCTION PIPELINE" : "PERSONAL MANIFEST"}
              </span>

              <div className="ad-filter-pills">
                {["ALL", "PENDING", "READY"].map((filter) => (
                  <button
                    key={filter}
                    className={`ad-filter-pill ${activeFilter === filter ? "is-active" : ""}`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="ad-orders-masonry">
              {displayedOrders.length === 0 ? (
                <div className="ad-empty-orders">
                  NO ORDERS FOUND MATCHING FILTER CRITERIA
                </div>
              ) : (
                masonryColumns.map((col, colIdx) => (
                  <div key={colIdx} className="ad-masonry-col">
                    {col.map((order) => {
                      const student = order.user || order.username || order.studentName || storedUser;
                      const rawStatus = (order.status || "PENDING").toLowerCase();
                      const statusClass = rawStatus === "ready" ? "ready" : rawStatus === "printing" ? "printing" : "pending";
                      const items = order.stationeryItems || [];
                      const totalQty = items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);

                      return (
                        <div key={order._id} className="ad-order-card">
                          <div className="ad-order-head">
                            <div className="ad-order-id-wrap">
                              <span className="ad-order-id">#{String(order._id).slice(-8)}</span>
                              <span className="ad-order-count-pill">
                                {totalQty} {totalQty === 1 ? "ITEM" : "ITEMS"}
                              </span>
                            </div>
                            <span className={`ad-status-pill ${statusClass}`}>
                              {order.status || "PENDING"}
                            </span>
                          </div>

                          <div className="ad-order-user">
                            <span className="ad-user-label">CADET:</span> @{student}
                          </div>

                          {items.length > 0 && (
                            <div className="ad-order-items">
                              {items.map((item, i) => (
                                <div key={i} className="ad-item-row">
                                  <span className="ad-item-name">{item.name}</span>
                                  <span className="ad-item-qty">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="ad-order-actions">
                            {isAdminMode ? (
                              <>
                                <button
                                  className="ad-btn-action"
                                  onClick={() => updateStatus(order._id, "printing")}
                                >
                                  PRINT
                                </button>
                                <button
                                  className="ad-btn-action ready-btn"
                                  onClick={() => updateStatus(order._id, "ready")}
                                >
                                  READY
                                </button>
                                <button
                                  className="ad-btn-action tune-btn"
                                  onClick={() => setActiveFrequency(student)}
                                >
                                  TUNE PHONE
                                </button>
                              </>
                            ) : (
                              <button
                                className="ad-btn-action tune-btn"
                                onClick={() => setActiveFrequency(storedUser)}
                              >
                                OPEN PHONE CHANNEL
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        {/* ── SECTION 3: THE SMARTPHONE DISPATCH TERMINAL (RESTING FLUSH AT PAGE BOTTOM) ── */}
        <section className="ad-terminal-section">
          <div className="ad-phone-container">
            {/* Dynamic Interactive React Screen inside phone */}
            <div className="ad-phone-screen">
              {/* Status Bar */}
              <div className="ad-ps-statusbar">
                <span>{clockTime || "12:00"}</span>
                <div className="ad-ps-battery-wrap">
                  {isCharging && (
                    <svg className="ad-ps-bolt-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M13 2L4 14h7l-2 8 11-12h-7l2-8z" />
                    </svg>
                  )}
                  <span>{batteryLevel}%</span>
                  <div className="ad-ps-battery-gauge">
                    <div
                      className="ad-ps-battery-fill"
                      style={{
                        width: `${Math.max(10, Math.min(100, batteryLevel))}%`,
                        backgroundColor: batteryLevel <= 20 ? "#EF4444" : isCharging ? "#10B981" : "#8E9AA0",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Header: Displays Cadet Peter Parker & Photo */}
              <div className="ad-ps-header">
                <div className="ad-ps-header-left">
                  <div className="ad-ps-avatar">
                    <img
                      src={localStorage.getItem("profile_photo") || "/avatar.jpg"}
                      alt="Cadet Peter Parker"
                      className="ad-ps-avatar-img"
                    />
                  </div>
                  <div className="ad-ps-info">
                    <span className="ad-ps-name">PETER PARKER</span>
                    <span className="ad-ps-status">ONLINE · CADET DESK 04</span>
                  </div>
                </div>
              </div>

              {/* Messages: Peter Parker on LEFT (Incoming), Chief Librarian on RIGHT (Outgoing) */}
              <div ref={messagesContainerRef} className="ad-ps-messages">
                <div className="ad-ps-bubble-row incoming">
                  <div className="ad-ps-bubble incoming">
                    <div>Terminal online. Transmission channel linked to @{storedUser}.</div>
                    <div className="ad-ps-bubble-meta">
                      <span>SYSTEM</span>
                      <span>LINKED</span>
                    </div>
                  </div>
                </div>

                {frequencyMessages.map((msg, idx) => {
                  const isLibrarian = msg.sender === "Admin" || msg.sender === "Chief Librarian";
                  const isOutgoing = isLibrarian;

                  return (
                    <div
                      key={idx}
                      className={`ad-ps-bubble-row ${isOutgoing ? "outgoing" : "incoming"}`}
                    >
                      <div className={`ad-ps-bubble ${isOutgoing ? "outgoing" : "incoming"}`}>
                        <div>{msg.text}</div>
                        <div className="ad-ps-bubble-meta">
                          <span>
                            {isOutgoing
                              ? "CHIEF LIBRARIAN"
                              : `@${msg.sender || "PETER PARKER"}`}
                          </span>
                          <span>{msg.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Locked Input Area: Archival View Only */}
              <div className="ad-ps-input-area">
                <input
                  className="ad-ps-input"
                  value=""
                  readOnly
                  disabled
                  placeholder="CHANNEL LOCKED"
                />
                <button
                  type="button"
                  className="ad-ps-send-btn"
                  disabled
                  aria-label="Channel Locked"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Hand Holding Smartphone Frame Image */}
            <img
              src="/hand-phone-clean.png"
              alt="Hand holding phone dispatch"
              className="ad-phone-frame-img"
            />
          </div>
        </section>

        {/* ── CREDITS & SYSTEM SPEC POPUP MODAL ── */}
        {showCreditsModal && (
          <div
            className="ad-modal-overlay"
            onClick={() => setShowCreditsModal(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="ad-credits-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ad-modal-header">
                <div>
                  <span className="ad-modal-tag">INSPIRATION & GRATITUDE</span>
                  <h2 className="ad-modal-title">A TRIBUTE TO &ldquo;TEARS IN THE RAIN&rdquo;</h2>
                </div>
                <button
                  type="button"
                  className="ad-modal-close-btn"
                  onClick={() => setShowCreditsModal(false)}
                  aria-label="Close Tribute Modal"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="ad-modal-body">
                <div className="ad-tribute-message">
                  <p className="ad-tribute-salutation">
                    To Hans Zimmer, Benjamin Wallfisch, and the timeless vision of Vangelis:
                  </p>

                  <p>
                    This piece of music became the beating heart of Odyssey. During late nights of building, when everything else went quiet, these haunting chords, the gentle murmur of distant rain, and the slow, aching synth swells gave life to every pixel, shadow, and line of code on this screen.
                  </p>

                  <p>
                    It inspired far more than just the aesthetics of this rain-slicked alleyway — it carried the very spirit of solitude, focus, and quiet passion that brought this project to life.
                  </p>

                  <p>
                    Thank you for creating something so timeless, evocative, and deeply moving. Your art gave this terminal its soul, and for that, I am endlessly grateful.
                  </p>

                  <div className="ad-tribute-signoff">
                    <span>— With deepest gratitude,</span>
                    <strong>Mohammed Sahil</strong>
                    <span style={{ fontSize: "10px", color: "#64748B" }}>Creator of Odyssey</span>
                  </div>
                </div>
              </div>

              <div className="ad-modal-footer">
                <button
                  type="button"
                  className="ad-btn-dismiss"
                  onClick={() => setShowCreditsModal(false)}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ── YOUTUBE AMBIENT AUDIO STREAM (https://youtu.be/by2pM_0Sf8c) ── */}
        {hasAudioStarted && (
          <iframe
            ref={ytIframeRef}
            id="odyssey-ambient-yt"
            width="1"
            height="1"
            src="https://www.youtube-nocookie.com/embed/by2pM_0Sf8c?autoplay=1&enablejsapi=1&loop=1&playlist=by2pM_0Sf8c"
            title="Film Noir Ambient Soundtrack"
            allow="autoplay"
            onLoad={handleIframeLoad}
            style={{
              position: "fixed",
              bottom: 0,
              right: 0,
              width: "1px",
              height: "1px",
              opacity: 0.001,
              pointerEvents: "none",
              border: "none",
              zIndex: -10,
            }}
          />
        )}
      </div>
    </>
  );
}