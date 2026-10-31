import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useNavigationType } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PhoneChatDispatch from "../components/PhoneChatDispatch";
import ZombieLeft from "../components/ZombieLeft";
import ZombieRight from "../components/ZombieRight";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');

  :root {
    --slime-green: #9DE869;
    --void-black: #0D0D0D;
    --seafoam: #45B89E;
    --hazard-gold: #F7B919;
    --brain-pink: #FF70A6;
    --parchment: #F9F9F3;
    --border-dark: #0D0D0D;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .neo-body {
    background-color: var(--void-black);
    color: var(--void-black);
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    letter-spacing: 0.3px;
  }

  /* Slime Top Banner & Nav */
  .neo-header-wrapper {
    background-color: var(--slime-green);
    position: relative;
    padding-bottom: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .neo-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }

  .neo-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .neo-logo {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 22px;
    text-transform: uppercase;
    color: var(--void-black);
    letter-spacing: 1.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .neo-badge-pill {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    background: var(--hazard-gold);
    color: var(--void-black);
    font-size: 11px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
    border: 2px solid var(--border-dark);
    box-shadow: 2px 2px 0px var(--border-dark);
    display: inline-flex;
    align-items: center;
  }

  .neo-nav-actions {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .neo-btn-pill {
    height: 42px;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    padding: 0 16px;
    border-radius: 8px;
    border: 3px solid var(--border-dark);
    background: var(--parchment);
    color: var(--void-black);
    box-shadow: 3px 3px 0px var(--border-dark);
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    line-height: 1;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .neo-btn-pill:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  .neo-btn-cart {
    background: var(--brain-pink);
  }

  .neo-btn-logout {
    background: var(--hazard-gold);
  }

  .neo-avatar-frame {
    width: 42px;
    height: 42px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 3px solid var(--border-dark);
    box-shadow: 3px 3px 0px var(--border-dark);
    background: var(--parchment);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    font-size: 19px;
    line-height: 1;
    transition: transform 0.1s ease;
  }

  .neo-avatar-frame:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
  }

  .neo-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Hero Section */
  .neo-hero {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px 20px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 5;
    flex: 1;
    justify-content: center;
    transform: translateY(58px);
  }

  .neo-hero-left {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  @media (max-width: 860px) {
    .neo-hero {
      padding: 45px 16px 15px;
    }
  }

  .neo-hero-title {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: clamp(34px, 5.2vw, 64px);
    line-height: 1.15;
    text-transform: uppercase;
    color: var(--brain-pink);
    -webkit-text-stroke: 3px var(--border-dark);
    paint-order: stroke fill;
    letter-spacing: 2px;
    margin-bottom: 22px;
    text-shadow: 8px 8px 0px var(--border-dark);
  }

  .neo-hero-cta-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
  }

  .neo-btn-giant {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 16px;
    text-transform: uppercase;
    background: var(--brain-pink);
    color: var(--void-black);
    padding: 14px 28px;
    border: 4px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 5px 5px 0px var(--border-dark);
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .neo-btn-giant:hover {
    transform: translate(2px, 2px);
    box-shadow: 3px 3px 0px var(--border-dark);
  }

  .neo-hero-subtext {
    font-size: 15px;
    font-weight: 700;
    max-width: 640px;
    margin: 0 auto;
    line-height: 1.5;
    color: var(--void-black);
    opacity: 0.95;
    text-align: center;
  }

  /* Comic Mascots in Hero */
  .neo-hero-visual {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 20px;
    position: relative;
    flex-shrink: 0;
  }

  .tombstone-box {
    background: #CAD3D8;
    border: 4px solid var(--border-dark);
    border-radius: 40px 40px 6px 6px;
    padding: 24px 20px;
    text-align: center;
    box-shadow: 5px 5px 0px var(--border-dark);
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    min-width: 130px;
  }

  .tombstone-box h4 {
    font-size: 26px;
    letter-spacing: 2px;
    line-height: 1;
    margin-bottom: 4px;
  }

  .tombstone-box p {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.7;
  }

  .zombie-badge {
    background: #89E054;
    border: 4px solid var(--border-dark);
    border-radius: 50%;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    box-shadow: 5px 5px 0px var(--border-dark);
    transform: rotate(-8deg);
  }

  /* Graveyard Ground Silhouette */
  .ground-divider {
    position: relative;
    width: 100%;
    overflow: visible;
    line-height: 0;
    margin-top: auto;
    background: transparent;
  }

  .ground-divider svg {
    display: block;
    width: 100%;
    height: clamp(210px, 20vw, 290px);
  }

  /* Main Dark Container */
  .neo-main-container {
    max-width: 1500px;
    margin: 0 auto;
    padding: 60px 4% 80px;
  }

  .neo-section-heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 4px;
    padding-bottom: 10px;
  }

  .zombie-drip-divider {
    width: 100%;
    margin-bottom: 36px;
    overflow: visible;
    line-height: 0;
  }

  .neo-section-title {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 32px;
    font-weight: 450;
    color: #FFF;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .neo-section-tag {
    background: var(--hazard-gold);
    color: var(--void-black);
    font-weight: 800;
    font-size: 12px;
    padding: 6px 14px;
    border: 3px solid var(--border-dark);
    box-shadow: 3px 3px 0px var(--border-dark);
    text-transform: uppercase;
    border-radius: 6px;
  }

  /* Service Cards Grid */
  /* ========================================================
     DETECTIVE EVIDENCE BOARD / BASECAMP ARMORY (PHOTO REVAMP)
     ======================================================== */
  .detective-board-wrapper {
    position: relative;
    background: #C4BA62; /* Olive-mustard corkboard from ref photo */
    border: 4px solid var(--border-dark);
    border-radius: 12px;
    box-shadow: -10px 14px 0px var(--border-dark);
    padding: 60px 48px 80px;
    margin-bottom: 60px;
    overflow: hidden;
  }

  /* Pinned Blueprint Map Layer in the Center */
  .board-blueprint-map {
    position: absolute;
    top: 24px;
    left: 28px;
    right: 28px;
    bottom: 24px;
    background: #D4E6F4;
    border: 4.5px solid #FFFFFF;
    box-shadow: -6px 8px 0px rgba(0, 0, 0, 0.35);
    border-radius: 4px;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }

  .bp-corner-pin {
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(circle at 32% 28%, #787878 0%, #333333 45%, #181818 80%, #050505 100%);
    border: 1.5px solid #0A0A0A;
    box-shadow: 
      inset 0 1.5px 2px rgba(255, 255, 255, 0.55),
      inset 0 -2px 3px rgba(0, 0, 0, 0.9),
      -2px 3px 5px rgba(0, 0, 0, 0.45);
    z-index: 4;
  }
  .bp-corner-pin::after {
    content: "";
    position: absolute;
    top: 2.5px;
    left: 3.5px;
    width: 5px;
    height: 3px;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    transform: rotate(-30deg);
  }
  .bp-corner-pin.tl { top: 8px; left: 8px; }
  .bp-corner-pin.tr { top: 8px; right: 8px; }
  .bp-corner-pin.bl { bottom: 8px; left: 8px; }
  .bp-corner-pin.br { bottom: 8px; right: 8px; }

  /* Yellow Masking Tape on Map */
  .bp-center-tape {
    position: absolute;
    top: 50%;
    left: 48%;
    transform: translate(-50%, -50%) rotate(-4deg);
    width: 58px;
    height: 18px;
    background: rgba(246, 219, 98, 0.9);
    border: 1.5px solid rgba(0, 0, 0, 0.2);
    box-shadow: 1px 2px 3px rgba(0,0,0,0.25);
    z-index: 2;
  }

  .neo-cards-grid {
    position: relative;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 48px 38px;
    padding: 10px;
  }

  /* Clean Evidence Document Paper Card */
  .neo-card {
    background: #FFFFFF;
    border: 3.5px solid var(--border-dark);
    border-radius: 6px;
    padding: 34px 26px 24px;
    box-shadow: -8px 10px 0px var(--border-dark);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease;
    overflow: visible;
    min-height: 220px;
  }

  .neo-card.card-alt-paper {
    background: #FAF8F0; /* Off-white dossier paper */
  }

  .neo-card.card-blueprint-slip {
    background: #E8F2FA; /* Soft blueprint memo */
  }

  /* Subtle controlled organic pinboard tilts */
  .neo-card:nth-child(6n+1) { transform: rotate(-1.2deg); }
  .neo-card:nth-child(6n+2) { transform: rotate(1deg); }
  .neo-card:nth-child(6n+3) { transform: rotate(-0.8deg); }
  .neo-card:nth-child(6n+4) { transform: rotate(1.2deg); }
  .neo-card:nth-child(6n+5) { transform: rotate(-1deg); }
  .neo-card:nth-child(6n+6) { transform: rotate(0.8deg); }

  .neo-card:hover {
    transform: rotate(0deg) translate(-2px, -2px);
    box-shadow: -10px 13px 0px var(--border-dark);
    z-index: 10;
  }

  /* Evidence Document Lines (from photo) */
  .evidence-doc-lines {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 10px;
  }
  .doc-line {
    height: 4px;
    background: #D5D5CE;
    border-radius: 2px;
  }
  .doc-line.w-short { width: 45%; }
  .doc-line.w-med { width: 75%; }
  .doc-line.w-full { width: 100%; }

  /* Yellow Tape on corners */
  .paper-tape {
    position: absolute;
    width: 48px;
    height: 14px;
    background: rgba(246, 218, 98, 0.9);
    border-left: 2px dashed rgba(0,0,0,0.3);
    border-right: 2px dashed rgba(0,0,0,0.3);
    box-shadow: 1px 2px 2px rgba(0,0,0,0.18);
    pointer-events: none;
    z-index: 8;
  }
  .paper-tape.corner-tr {
    top: -7px;
    right: 18px;
    transform: rotate(8deg);
  }
  .paper-tape.corner-tl {
    top: -7px;
    left: 18px;
    transform: rotate(-7deg);
  }

  /* Realistic 3D Pinned Pushpins (Ref Photo Match) */
  .neo-card-pin {
    position: absolute;
    top: -11px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle at 32% 28%, #787878 0%, #333333 45%, #181818 80%, #050505 100%);
    border: 1.5px solid #0A0A0A;
    box-shadow: 
      inset 0 1.5px 2px rgba(255, 255, 255, 0.55),
      inset 0 -2px 3px rgba(0, 0, 0, 0.9),
      -1px 2px 3px rgba(0, 0, 0, 0.4);
    z-index: 10;
    pointer-events: none;
  }
  .neo-card-pin::before {
    content: "";
    position: absolute;
    top: 12px;
    left: -4px;
    width: 9px;
    height: 11px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0.15) 60%, rgba(0, 0, 0, 0) 100%);
    transform: rotate(36deg);
    border-radius: 2px 2px 4px 4px;
    filter: blur(0.5px);
    z-index: -1;
  }
  .neo-card-pin::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 4px;
    width: 6px;
    height: 3.5px;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    transform: rotate(-30deg);
  }

  .neo-card-title {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 21px;
    text-transform: uppercase;
    color: var(--void-black);
    margin-bottom: 6px;
    line-height: 1.1;
    letter-spacing: 0.6px;
  }

  .neo-card-desc {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.45;
    margin-bottom: 18px;
    color: rgba(13, 13, 13, 0.85);
  }

  .neo-card-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  .neo-card-btn {
    font-family: 'Mosko Mappa', 'Titan One', 'Archivo Black', cursive, sans-serif;
    font-size: 13px;
    text-transform: uppercase;
    padding: 10px 18px;
    border: 3px solid var(--border-dark);
    border-radius: 6px;
    background: var(--void-black);
    color: #FFF;
    cursor: pointer;
    box-shadow: -2px 3px 0px var(--border-dark);
    transition: transform 0.1s ease, background 0.15s ease;
  }

  .neo-card-btn:hover {
    background: #252525;
    transform: translate(-1px, -1px);
  }

  /* Specific Card Theme Colors */
  .card-seafoam {
    background-color: var(--seafoam);
  }
  .card-yellow {
    background-color: var(--hazard-gold);
  }
  .card-pink {
    background-color: var(--brain-pink);
  }
  .card-green {
    background-color: var(--slime-green);
  }


