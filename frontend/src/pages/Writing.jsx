import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Caveat:wght@700&family=Playball&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Titan+One&display=swap');

  :root {
    /* Core Odyssey Design System Tokens (THEME_SPEC.md) */
    --slime-green: #9DE869;
    --slime-green-dark: #78D83F;
    --void-black: #0D0D0D;
    --seafoam: #45B89E;
    --hazard-gold: #F7B919;
    --hazard-gold-light: #FFCE38;
    --brain-pink: #FF70A6;
    --parchment: #F9F9F3;
    --grave-grey: #A8B3B8;
    --pure-white: #FFFFFF;
    --card-cream: #F9F9F3;

    /* Theme Tokens for Ticket Cards */
    --frank-green: #14281E;
    --frank-dark-green: #0C1A13;
    --frank-brain-pink: #FF70A6;
    --mummy-cream: #F9F9F3;
    --mummy-cream-shade: #EBE5D8;
    --mummy-yellow: #F7B919;
    --mummy-yellow-glow: #FFDE59;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .writing-page-shell {
    min-height: 100vh;
    background-color: #0D0D0D;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #F9F9F3;
    padding-bottom: 70px;
    position: relative;
    overflow-x: clip;
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
    background-color: #AE520F;
  }

  .writing-bg-vector {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center bottom;
    display: block;
  }

  .writing-bg-vignette {
    display: none;
  }

  /* TOP RETRO-COMIC HEADER BAR */
  .writing-header-bar {
    width: 100%;
    box-sizing: border-box;
    background: rgba(13, 13, 13, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 4px solid var(--void-black);
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
    position: sticky;
    top: 0;
    z-index: 50;
    contain: layout paint;
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
    user-select: none;
    cursor: default;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .writing-brand-icon-circle {
    width: 38px;
    height: 38px;
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
    white-space: nowrap;
  }

  .writing-brand-title span {
    color: var(--slime-green);
  }

  .writing-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
    flex-shrink: 0;
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
    background: var(--slime-green);
    color: var(--void-black);
    border-color: var(--void-black);
  }

  .writing-cart-pill:hover {
    background: #AEF37B;
  }

  /* HERO HEADER BANNER */
  .writing-hero-header-banner {
    width: 100%;
    max-width: 1200px;
    margin: 28px auto 6px auto;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 5;
  }

  .writing-hero-badge {
    background: var(--hazard-gold);
    color: var(--void-black);
    border: 3px solid var(--void-black);
    border-radius: 9999px;
    padding: 6px 16px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    box-shadow: 4px 4px 0px var(--void-black);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .writing-pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--slime-green);
    box-shadow: 0 0 8px var(--slime-green);
    animation: pulseGlow 1.6s infinite ease-in-out;
  }

  @keyframes pulseGlow {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.35); opacity: 0.7; }
  }

  .writing-hero-h1 {
    font-family: 'Titan One', 'Archivo Black', cursive;
    font-size: clamp(30px, 4.2vw, 50px);
    color: #FFFFFF;
    text-transform: uppercase;
    letter-spacing: 1px;
    line-height: 1.08;
    text-shadow: 4px 4px 0px #000000, -2px -2px 0px #000000, 2px -2px 0px #000000, -2px 2px 0px #000000;
    margin-bottom: 8px;
  }

  .writing-hero-p {
    font-size: clamp(13px, 1.5vw, 15px);
    font-weight: 700;
    color: #E2E8F0;
    max-width: 680px;
    line-height: 1.45;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9);
  }

  /* MAIN STAGE & DUAL-CARD GRID */
  .writing-layout-container {
    max-width: 1200px;
    margin: 22px auto 40px auto;
    padding: 0 16px;
    position: relative;
    z-index: 5;
  }

  .writing-cards-stage {
    display: grid;
    grid-template-columns: 1fr 1.08fr;
    gap: 28px;
    align-items: stretch;
  }

  @media (max-width: 980px) {
    .writing-cards-stage {
      grid-template-columns: 1fr;
      gap: 36px;
    }
  }

  /* BASE TICKET CARD STYLING */
  .writing-ticket-card {
    border: 4px solid var(--void-black);
    border-radius: 32px;
    box-shadow: 7px 7px 0px var(--void-black);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .writing-ticket-card:hover {
    box-shadow: 9px 9px 0px var(--void-black);
  }

  /* SCRIPT "Trick or treat" ACCENTS */
  .writing-script-callout {
    font-family: 'Playball', 'Caveat', cursive;
    font-size: 28px;
    line-height: 1.1;
    color: var(--void-black);
    letter-spacing: 0.5px;
    text-align: center;
    user-select: none;
  }

  /* TICKET PERFORATION & NOTCHES */
  .writing-ticket-perforation {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    margin: 18px 0 14px 0;
    user-select: none;
    z-index: 10;
  }

  .writing-ticket-dashed-line {
    flex: 1;
    border-top: 3.5px dashed var(--void-black);
    height: 0;
    margin: 0 14px;
    opacity: 0.85;
  }

  .writing-ticket-notch {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--void-black);
    border: 4px solid var(--void-black);
    z-index: 12;
    top: 50%;
    transform: translateY(-50%);
  }

  .writing-ticket-notch-left {
    left: -20px;
    box-shadow: inset -2px 0 0 rgba(0, 0, 0, 0.15);
  }

  .writing-ticket-notch-right {
    right: -20px;
    box-shadow: inset 2px 0 0 rgba(0, 0, 0, 0.15);
  }

  /* TICKET STUB HEADER IN BOTTOM ZONE */
  .writing-stub-meta-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    user-select: none;
  }

  .writing-stub-title-cursive {
    font-family: 'Playball', 'Caveat', cursive;
    font-size: 29px;
    color: var(--void-black);
    line-height: 1;
  }

  .writing-stub-meta-col {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .writing-stub-badge-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    font-family: 'Archivo Black', sans-serif;
    font-size: 9px;
    color: var(--void-black);
    background: rgba(0, 0, 0, 0.08);
    padding: 3px 6px;
    border-radius: 6px;
    border: 1.5px solid var(--void-black);
  }

  .writing-stub-bold-party {
    font-family: 'Titan One', cursive;
    font-size: 19px;
    color: var(--void-black);
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  /* ========================================================
     CARD 1: FRANKENSTEIN / ZOMBIE THEMED TICKET
     ======================================================== */
  .writing-frankenstein-card {
    background-color: var(--frank-green);
    background-image: 
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E"),
      radial-gradient(rgba(255, 255, 255, 0.14) 1.5px, transparent 1.5px);
    background-size: 160px 160px, 16px 16px;
    color: #FFFFFF;
    position: relative;
  }

  /* Top Brain Header - Fully Framed Dome */
  .writing-frank-brain-box {
    position: relative;
    width: 100%;
    background: transparent;
    padding-top: 10px;
    z-index: 2;
  }

  .writing-frank-brain-svg {
    width: 100%;
    height: 120px;
    display: block;
    overflow: visible;
  }

  /* Forehead & Face Area */
  .writing-frank-face-zone {
    padding: 4px 24px 10px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .writing-frank-forehead-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .writing-frank-stitches {
    display: flex;
    align-items: center;
    gap: 4px;
    user-select: none;
  }

  /* Additional Torso Stitch on Frankenstein Body */
  .writing-frank-side-stitch {
    position: absolute;
    right: 12px;
    top: 48%;
    transform: translateY(-50%) rotate(12deg);
    pointer-events: none;
    z-index: 1;
    opacity: 0.75;
  }

  /* EYES CONTAINER */
  .writing-frank-eyes-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 22px;
    margin: 4px 0 10px 0;
    cursor: pointer;
  }

  .writing-eye-socket {
    position: relative;
    overflow: hidden;
    background: #FFFFFF;
    border: 3.8px solid var(--void-black);
    box-shadow: 2px 3px 0px rgba(0, 0, 0, 0.35);
  }

  /* Frank Eye Socket Shape */
  .frank-eye-socket {
    width: 88px;
    height: 98px;
    border-radius: 46% 46% 48% 48%;
  }

  /* Droopy Green Eyelids */
  .writing-frank-eyelid {
    position: absolute;
    top: 0;
    left: -2px;
    right: -2px;
    height: 48%;
    background-color: var(--frank-green);
    border-bottom: 3.8px solid var(--void-black);
    border-radius: 46% 46% 0 0;
    z-index: 5;
    transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-origin: top center;
    pointer-events: none;
  }

  .frank-eyelid-left {
    transform: rotate(-3deg);
  }

  .frank-eyelid-right {
    transform: rotate(4deg);
  }

  .writing-frank-eyelid-crease {
    position: absolute;
    top: 30%;
    left: 15%;
    right: 15%;
    height: 2px;
    background: rgba(13, 13, 13, 0.35);
    border-radius: 999px;
  }

  /* Pupil */
  .writing-pupil {
    position: absolute;
    border-radius: 50%;
    background: var(--void-black);
    z-index: 3;
    transition: transform 0.16s ease-out, filter 0.16s ease;
  }

  .frank-pupil {
    width: 32px;
    height: 32px;
    top: 36px;
    left: 28px;
  }

  .frank-pupil-left {
    transform: translate(3px, 1px);
  }

  .frank-pupil-right {
    transform: translate(6px, -4px);
  }

  .writing-pupil-shine {
    position: absolute;
    top: 5px;
    right: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #FFFFFF;
  }

  .frank-under-crease {
    position: absolute;
    bottom: 5px;
    left: 20%;
    right: 20%;
    height: 2.5px;
    background: rgba(13, 13, 13, 0.4);
    border-radius: 999px;
  }

  /* Eye Hover Interactions (Frankenstein) */
  .writing-frank-eyes-row:hover .writing-frank-eyelid {
    transform: translateY(-8px) scaleY(0.85);
  }

  .writing-frank-eyes-row:hover .frank-pupil {
    transform: scale(1.15) translate(4px, 0px);
  }

  /* Nostrils */
  .writing-frank-nostrils {
    margin-top: 2px;
    display: flex;
    justify-content: center;
    user-select: none;
  }

  /* Frankenstein Card Middle Content Area */
  .writing-frank-body {
    padding: 10px 24px 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    position: relative;
    z-index: 2;
  }

  .writing-hero-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    flex-wrap: wrap;
  }

  .writing-starburst-badge {
    align-self: flex-start;
    background: var(--hazard-gold-light);
    border: 3.5px solid var(--void-black);
    border-radius: 16px;
    box-shadow: 4px 4px 0px var(--void-black);
    padding: 8px 16px;
    position: relative;
    transform: rotate(-1.5deg);
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }

  .writing-starburst-protocol {
    font-family: 'Archivo Black', sans-serif;
    font-size: 8.5px;
    color: var(--void-black);
    background: rgba(0, 0, 0, 0.12);
    padding: 2px 8px;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .writing-starburst-text {
    font-family: 'Titan One', cursive;
    font-size: 19px;
    color: var(--void-black);
    letter-spacing: 0.5px;
    line-height: 1.15;
    margin: 0;
  }

  .writing-hero-status-pill {
    background: var(--void-black);
    border: 2.5px solid var(--void-black);
    border-radius: 9999px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    color: var(--slime-green);
    letter-spacing: 0.5px;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.4);
  }

  .writing-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--slime-green);
    box-shadow: 0 0 6px var(--slime-green);
  }

  .writing-lore-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .writing-lore-item {
    background: rgba(28, 59, 36, 0.9);
    backdrop-filter: blur(4px);
    border: 2.5px solid var(--void-black);
    border-radius: 14px;
    padding: 10px 12px;
    box-shadow: 3px 3px 0px var(--void-black);
    font-size: 12.5px;
    line-height: 1.35;
    font-weight: 500;
    color: #E2E8F0;
  }

  .writing-lore-item strong {
    color: var(--hazard-gold-light);
    font-weight: 800;
    display: block;
    margin-bottom: 3px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    letter-spacing: 0.5px;
  }

  /* 4-QUADRANT STATS MATRIX */
  .writing-spec-matrix {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .writing-spec-tile {
    background: rgba(28, 59, 36, 0.9);
    backdrop-filter: blur(4px);
    border: 2.5px solid var(--void-black);
    border-radius: 12px;
    padding: 8px 10px;
    box-shadow: 2.5px 2.5px 0px var(--void-black);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .writing-spec-tile-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 8.5px;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .writing-spec-tile-val {
    font-family: 'Archivo Black', sans-serif;
    font-size: 10.5px;
    color: #FFFFFF;
    text-transform: uppercase;
  }

  .writing-spec-tile-val.accent-green {
    color: var(--slime-green);
  }

  .writing-spec-tile-val.accent-gold {
    color: var(--hazard-gold-light);
  }

  /* SURVIVOR FIELD MEMO DISPATCH */
  .writing-field-dispatch {
    background: #FFFBEB;
    border: 2.5px solid var(--void-black);
    border-radius: 14px;
    padding: 8px 12px;
    font-size: 11px;
    line-height: 1.35;
    color: var(--void-black);
    display: flex;
    gap: 10px;
    align-items: center;
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-dispatch-badge {
    background: var(--brain-pink);
    color: var(--void-black);
    font-family: 'Archivo Black', sans-serif;
    font-size: 9px;
    padding: 3px 7px;
    border-radius: 6px;
    border: 1.5px solid var(--void-black);
    text-transform: uppercase;
    font-weight: 800;
    flex-shrink: 0;
  }

  /* Frankenstein Card Bottom Stub */
  .writing-frank-bottom-stub {
    padding: 0 24px 22px 24px;
    position: relative;
    z-index: 2;
  }

  .writing-arcade-controller {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--void-black);
    border: 3.5px solid var(--void-black);
    border-radius: 18px;
    padding: 8px 14px;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.4);
  }

  .writing-arcade-arrow-btn {
    width: 44px;
    height: 40px;
    background: #233426;
    border: 2.5px solid var(--void-black);
    border-radius: 10px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 16px;
    color: #FFFFFF;
    cursor: pointer;
    box-shadow: 2px 2px 0px var(--void-black);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
  }

  .writing-arcade-arrow-btn:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px var(--void-black);
    background: #2E4733;
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
    background: var(--slime-green);
  }

  .writing-track-bar {
    flex: 1;
    height: 10px;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid var(--void-black);
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
  }

  .writing-track-fill {
    height: 100%;
    background: var(--slime-green);
    border-radius: 9999px;
    transition: width 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .writing-arcade-counter {
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--slime-green);
    white-space: nowrap;
    padding: 0 4px;
  }

  /* ========================================================
     CARD 2: MUMMY THEMED TICKET (WORKBENCH)
     ======================================================== */
  .writing-mummy-card {
    background-color: var(--mummy-cream);
    background-image: 
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
    background-size: 160px 160px;
    color: var(--void-black);
    position: relative;
  }

  /* FULL-BODY MUMMY BANDAGES VECTOR BACKDROP */
  .writing-mummy-bandages-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  /* Top Mummy Bandage Header */
  .writing-mummy-top-wrap {
    position: relative;
    width: 100%;
    padding: 22px 24px 8px 24px;
    z-index: 2;
  }

  /* Slit Aperture Revealing Mummy Eyes */
  .writing-mummy-eye-aperture {
    position: relative;
    padding: 10px 24px 18px 24px;
    z-index: 2;
  }

  .writing-mummy-slit-frame {
    position: relative;
    display: inline-block;
    padding: 10px 24px 14px 24px;
    background: #231F19;
    border: 3.5px solid var(--void-black);
    border-radius: 9999px;
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.4);
  }

  .writing-mummy-eyes-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    position: relative;
    cursor: pointer;
  }

  /* Mummy Yellow Eye Socket Shape */
  .mummy-eye-socket {
    width: 92px;
    height: 84px;
    border-radius: 50% 50% 48% 48%;
    background: radial-gradient(circle at 35% 35%, #FFE169 0%, #FFB703 60%, #FB8500 100%);
    box-shadow: 0 0 10px rgba(255, 183, 3, 0.45);
    transition: box-shadow 0.2s ease, filter 0.2s ease;
    border: 3.8px solid var(--void-black);
    position: relative;
    overflow: hidden;
  }

  .mummy-pupil {
    width: 28px;
    height: 28px;
    top: 30px;
    left: 28px;
  }

  .mummy-pupil-left {
    transform: translate(-3px, 2px);
  }

  .mummy-pupil-right {
    transform: translate(-2px, 2px);
  }

  /* Mummy Eye Crease Folds */
  .mummy-crease-top {
    position: absolute;
    top: 4px;
    left: 15%;
    right: 15%;
    height: 2.5px;
    background: rgba(13, 13, 13, 0.4);
    border-radius: 999px;
  }

  .mummy-crease-bottom {
    position: absolute;
    bottom: 6px;
    left: 20%;
    right: 20%;
    height: 2px;
    background: rgba(13, 13, 13, 0.35);
    border-radius: 999px;
  }

  /* Eye Hover Interactions (Mummy) */
  .writing-mummy-eyes-row:hover .mummy-eye-socket {
    box-shadow: 0 0 18px rgba(255, 183, 3, 0.85);
    filter: brightness(1.06);
  }

  .writing-mummy-eyes-row:hover .mummy-pupil {
    transform: scale(1.15) translate(-4px, -2px);
  }

  /* Mummy Card Middle Content Area */
  .writing-mummy-body {
    padding: 10px 24px 12px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    position: relative;
    z-index: 2;
  }

  .writing-sec-header {
    border-bottom: 3.5px solid var(--void-black);
    padding-bottom: 10px;
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
    background: var(--brain-pink);
    color: var(--void-black);
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 9999px;
    border: 2px solid var(--void-black);
    text-transform: uppercase;
    box-shadow: 2px 2px 0px var(--void-black);
  }

  /* CATEGORY TABS */
  .writing-cat-row {
    display: flex;
    gap: 8px;
  }

  .writing-cat-btn {
    flex: 1;
    background: rgba(255, 255, 255, 0.95);
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
    background: #FFF9D2;
  }

  .writing-cat-btn.active {
    background: var(--slime-green);
    color: var(--void-black);
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--void-black);
  }

  /* FIELD BOXES & LABELS */
  .writing-field-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .writing-field-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--void-black);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* MODEL SELECTION GRID */
  .writing-models-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  @media (max-width: 640px) {
    .writing-models-grid {
      grid-template-columns: 1fr;
    }
  }

  .writing-model-btn {
    background: rgba(255, 255, 255, 0.95);
    border: 2.5px solid var(--void-black);
    border-radius: 12px;
    padding: 10px 12px;
    cursor: pointer;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 3px;
    box-shadow: 2px 2px 0px var(--void-black);
    transition: all 0.1s ease;
    position: relative;
  }

  .writing-model-btn:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px var(--void-black);
    background: #FFFBE6;
  }

  .writing-model-btn.active {
    background: var(--hazard-gold-light);
    border-color: var(--void-black);
    transform: translate(1.5px, 1.5px);
    box-shadow: 0px 0px 0px var(--void-black);
  }

  .writing-model-name {
    font-family: 'Archivo Black', sans-serif;
    font-size: 12px;
    color: var(--void-black);
  }

  .writing-model-tag {
    font-size: 10px;
    color: #4B5563;
    font-weight: 600;
  }

  .writing-model-price {
    font-family: 'Titan One', cursive;
    font-size: 13px;
    color: #B45309;
    margin-top: 2px;
  }

  /* PILL OPTIONS (TYPE, GRADES) */
  .writing-pill-options {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .writing-pill-btn {
    flex: 1;
    min-width: 100px;
    background: rgba(255, 255, 255, 0.95);
    border: 2.5px solid var(--void-black);
    border-radius: 9999px;
    padding: 8px 14px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--void-black);
    cursor: pointer;
    text-align: center;
    box-shadow: 2px 2px 0px var(--void-black);
    transition: all 0.1s ease;
  }

  .writing-pill-btn:hover {
    background: #FFFBE6;
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-pill-btn.active {
    background: var(--slime-green);
    color: var(--void-black);
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px var(--void-black);
  }

  /* COLOR SWATCHES */
  .writing-colors-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .writing-color-card {
    background: rgba(255, 255, 255, 0.95);
    border: 2.5px solid var(--void-black);
    border-radius: 12px;
    padding: 8px 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    box-shadow: 2px 2px 0px var(--void-black);
    transition: all 0.1s ease;
  }

  .writing-color-card:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px var(--void-black);
  }

  .writing-color-card.active {
    background: var(--hazard-gold-light);
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px var(--void-black);
  }

  .writing-color-swatch {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--void-black);
  }

  .writing-color-text {
    font-family: 'Archivo Black', sans-serif;
    font-size: 8.5px;
    color: var(--void-black);
    text-align: center;
    line-height: 1.1;
  }

  /* Mummy Card Bottom Stub */
  .writing-mummy-bottom-stub {
    padding: 0 24px 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    z-index: 2;
  }

  .writing-stepper-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .writing-stepper-ctrl {
    display: flex;
    align-items: center;
    background: #FFFFFF;
    border: 3px solid var(--void-black);
    border-radius: 12px;
    box-shadow: 3px 3px 0px var(--void-black);
    overflow: hidden;
  }

  .writing-step-btn {
    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    font-family: 'Archivo Black', sans-serif;
    font-size: 16px;
    color: var(--void-black);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s ease;
  }

  .writing-step-btn:hover {
    background: var(--hazard-gold-light);
  }

  .writing-step-val {
    width: 40px;
    text-align: center;
    font-family: 'Titan One', cursive;
    font-size: 16px;
    color: var(--void-black);
  }

  .writing-presets-row {
    display: flex;
    gap: 6px;
  }

  .writing-preset-btn {
    width: 32px;
    height: 32px;
    background: #FFFFFF;
    border: 2px solid var(--void-black);
    border-radius: 8px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 11px;
    color: var(--void-black);
    cursor: pointer;
    box-shadow: 1.5px 1.5px 0px var(--void-black);
    transition: all 0.1s ease;
  }

  .writing-preset-btn:hover {
    background: #FFFBE6;
  }

  .writing-preset-btn.active {
    background: var(--slime-green);
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px var(--void-black);
  }

  .writing-total-banner {
    background: var(--void-black);
    color: var(--pure-white);
    border: 3px solid var(--void-black);
    border-radius: 14px;
    padding: 6px 14px;
    display: flex;
    align-items: baseline;
    gap: 6px;
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.25);
  }

  .writing-total-label {
    font-family: 'Archivo Black', sans-serif;
    font-size: 9.5px;
    color: var(--slime-green);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .writing-total-price {
    font-family: 'Titan One', cursive;
    font-size: 21px;
    color: var(--pure-white);
  }

  /* PRIMARY ACTION CTA - Neo-Brutalist Gummy Brain Pink */
  .writing-add-cta {
    width: 100%;
    background: var(--brain-pink);
    color: var(--void-black);
    border: 3.5px solid var(--void-black);
    border-radius: 14px;
    font-family: 'Archivo Black', sans-serif;
    font-size: 15px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 14px 20px;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--void-black);
    transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background 0.15s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .writing-add-cta:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--void-black);
    background: #FF85B2;
  }

  .writing-add-cta:active {
    transform: translate(4px, 4px);
    box-shadow: 0px 0px 0px var(--void-black);
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

  @media (max-width: 600px) {
    .writing-header-bar {
      padding: 10px 14px;
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
  { name: "Zombie Blood Red", hex: "#DC2626" },
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
  const currentCatIdx = Math.max(0, categoryItems.findIndex((item) => item.id === currentCatalog.id));

  // Scroll to top on fresh mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Escape key returns to base
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

  const handlePrev = () => {
    const nextIdx = currentCatIdx > 0 ? currentCatIdx - 1 : categoryItems.length - 1;
    setActiveId(categoryItems[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = currentCatIdx < categoryItems.length - 1 ? currentCatIdx + 1 : 0;
    setActiveId(categoryItems[nextIdx].id);
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const firstItem = CATALOG_ITEMS.find((item) => item.category === newCat);
    if (firstItem) setActiveId(firstItem.id);
  };

  // Compute product name & price
  let name = "";
  const price = currentCatalog.basePrice;

  if (category === "pen") {
    name = `${currentCatalog.modelName} (${color}, ${penType})`;
  } else if (category === "pencil") {
    name = `${currentCatalog.modelName} (${pencilType} Core)`;
  } else if (category === "mechanical") {
    name = `${currentCatalog.modelName} (${mechSize})`;
  }

  const grandTotal = price * (qty || 1);

  const handleAdd = () => {
    if (!name) return showToast("Complete tool selection first!");
    addToCart({ name, price, quantity: qty });
    showToast(`Added ${qty}x ${name} to Survival Loadout!`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="writing-page-shell">
        {/* 100% PURE VECTOR BACKDROP: EXACT REFERENCE RECREATION */}
        <div className="writing-bg-layer" aria-hidden="true">
          <img
            src="/halloween-reference-exact.svg"
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
            <div className="writing-brand-text-col">
              <span className="writing-brand-title">ODYSSEY // <span>CAMPUS WRITING COMMAND</span></span>
            </div>
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

        {/* HERO TITLE BANNER */}
        <div className="writing-hero-header-banner">
          <div className="writing-hero-badge">
            <span className="writing-pulse-dot" />
            <span>EXAM WEAPONRY // SURVIVAL LOADOUT</span>
          </div>
          <h1 className="writing-hero-h1">CAMPUS WRITING COMMAND</h1>
          <p className="writing-hero-p">
            Calibrated for rapid OMR penetration, skip-free marathon drafting & zero-drag hand endurance.
          </p>
        </div>

        {/* MAIN STAGE CONTAINER */}
        <div className="writing-layout-container">
          <div className="writing-cards-stage">

            {/* CARD 1: FRANKENSTEIN / ZOMBIE TICKET CARD (Hero Showcase) */}
            <section className="writing-ticket-card writing-frankenstein-card">
              {/* TOP: EXPOSED PINK BRAIN WITH JAGGED ZIGZAG HAIR */}
              <div className="writing-frank-brain-box">
                <svg viewBox="0 0 420 115" className="writing-frank-brain-svg" preserveAspectRatio="none">
                  {/* Pink Brain Dome - Arched & Fully Visible */}
                  <path
                    d="M 45,95 C 45,18 115,10 210,10 C 305,10 375,18 375,95 Z"
                    fill="#FF70A6"
                    stroke="#0D0D0D"
                    strokeWidth="4"
                  />
                  {/* Brain Sulcus / Fold Lines */}
                  <path
                    d="M 125,58 C 135,38 160,40 155,60 C 150,75 175,72 180,52 C 185,36 215,36 220,54 C 225,70 250,66 250,48 C 250,34 275,38 285,58"
                    fill="none"
                    stroke="#0D0D0D"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 140,80 C 150,68 170,70 175,84 M 195,76 C 210,64 230,66 235,82 M 260,72 C 270,62 285,68 295,80"
                    fill="none"
                    stroke="#0D0D0D"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 165,34 C 180,24 200,26 205,38 M 225,28 C 240,24 255,30 260,40"
                    fill="none"
                    stroke="#0D0D0D"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Jagged Black Zigzag Hair Edge */}
                  <path
                    d="M 0,115 L 0,82 L 28,108 L 56,82 L 84,108 L 112,82 L 140,108 L 168,82 L 196,108 L 224,82 L 252,108 L 280,82 L 308,108 L 336,82 L 364,108 L 392,82 L 420,90 L 420,115 Z"
                    fill="#0D0D0D"
                  />
                </svg>
              </div>

              {/* FOREHEAD & CHARACTER FACE ZONE */}
              <div className="writing-frank-face-zone">
                {/* Cross-stitch scar & "Trick or treat" script */}
                <div className="writing-frank-forehead-row">
                  <div className="writing-frank-stitches" title="Surgical Exam Scar">
                    <svg width="74" height="32" viewBox="0 0 74 32">
                      <line x1="6" y1="24" x2="68" y2="10" stroke="#0D0D0D" strokeWidth="3.2" strokeLinecap="round" />
                      <line x1="16" y1="12" x2="22" y2="26" stroke="#0D0D0D" strokeWidth="3.2" strokeLinecap="round" />
                      <line x1="35" y1="10" x2="41" y2="24" stroke="#0D0D0D" strokeWidth="3.2" strokeLinecap="round" />
                      <line x1="54" y1="8" x2="60" y2="22" stroke="#0D0D0D" strokeWidth="3.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="writing-script-callout">Trick or treat</div>
                  <div style={{ width: 44 }} />
                </div>

                {/* EYES ROW */}
                <div className="writing-frank-eyes-row" title="Frankenstein Eyes (hover to react)">
                  {/* Left Eye */}
                  <div className="writing-eye-socket frank-eye-socket" id="frank-eye-left" data-eye="frank-left">
                    <div className="writing-frank-eyelid frank-eyelid-left">
                      <div className="writing-frank-eyelid-crease" />
                    </div>
                    <div className="writing-pupil frank-pupil frank-pupil-left" id="frank-pupil-left">
                      <span className="writing-pupil-shine" />
                    </div>
                    <div className="frank-under-crease" />
                  </div>

                  {/* Right Eye */}
                  <div className="writing-eye-socket frank-eye-socket" id="frank-eye-right" data-eye="frank-right">
                    <div className="writing-frank-eyelid frank-eyelid-right">
                      <div className="writing-frank-eyelid-crease" />
                    </div>
                    <div className="writing-pupil frank-pupil frank-pupil-right" id="frank-pupil-right">
                      <span className="writing-pupil-shine" />
                    </div>
                    <div className="frank-under-crease" />
                  </div>
                </div>

                {/* NOSTRILS */}
                <div className="writing-frank-nostrils">
                  <svg width="52" height="18" viewBox="0 0 52 18">
                    <path d="M 8,14 C 12,4 18,4 21,14" fill="none" stroke="#0D0D0D" strokeWidth="3.8" strokeLinecap="round" />
                    <path d="M 31,14 C 34,4 40,4 44,14" fill="none" stroke="#0D0D0D" strokeWidth="3.8" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* SIDE TORSO STITCH SCAR (Extends body character detail) */}
              <div className="writing-frank-side-stitch">
                <svg width="26" height="90" viewBox="0 0 26 90">
                  <line x1="13" y1="4" x2="13" y2="86" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round" />
                  <line x1="4" y1="18" x2="22" y2="24" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round" />
                  <line x1="4" y1="44" x2="22" y2="50" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round" />
                  <line x1="4" y1="70" x2="22" y2="76" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* MIDDLE CONTENT: HERO SHOWCASE DATA */}
              <div className="writing-frank-body">
                {/* STARBURST PROTOCOL BADGE & STATUS */}
                <div className="writing-hero-header-row">
                  <div className="writing-starburst-badge">
                    <span className="writing-starburst-protocol">{currentCatalog.protocol}</span>
                    <h2 className="writing-starburst-text">{currentCatalog.title}</h2>
                  </div>
                  <div className="writing-hero-status-pill">
                    <span className="writing-status-dot" />
                    <span>SURVIVOR ISSUE // ₹{currentCatalog.basePrice}</span>
                  </div>
                </div>

                {/* TWO-COLUMN LORE */}
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

                {/* 4-QUADRANT STATS MATRIX */}
                <div className="writing-spec-matrix">
                  <div className="writing-spec-tile">
                    <span className="writing-spec-tile-label">FLOW VELOCITY</span>
                    <span className="writing-spec-tile-val accent-green">ZERO DRAG // FAST-DRY</span>
                  </div>
                  <div className="writing-spec-tile">
                    <span className="writing-spec-tile-label">OMR SCAN RATING</span>
                    <span className="writing-spec-tile-val accent-gold">100% OPTICAL READ PASS</span>
                  </div>
                  <div className="writing-spec-tile">
                    <span className="writing-spec-tile-label">BARREL CHASSIS</span>
                    <span className="writing-spec-tile-val">ANTI-FATIGUE ERGO</span>
                  </div>
                  <div className="writing-spec-tile">
                    <span className="writing-spec-tile-label">EXAM ENDURANCE</span>
                    <span className="writing-spec-tile-val">3-HOUR MARATHON RATED</span>
                  </div>
                </div>

                {/* SURVIVOR FIELD MEMO DISPATCH */}
                <div className="writing-field-dispatch">
                  <span className="writing-dispatch-badge">DISPATCH</span>
                  <span>SURVIVOR MEMO: Calibrated for rapid answer-sheet penetration under timed examination siege.</span>
                </div>
              </div>

              {/* TICKET PERFORATION DIVIDER & NOTCHES */}
              <div className="writing-ticket-perforation">
                <span className="writing-ticket-notch writing-ticket-notch-left" />
                <div className="writing-ticket-dashed-line" />
                <span className="writing-ticket-notch writing-ticket-notch-right" />
              </div>

              {/* BOTTOM TICKET STUB */}
              <div className="writing-frank-bottom-stub">
                <div className="writing-stub-meta-row">
                  <span className="writing-stub-title-cursive">31stlloween</span>
                  <div className="writing-stub-meta-col">
                    <span className="writing-stub-badge-date">31 ST<br />OCT</span>
                    <span className="writing-stub-bold-party">PARTY</span>
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
                          width: `${((currentCatIdx + 1) / categoryItems.length) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="writing-track-dot" />
                  </div>

                  <span className="writing-arcade-counter">
                    {currentCatIdx + 1} / {categoryItems.length}
                  </span>

                  <button
                    type="button"
                    className="writing-arcade-arrow-btn"
                    onClick={handleNext}
                    aria-label="Next item"
                  >
                    →
                  </button>
                </div>
              </div>
            </section>

            {/* CARD 2: MUMMY TICKET CARD (Interactive Workbench) */}
            <main className="writing-ticket-card writing-mummy-card">
              {/* FULL-BODY MUMMY BANDAGES VECTOR BACKDROP */}
              <svg
                className="writing-mummy-bandages-svg"
                viewBox="0 0 500 1000"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <filter id="mummy-fold-shadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="4" stdDeviation="2.5" floodColor="#0D0D0D" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* Bandage 1 (Top wrap) */}
                <path
                  d="M -10,-10 L 510,-10 L 510,80 Q 250,110 -10,70 Z"
                  fill="#FAF7F0"
                  stroke="#0D0D0D"
                  strokeWidth="3.8"
                  filter="url(#mummy-fold-shadow)"
                />

                {/* Bandage 2 (Forehead slant) */}
                <path
                  d="M -10,65 Q 250,105 510,75 L 510,165 Q 240,195 -10,140 Z"
                  fill="#EFE9DC"
                  stroke="#0D0D0D"
                  strokeWidth="3.8"
                  filter="url(#mummy-fold-shadow)"
                />

                {/* Bandage 3 (Upper eye cover / brow overlap) */}
                <path
                  d="M -10,135 Q 240,190 510,160 L 510,240 Q 380,255 250,245 Q 120,255 -10,225 Z"
                  fill="#FAF7F0"
                  stroke="#0D0D0D"
                  strokeWidth="3.8"
                  filter="url(#mummy-fold-shadow)"
                />

                {/* Bandage 4 (Cheek wrap under eye slit) */}
                <path
                  d="M -10,325 Q 130,295 250,310 Q 370,300 510,335 L 510,435 Q 260,470 -10,405 Z"
                  fill="#F3EEE3"
                  stroke="#0D0D0D"
                  strokeWidth="3.8"
                  filter="url(#mummy-fold-shadow)"
                />

                {/* Bandage 5 (Chest wrap diagonal 1) */}
                <path
                  d="M -10,400 Q 260,465 510,430 L 510,555 Q 240,580 -10,515 Z"
                  fill="#E8E1D0"
                  stroke="#0D0D0D"
                  strokeWidth="3.8"
                  filter="url(#mummy-fold-shadow)"
                />

                {/* Bandage 6 (Mid-torso wrap diagonal 2) */}
                <path
                  d="M -10,510 Q 240,575 510,550 L 510,685 Q 260,720 -10,640 Z"
                  fill="#FAF7F0"
                  stroke="#0D0D0D"
                  strokeWidth="3.8"
                  filter="url(#mummy-fold-shadow)"
                />

                {/* Bandage 7 (Lower torso wrap diagonal 3) */}
                <path
                  d="M -10,635 Q 260,715 510,680 L 510,805 Q 250,835 -10,760 Z"
                  fill="#EFE9DC"
                  stroke="#0D0D0D"
                  strokeWidth="3.8"
                  filter="url(#mummy-fold-shadow)"
                />

                {/* Bandage 8 (Perforation / hip wrap) */}
                <path
                  d="M -10,755 Q 250,830 510,800 L 510,905 Q 260,925 -10,885 Z"
                  fill="#F4EEE4"
                  stroke="#0D0D0D"
                  strokeWidth="3.8"
                  filter="url(#mummy-fold-shadow)"
                />

                {/* Bandage 9 (Bottom stub wrap) */}
                <path
                  d="M -10,880 Q 260,920 510,900 L 510,1010 L -10,1010 Z"
                  fill="#EAE3D4"
                  stroke="#0D0D0D"
                  strokeWidth="3.8"
                />
              </svg>

              {/* TOP: BANDAGE WRAP WITH SCRIPT TEXT */}
              <div className="writing-mummy-top-wrap">
                <div className="writing-script-callout">Trick or treat</div>
              </div>

              {/* BANDAGE SLIT APERTURE REVEALING MUMMY EYES */}
              <div className="writing-mummy-eye-aperture">
                <div className="writing-mummy-slit-frame">
                  <div className="writing-mummy-eyes-row" title="Mummy Eyes (hover to react)">
                    {/* Left Mummy Eye */}
                    <div className="writing-eye-socket mummy-eye-socket" id="mummy-eye-left" data-eye="mummy-left">
                      <div className="mummy-crease-top" />
                      <div className="writing-pupil mummy-pupil mummy-pupil-left" id="mummy-pupil-left">
                        <span className="writing-pupil-shine" />
                      </div>
                      <div className="mummy-crease-bottom" />
                    </div>

                    {/* Right Mummy Eye */}
                    <div className="writing-eye-socket mummy-eye-socket" id="mummy-eye-right" data-eye="mummy-right">
                      <div className="mummy-crease-top" />
                      <div className="writing-pupil mummy-pupil mummy-pupil-right" id="mummy-pupil-right">
                        <span className="writing-pupil-shine" />
                      </div>
                      <div className="mummy-crease-bottom" />
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE CONTENT: INTERACTIVE WORKBENCH OVER BANDAGES */}
              <div className="writing-mummy-body">
                <div className="writing-sec-header">
                  <h2 className="writing-sec-title">TOOL CONFIGURATION</h2>
                  <span className="writing-sec-tag">SURVIVAL LOADOUT ARSENAL</span>
                </div>

                {/* CATEGORY SWITCHER */}
                <div className="writing-cat-row">
                  <button
                    type="button"
                    className={`writing-cat-btn ${category === "pen" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("pen")}
                  >
                    <span>PENS</span>
                  </button>
                  <button
                    type="button"
                    className={`writing-cat-btn ${category === "pencil" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("pencil")}
                  >
                    <span>PENCILS</span>
                  </button>
                  <button
                    type="button"
                    className={`writing-cat-btn ${category === "mechanical" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("mechanical")}
                  >
                    <span>MECHANICAL</span>
                  </button>
                </div>

                {/* 1. MODEL SELECTION GRID */}
                <div className="writing-field-box">
                  <span className="writing-field-label">1. Standard Issue Model</span>
                  <div className="writing-models-grid">
                    {categoryItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`writing-model-btn ${currentCatalog.id === item.id ? "active" : ""}`}
                        onClick={() => setActiveId(item.id)}
                      >
                        <span className="writing-model-name">{item.modelName}</span>
                        <span className="writing-model-tag">{item.subtitle}</span>
                        <span className="writing-model-price">₹{item.basePrice}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC SUB-OPTION: PEN */}
                {category === "pen" && (
                  <div className="writing-field-box">
                    <span className="writing-field-label">2. Nib & Ink Technology</span>
                    <div className="writing-pill-options">
                      {["Gel", "Ball"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`writing-pill-btn ${penType === type ? "active" : ""}`}
                          onClick={() => setPenType(type)}
                        >
                          {type === "Gel" ? "Quick-Dry Gel" : "Durable Ballpoint"}
                        </button>
                      ))}
                    </div>

                    <span className="writing-field-label" style={{ marginTop: 8 }}>
                      3. Pigment Spectrum
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
                    <span className="writing-field-label">2. Graphite Density & Hardness</span>
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
                    <span className="writing-field-label">2. Precision Lead Gauge</span>
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
              </div>

              {/* TICKET PERFORATION DIVIDER & NOTCHES */}
              <div className="writing-ticket-perforation">
                <span className="writing-ticket-notch writing-ticket-notch-left" />
                <div className="writing-ticket-dashed-line" />
                <span className="writing-ticket-notch writing-ticket-notch-right" />
              </div>

              {/* BOTTOM TICKET STUB */}
              <div className="writing-mummy-bottom-stub">
                <div className="writing-stub-meta-row">
                  <span className="writing-stub-title-cursive">Halloween</span>
                  <div className="writing-stub-meta-col">
                    <span className="writing-stub-badge-date">31 ST<br />OCT</span>
                    <span className="writing-stub-bold-party">PARTY</span>
                  </div>
                </div>

                {/* QUANTITY & RAPID PRESETS */}
                <div className="writing-stepper-row">
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
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

                    <div className="writing-presets-row">
                      {[1, 2, 5, 10].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`writing-preset-btn ${qty === preset ? "active" : ""}`}
                          onClick={() => setQty(preset)}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
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
                  Add to Survival Loadout • ₹{grandTotal}
                </button>
              </div>
            </main>

          </div>
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
