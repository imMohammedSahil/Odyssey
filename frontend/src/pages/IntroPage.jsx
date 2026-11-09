import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const T = {
  bg0: "#080810",
  bg1: "#0d0d18",
  bg2: "#12121e",
  surface: "rgba(22,22,36,0.85)",
  surfaceHover: "rgba(28,28,46,0.95)",
  border: "rgba(255,255,255,0.06)",
  borderAccent: "rgba(130,100,255,0.28)",
  accent: "#7c5cfc",
  accentSoft: "#9b7ff0",
  accentGlow: "rgba(124,92,252,0.35)",
  accentGlowDim: "rgba(124,92,252,0.12)",
  textPrimary: "#eeeaf8",
  textSecondary: "#9490b8",
  textMuted: "#4a4870",
  textDim: "#2e2d42",
};

/* ─────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --accent: ${T.accent};
    --accent-soft: ${T.accentSoft};
    --accent-glow: ${T.accentGlow};
    --text-primary: ${T.textPrimary};
    --text-secondary: ${T.textSecondary};
    --text-muted: ${T.textMuted};
    --surface: ${T.surface};
    --border: ${T.border};
    --border-accent: ${T.borderAccent};
  }

  html { scroll-behavior: smooth; }

  body {
    background: ${T.bg0};
    color: ${T.textPrimary};
    font-family: 'Outfit', sans-serif;
    overflow-x: hidden;
    cursor: default;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(124,92,252,0.25); border-radius: 3px; }

  /* ── Entrance animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }

  @keyframes glowPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50%       { opacity: 0.7; transform: scale(1.08); }
  }

  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes orbDrift {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(40px, -30px) scale(1.05); }
    66%  { transform: translate(-20px, 20px) scale(0.97); }
    100% { transform: translate(0, 0) scale(1); }
  }

  @keyframes scanLine {
    from { transform: translateY(-100%); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.3; }
    to   { transform: translateY(100vh); opacity: 0; }
  }

  @keyframes dotPop {
    from { opacity: 0; transform: scale(0); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* ── Utility animations ── */
  .anim-fade-up   { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .anim-fade-in   { animation: fadeIn 0.6s ease both; }
  .anim-float     { animation: floatY 5s ease-in-out infinite; }
  .anim-glow-pulse{ animation: glowPulse 3.5s ease-in-out infinite; }

  /* ── Delay helpers ── */
  .d0  { animation-delay: 0ms; }
  .d1  { animation-delay: 120ms; }
  .d2  { animation-delay: 240ms; }
  .d3  { animation-delay: 380ms; }
  .d4  { animation-delay: 520ms; }
  .d5  { animation-delay: 680ms; }
  .d6  { animation-delay: 840ms; }
  .d7  { animation-delay: 1000ms; }
  .d8  { animation-delay: 1180ms; }

  /* ── Root ── */
  .ip-root {
    min-height: 100vh;
    background: ${T.bg0};
    position: relative;
    overflow: hidden;
  }

  /* ── Atmosphere layer ── */
  .ip-atm {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .ip-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: orbDrift linear infinite;
  }

  .ip-orb-1 {
    width: 600px; height: 600px;
    top: -20%; left: 30%;
    background: radial-gradient(circle, rgba(100,70,255,0.14) 0%, transparent 70%);
    animation-duration: 22s;
  }

  .ip-orb-2 {
    width: 500px; height: 500px;
    bottom: -10%; right: 10%;
    background: radial-gradient(circle, rgba(80,40,200,0.1) 0%, transparent 70%);
    animation-duration: 28s;
    animation-delay: -8s;
  }

  .ip-orb-3 {
    width: 300px; height: 300px;
    top: 40%; left: -5%;
    background: radial-gradient(circle, rgba(60,20,180,0.08) 0%, transparent 70%);
    animation-duration: 18s;
    animation-delay: -4s;
  }

  .ip-scan-line {
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124,92,252,0.15), transparent);
    animation: scanLine 8s linear infinite;
    animation-delay: 2s;
  }

  /* Subtle grid texture */
  .ip-grid {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(124,92,252,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,92,252,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
  }

  /* ── Nav ── */
  .ip-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    height: 64px;
    background: rgba(8,8,16,0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .ip-nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ip-nav-logo-mark {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(124,92,252,0.3), rgba(80,50,200,0.2));
    border: 1px solid rgba(124,92,252,0.35);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 16px rgba(124,92,252,0.2);
  }

  .ip-nav-logo-mark svg { width: 16px; height: 16px; color: #a888ff; }

  .ip-nav-name {
    font-size: 15px;
    font-weight: 700;
    color: ${T.textPrimary};
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .ip-nav-tag {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${T.textMuted};
    border: 1px solid rgba(255,255,255,0.07);
    padding: 2px 8px;
    border-radius: 20px;
  }

  /* ── Main content ── */
  .ip-main {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120px;
    padding-bottom: 80px;
  }

  /* ── Hero section ── */
  .ip-hero {
    text-align: center;
    max-width: 760px;
    padding: 0 24px;
    margin-bottom: 80px;
  }

  .ip-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7c5cfc;
    background: rgba(124,92,252,0.08);
    border: 1px solid rgba(124,92,252,0.2);
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 28px;
  }

  .ip-hero-eyebrow-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #7c5cfc;
    animation: glowPulse 2s ease-in-out infinite;
  }

  .ip-hero-h1 {
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.035em;
    color: ${T.textPrimary};
    margin-bottom: 8px;
  }

  .ip-hero-h1-accent {
    background: linear-gradient(135deg, #a888ff 0%, #7c5cfc 40%, #5a3fe0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
  }

  .ip-hero-sub {
    font-size: clamp(15px, 2vw, 18px);
    font-weight: 300;
    color: ${T.textSecondary};
    line-height: 1.65;
    max-width: 520px;
    margin: 20px auto 40px;
    letter-spacing: 0.01em;
  }

  /* ── CTA button ── */
  .ip-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 15px 36px;
    background: linear-gradient(135deg, #7c5cfc 0%, #5a3fe0 100%);
    color: #fff;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.02em;
    position: relative;
    overflow: hidden;
    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
    box-shadow: 0 6px 28px rgba(124,92,252,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset;
  }

  .ip-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .ip-cta:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 12px 36px rgba(124,92,252,0.6), 0 0 60px rgba(124,92,252,0.2);
    filter: brightness(1.06);
  }

  .ip-cta:active {
    transform: translateY(1px) scale(0.99);
    box-shadow: 0 4px 16px rgba(124,92,252,0.3);
  }

  .ip-cta svg { width: 16px; height: 16px; }

  /* ── Stats strip ── */
  .ip-stats {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-top: 40px;
    opacity: 0.6;
    flex-wrap: wrap;
    justify-content: center;
  }

  .ip-stat {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: ${T.textMuted};
  }

  .ip-stat-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: rgba(124,92,252,0.5);
  }

  /* ── Features grid ── */
  .ip-features {
    width: 100%;
    max-width: 1000px;
    padding: 0 24px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
    margin-bottom: 80px;
  }

  .ip-feat-card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 18px;
    padding: 26px 24px;
    cursor: default;
    position: relative;
    overflow: hidden;
    transition: border-color 0.22s ease, background 0.22s ease, transform 0.18s ease, box-shadow 0.22s ease;
    backdrop-filter: blur(12px);
  }

  .ip-feat-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(124,92,252,0.04) 0%, transparent 60%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.22s ease;
  }

  .ip-feat-card:hover {
    border-color: rgba(124,92,252,0.32);
    background: ${T.surfaceHover};
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(124,92,252,0.1);
  }

  .ip-feat-card:hover::before { opacity: 1; }

  .ip-feat-icon-wrap {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: rgba(124,92,252,0.1);
    border: 1px solid rgba(124,92,252,0.2);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
    transition: background 0.2s ease, box-shadow 0.2s ease;
    position: relative; z-index: 1;
  }

  .ip-feat-card:hover .ip-feat-icon-wrap {
    background: rgba(124,92,252,0.18);
    box-shadow: 0 0 20px rgba(124,92,252,0.25);
  }

  .ip-feat-icon-wrap svg { width: 20px; height: 20px; color: #a888ff; }

  .ip-feat-title {
    font-size: 15px;
    font-weight: 600;
    color: ${T.textPrimary};
    margin-bottom: 7px;
    letter-spacing: -0.01em;
    position: relative; z-index: 1;
  }

  .ip-feat-desc {
    font-size: 13px;
    color: ${T.textMuted};
    line-height: 1.65;
    font-weight: 300;
    position: relative; z-index: 1;
  }

  .ip-feat-tag {
    margin-top: 14px;
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: rgba(124,92,252,0.6);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    position: relative; z-index: 1;
  }

  /* ── Divider ── */
  .ip-divider {
    width: 100%;
    max-width: 600px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124,92,252,0.2), transparent);
    margin: 0 auto 60px;
  }

  /* ── Footer strip ── */
  .ip-footer {
    position: relative;
    z-index: 10;
    text-align: center;
    padding: 24px;
    border-top: 1px solid rgba(255,255,255,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .ip-footer-lock svg { width: 11px; height: 11px; color: ${T.textDim}; }
  .ip-footer-text { font-size: 11px; color: ${T.textDim}; letter-spacing: 0.05em; }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .ip-nav { padding: 0 20px; }
    .ip-hero { margin-bottom: 56px; }
    .ip-features { grid-template-columns: 1fr; }
    .ip-stats { gap: 18px; }
  }
`;

/* ─────────────────────────────────────────
   FEATURE DATA
───────────────────────────────────────── */
const FEATURES = [
  {
    tag: "service_01",
    title: "Print Services",
    desc: "Upload documents and queue print jobs from anywhere on campus. Track progress in real time.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/>
        <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
    ),
  },
  {
    tag: "service_02",
    title: "Stationery Orders",
    desc: "Browse and order stationery instantly. Everything you need, delivered without friction.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    tag: "service_03",
    title: "Order Tracking",
    desc: "Live status updates from placed to printed to ready. Never wonder where your order stands.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    tag: "service_04",
    title: "Chat & Support",
    desc: "Direct line to the admin team. Ask questions, share requests, get instant responses.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    tag: "service_05",
    title: "Account & Profile",
    desc: "Your identity, orders, and history in one organized place. Personalized and always up to date.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    tag: "service_06",
    title: "Smart Receipts",
    desc: "Every transaction logged with full details and order history, always accessible from your account.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function IntroPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div className="ip-root">

        {/* Atmosphere */}
        <div className="ip-atm" aria-hidden="true">
          <div className="ip-orb ip-orb-1"/>
          <div className="ip-orb ip-orb-2"/>
          <div className="ip-orb ip-orb-3"/>
          <div className="ip-scan-line"/>
        </div>
        <div className="ip-grid" aria-hidden="true"/>

        {/* Nav */}
        <nav className="ip-nav anim-fade-in d0">
          <div className="ip-nav-logo">
            <div className="ip-nav-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
            </div>
            <span className="ip-nav-name">Odyssey</span>
            <span className="ip-nav-tag">Library Platform</span>
          </div>
        </nav>

        {/* Main */}
        <main className="ip-main">

          {/* Hero */}
          <section className="ip-hero">
            <div className="anim-fade-up d1">
              <div className="ip-hero-eyebrow">
                <span className="ip-hero-eyebrow-dot"/>
                Your campus library, reimagined
              </div>
            </div>

            <h1 className="ip-hero-h1 anim-fade-up d2">
              Everything you need.
              <span className="ip-hero-h1-accent">Exactly when you need it.</span>
            </h1>

            <p className="ip-hero-sub anim-fade-up d3">
              Print documents, order stationery, track requests, and communicate with your library team — all from one elegant platform.
            </p>

            <div className="anim-fade-up d4">
              <button
                className="ip-cta"
                onClick={() => navigate("/login")}
              >
                Continue to Login
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <div className="ip-stats anim-fade-up d5">
              {["Instant print queue", "Real-time tracking", "Secure & encrypted", "Always available"].map((s, i) => (
                <span className="ip-stat" key={i}>
                  <span className="ip-stat-dot"/>
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="ip-divider anim-fade-in d5"/>

          {/* Features */}
          <div className="ip-features">
            {FEATURES.map((f, i) => (
              <div
                key={f.tag}
                className={`ip-feat-card anim-fade-up d${i + 3}`}
              >
                <div className="ip-feat-icon-wrap">{f.icon}</div>
                <div className="ip-feat-title">{f.title}</div>
                <div className="ip-feat-desc">{f.desc}</div>
                <span className="ip-feat-tag">{f.tag}</span>
              </div>
            ))}
          </div>

        </main>

        {/* Footer */}
        <footer className="ip-footer anim-fade-in d8">
          <span className="ip-footer-lock">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </span>
          <span className="ip-footer-text">Odyssey · Secured · Encrypted · Built for campus</span>
        </footer>

      </div>
    </>
  );
}