`;

export default function UploadOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    let scrollTimeout = null;
    const handleScroll = () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(() => {
        sessionStorage.setItem("student_scroll_y", String(window.scrollY));
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    const handleBeforeUnload = () => {
      sessionStorage.setItem("student_scroll_y", String(window.scrollY));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const cartContext = useCart();
  const cartItems = cartContext?.cartItems || [];

  const [photo, setPhoto] = useState("/avatar.jpg");

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const studentId = sessionStorage.getItem("user");
        if (!studentId) return;

        const res = await fetch(`http://localhost:5000/api/profile/${studentId}`);
        const data = await res.json();

        if (data?.profilePhoto) {
          setPhoto("http://localhost:5000" + data.profilePhoto);
        }
      } catch (err) {
        console.log("Photo load skipped");
      }
    };

    loadPhoto();
  }, []);

  const smoothScrollToKits = (duration = 1200) => {
    const target = document.getElementById("kits-section");
    if (!target) return;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      window.scrollTo(0, startPosition + distance * ease);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (location.state?.scrollToKits) {
      navigate(location.pathname, { replace: true, state: {} });
      setTimeout(() => {
        smoothScrollToKits(1300);
      }, 150);
    } else if (navType === "POP") {
      const savedY = sessionStorage.getItem("student_scroll_y");
      if (savedY !== null) {
        const rawY = parseInt(savedY, 10);
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const targetY = Math.max(0, Math.min(rawY, maxScroll));
        window.scrollTo(0, targetY);
        const timer1 = setTimeout(() => window.scrollTo(0, targetY), 50);
        const timer2 = setTimeout(() => window.scrollTo(0, targetY), 150);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } else {
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      window.scrollTo(0, 0);
    }
  }, [location.state, navigate, location.pathname, navType]);

  const services = [
    {
      to: "/printing",
      label: "Report & Doc Print",
      desc: "Fast black & white or full-color spiral bound reports, thesis & assignments.",
      tapePos: "corner-tr",
      btnText: "PRINT NOW",
    },
    {
      to: "/writing",
      label: "Writing Essentials",
      desc: "Gel pens, highlighters, permanent markers, and refills for marathon study.",
      variant: "card-alt-paper",
      btnText: "GET TOOLS",
    },
    {
      to: "/stationery/correction",
      label: "Correction & Marking",
      desc: "Correction tapes, precision erasers, fluid bottles & fluo highlighters.",
      btnText: "EXPLORE",
    },
    {
      to: "/stationery/paper",
      label: "Paper Products",
      desc: "75 GSM A4 copy reams, sticky memo notes, index tabs & exam sheets.",
      variant: "card-blueprint-slip",
      tapePos: "corner-tl",
      btnText: "STOCK UP",
    },
    {
      to: "/stationery/measuring",
      label: "Measuring & Drawing",
      desc: "Drafting scales, pro-grade geometry sets, engineering curves & compasses.",
      btnText: "VIEW GEAR",
    },
    {
      to: "/stationery/office",
      label: "Office & Utility",
      desc: "Heavy staplers, binder clips, punchers, clear folders & adhesives.",
      variant: "card-alt-paper",
      tapePos: "corner-tr",
      btnText: "BROWSE",
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="neo-body">
        {/* Slime Green Top Section with Header & Hero */}
        <div className="neo-header-wrapper">
          {/* Top Bar */}
          <header className="neo-navbar">
            <div
              className="neo-brand"
              onClick={() => navigate("/student")}
              style={{ cursor: "pointer" }}
            >
              <span className="neo-logo">
                🧟 ODYSSEY
              </span>
              <span className="neo-badge-pill">BASECAMP</span>
            </div>

            <div className="neo-nav-actions">
              <button
                className="neo-btn-pill neo-btn-cart"
                onClick={() => navigate("/cart")}
              >
                CART ({cartItems.length})
              </button>

              <div
                className="neo-avatar-frame"
                title="Your Profile"
                onClick={() => navigate("/profile")}
              >
                <img src={photo || "/avatar.jpg"} alt="profile" className="neo-avatar-img" />
              </div>

              <button
                className="neo-btn-pill neo-btn-logout"
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = "/";
                }}
              >
                EXIT
              </button>
            </div>
          </header>

          {/* Hero Banner */}
          <section className="neo-hero">
            <h1 className="neo-hero-title">
              NEVER OUT<br />OF AMMO.
            </h1>
            <p className="neo-hero-subtext">
              From spiral bound reports and printouts to emergency pens and notebooks,<br />restock your study gear in minutes.
            </p>

            <div className="neo-hero-cta-group">
              <button
                className="neo-btn-giant"
                onClick={() => smoothScrollToKits(1100)}
              >
                EXPLORE GEAR ↓
              </button>
            </div>
          </section>

          {/* Graveyard Earth & Zombie Horizon */}
          <div className="ground-divider">
            <div style={{ position: "absolute", bottom: "137px", left: "9%", zIndex: 1, pointerEvents: "none" }}>
              <ZombieLeft width={130} height={130} />
            </div>
            <div style={{ position: "absolute", bottom: "170px", right: "9%", zIndex: 1, pointerEvents: "none" }}>
              <ZombieRight width={170} height={145} />
            </div>

            <svg viewBox="0 0 1440 180" preserveAspectRatio="none" style={{ position: "relative", zIndex: 2 }}>
              {/* Organic Uneven Graveyard Earth Mound Silhouette */}
              <path
                d="M 0,180 
                   L 0,112 
                   Q 25,98 50,102 
                   Q 90,82 135,76 
                   Q 175,72 210,88 
                   C 245,98 280,108 330,104 
                   L 345,95 L 358,102 
                   Q 390,92 430,96 
                   Q 480,78 520,68 
                   L 532,74 L 545,64 
                   C 580,72 610,90 660,94 
                   Q 710,104 760,100 
                   L 775,92 L 788,98 
                   Q 830,88 880,76 
                   Q 930,66 980,72 
                   L 995,78 L 1010,72 
                   Q 1060,62 1110,68 
                   Q 1150,64 1200,64 
                   Q 1260,62 1310,62 
                   Q 1330,64 1350,70 
                   L 1365,80 L 1378,74 
                   Q 1410,86 1440,94 
                   L 1440,180 Z"
                fill="#0D0D0D"
              />
            </svg>
          </div>
        </div>

        {/* Main Content Area in Dark Void */}
        <main className="neo-main-container" id="kits-section">
          <div className="neo-section-heading">
            <div>
              <h2 className="neo-section-title">BASECAMP ARMORY</h2>
              <p style={{ color: "#8E9AA0", fontSize: "14px", fontWeight: 600, marginTop: "4px" }}>
                Choose a dispatch station to stock your loadout.
              </p>
            </div>
            <span className="neo-section-tag">6 SUPPLY TERMINALS</span>
          </div>

          {/* Zombie Goo Drip Divider (Thick & Gloopy Cartoon Slime Bar) */}
          <div className="zombie-drip-divider" aria-hidden="true">
            <svg
              viewBox="0 0 1200 86"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "72px", display: "block", overflow: "visible" }}
            >
              <defs>
                <filter id="dripComicShadow" x="-10%" y="-10%" width="130%" height="140%">
                  <feDropShadow dx="-3" dy="5" stdDeviation="0" floodColor="#0D0D0D" floodOpacity="1" />
                </filter>
              </defs>

              {/* Seamless Thick Melting Glue Divider with Drips */}
              <g filter="url(#dripComicShadow)">
                <path
                  d="M 0,4 
                     Q 60,1 120,5 Q 180,8 240,3 Q 300,1 360,6 Q 420,8 480,3 Q 540,1 600,5 Q 660,8 720,3 Q 780,2 840,6 Q 900,8 960,3 Q 1020,1 1080,5 Q 1140,7 1200,4 
                     L 1200,21 
                     Q 1180,20 1162,22 
                     L 1162,44 Q 1162,54 1153,54 Q 1144,54 1144,44 L 1144,22 
                     Q 1100,20 1050,22 
                     L 1050,38 Q 1050,46 1043,46 Q 1036,46 1036,38 L 1036,22 
                     L 1033,56 Q 1033,68 1023,68 Q 1013,68 1013,56 L 1013,22 
                     Q 975,20 942,22 
                     L 942,32 Q 942,38 936,38 Q 930,38 930,32 L 930,22 
                     Q 885,20 839,22 
                     L 839,44 Q 839,52 831,52 Q 823,52 823,44 L 823,22 
                     L 820,62 Q 820,74 809,74 Q 798,74 798,62 L 798,22 
                     L 795,34 Q 795,42 788,42 Q 781,42 781,34 L 781,22 
                     Q 748,20 718,22 
                     L 718,42 Q 718,52 709,52 Q 700,52 700,42 L 700,22 
                     Q 650,20 598,22 
                     L 598,32 Q 598,38 592,38 Q 586,38 586,32 L 586,22 
                     L 583,48 Q 583,58 574,58 Q 565,58 565,48 L 565,22 
                     Q 528,20 492,22 
                     L 492,36 Q 492,44 485,44 Q 478,44 478,36 L 478,22 
                     Q 435,20 389,22 
                     L 389,44 Q 389,52 382,52 Q 375,52 375,44 L 375,22 
                     L 372,66 Q 372,78 361,78 Q 350,78 350,66 L 350,22 
                     L 347,50 Q 347,60 338,60 Q 329,60 329,50 L 329,22 
                     Q 292,20 259,22 
                     L 259,30 Q 259,36 254,36 Q 249,36 249,30 L 249,22 
                     Q 208,20 162,22 
                     L 162,34 Q 162,42 155,42 Q 148,42 148,34 L 148,22 
                     L 145,58 Q 145,70 135,70 Q 125,70 125,58 L 125,22 
                     L 122,32 Q 122,40 115,40 Q 108,40 108,32 L 108,22 
                     Q 75,20 45,22 
                     L 45,40 Q 45,50 37,50 Q 29,50 29,40 L 29,22 
                     Q 15,20 0,21 
                     Z"
                  fill="#FF70A6"
                  stroke="#0D0D0D"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* Randomized Detached Comic Droplets */}
                <circle cx="135" cy="78" r="4" fill="#FF70A6" stroke="#0D0D0D" strokeWidth="2.5" />
                <circle cx="361" cy="85" r="4.5" fill="#FF70A6" stroke="#0D0D0D" strokeWidth="2.5" />
                <circle cx="809" cy="82" r="4" fill="#FF70A6" stroke="#0D0D0D" strokeWidth="2.5" />
                <circle cx="1023" cy="76" r="3.5" fill="#FF70A6" stroke="#0D0D0D" strokeWidth="2.5" />
                <circle cx="574" cy="66" r="3" fill="#FF70A6" stroke="#0D0D0D" strokeWidth="2" />
                <circle cx="1153" cy="62" r="3" fill="#FF70A6" stroke="#0D0D0D" strokeWidth="2" />
              </g>

              {/* Glossy Liquid Sheen on Drip Lobes */}
              <g fill="#FFFFFF" opacity="0.85" pointerEvents="none">
                <ellipse cx="34" cy="38" rx="2" ry="5.5" />
                <ellipse cx="132" cy="56" rx="2.5" ry="9" />
                <ellipse cx="335" cy="46" rx="2.2" ry="7" />
                <ellipse cx="357" cy="64" rx="2.8" ry="10" />
                <ellipse cx="482" cy="34" rx="2" ry="5" />
                <ellipse cx="571" cy="46" rx="2.4" ry="7.5" />
                <ellipse cx="706" cy="38" rx="2.2" ry="6.5" />
                <ellipse cx="805" cy="60" rx="2.6" ry="9.5" />
                <ellipse cx="828" cy="40" rx="2.2" ry="6.5" />
                <ellipse cx="934" cy="28" rx="1.8" ry="4" />
                <ellipse cx="1020" cy="54" rx="2.4" ry="8.5" />
                <ellipse cx="1150" cy="40" rx="2.2" ry="6.5" />
              </g>
            </svg>
          </div>

          {/* Investigation Evidence Board Wrapper (Exact Photo Match) */}
          <div className="detective-board-wrapper">
            {/* Pinned Central Blueprint Map */}
            <div className="board-blueprint-map" aria-hidden="true">
              <span className="bp-corner-pin tl" />
              <span className="bp-corner-pin tr" />
              <span className="bp-corner-pin bl" />
              <span className="bp-corner-pin br" />
              <span className="bp-center-tape" />

              {/* Blueprint Street Grid Lines */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1000 600"
                preserveAspectRatio="none"
                style={{ position: "absolute", top: 0, left: 0, opacity: 0.6 }}
              >
                <path
                  d="M 0,190 L 1000,160 M 0,420 L 1000,390 M 320,0 L 280,600 M 670,0 L 710,600 M 140,0 L 450,600 M 830,0 L 520,600"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </div>

            {/* Services Grid */}
            <div className="neo-cards-grid">
              {services.map((svc) => (
                <div
                  key={svc.to}
                  className={`neo-card ${svc.variant || ""}`}
                >
                  {/* Pushpin from Ref Photo */}
                  <div className="neo-card-pin" aria-hidden="true" />

                  {/* Corner Yellow Masking Tape */}
                  {svc.tapePos && <div className={`paper-tape ${svc.tapePos}`} aria-hidden="true" />}

                  <div>
                    {/* Mock Evidence Document Lines */}
                    <div className="evidence-doc-lines" aria-hidden="true">
                      <div className="doc-line w-short" />
                      <div className="doc-line w-full" />
                    </div>

                    <h3 className="neo-card-title">{svc.label}</h3>
                    <p className="neo-card-desc">{svc.desc}</p>
                  </div>

                  <div className="neo-card-action">
                    <button
                      className="neo-card-btn"
                      onClick={() => {
                        sessionStorage.setItem("student_scroll_y", String(window.scrollY));
                        navigate(svc.to);
                      }}
                      aria-label={`Open ${svc.label}`}
                    >
                      {svc.btnText} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Page Footer */}
        <PhoneChatDispatch />
      </div>
    </>
  );
}
