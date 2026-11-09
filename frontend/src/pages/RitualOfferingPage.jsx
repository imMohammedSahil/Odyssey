import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Titan+One&display=swap');

  :root {
    color-scheme: dark !important;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  html, body, #root {
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100% !important;
    height: 100% !important;
    background-color: #0A0D10 !important;
    background: radial-gradient(circle at 50% 25%, #182026 0%, #0D1114 60%, #06080A 100%) !important;
    color-scheme: dark !important;
    overflow: hidden !important;
    overscroll-behavior: none !important;
  }

  * {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  *::-webkit-scrollbar {
    display: none !important;
  }

  .ritual-mobile-root {
    min-height: 100vh;
    min-height: 100dvh;
    width: 100%;
    background-color: #0A0D10;
    background: radial-gradient(circle at 50% 25%, #182026 0%, #0D1114 60%, #06080A 100%);
    color: #F0ECE4;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 18px;
    padding-bottom: max(24px, env(safe-area-inset-bottom, 24px));
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Deep occult ambient background halo */
  .ritual-bg-glow {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 32%, rgba(190, 46, 46, 0.16) 0%, rgba(20, 26, 30, 0) 65%);
    pointer-events: none;
    z-index: 1;
    animation: ambientBreathe 6s ease-in-out infinite alternate;
  }

  @keyframes ambientBreathe {
    0% { opacity: 0.6; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1.05); }
  }

  /* Gothic Neo-Brutalist Offering Slab */
  .ritual-card {
    width: 100%;
    max-width: 380px;
    background: linear-gradient(180deg, #161D22 0%, #0F1418 100%);
    border: 3px solid #0D0D0D;
    border-radius: 18px;
    padding: 32px 22px 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    box-shadow: 6px 6px 0px #000000, 0 20px 48px rgba(0, 0, 0, 0.85);
    z-index: 10;
    overflow: hidden;
  }

  /* Subtle inner crimson hairline border */
  .ritual-card::before {
    content: "";
    position: absolute;
    inset: 3px;
    border: 1px solid rgba(190, 46, 46, 0.35);
    border-radius: 13px;
    pointer-events: none;
  }

  /* Authentic Sacred Alchemical Sigil */
  .ritual-sigil-wrap {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ritual-sigil-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 10px rgba(217, 38, 38, 0.45));
    animation: sigilPulse 3.5s ease-in-out infinite alternate;
  }

  @keyframes sigilPulse {
    0% { transform: scale(0.96); filter: drop-shadow(0 0 8px rgba(217, 38, 38, 0.35)); }
    100% { transform: scale(1.04); filter: drop-shadow(0 0 16px rgba(217, 38, 38, 0.65)); }
  }

  /* Ornate Altar Eyebrow Header */
  .ritual-altar-eyebrow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    margin-bottom: 8px;
  }

  .ritual-altar-line {
    flex: 1;
    max-width: 44px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(200, 159, 114, 0.45));
  }

  .ritual-altar-line.right {
    background: linear-gradient(90deg, rgba(200, 159, 114, 0.45), transparent);
  }

  .ritual-altar-glyph {
    font-size: 7px;
    color: #D92626;
    opacity: 0.85;
  }

  .ritual-altar-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: #C89F72;
    text-shadow: 0 0 10px rgba(200, 159, 114, 0.25);
  }

  .ritual-headline {
    font-family: 'Cinzel', serif;
    font-size: clamp(20px, 6.2vw, 24px);
    font-weight: 900;
    letter-spacing: 0.07em;
    color: #F8F5EE;
    text-transform: uppercase;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
    margin-bottom: 20px;
    white-space: nowrap;
  }

  /* Consecrated Tribute Box (Evil Dark Red Blood-Obsidian) */
  .ritual-amount-slab {
    width: 100%;
    background: linear-gradient(180deg, #2D0808 0%, #180404 100%);
    border: 2.5px solid #0D0D0D;
    border-radius: 14px;
    padding: 20px 14px 18px;
    margin-bottom: 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: inset 0 0 22px rgba(217, 38, 38, 0.25), 0 6px 18px rgba(0, 0, 0, 0.75);
    position: relative;
  }

  .ritual-amount-slab::before {
    content: "";
    position: absolute;
    inset: 2px;
    border: 1px solid rgba(220, 45, 45, 0.4);
    border-radius: 10px;
    pointer-events: none;
  }

  .ritual-amount-slab-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #E8A8A8;
    margin-bottom: 8px;
  }

  .ritual-amount-row {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
  }

  .ritual-amount-cur {
    font-family: 'Cinzel', serif;
    font-size: 28px;
    font-weight: 800;
    color: #E2A342;
  }

  .ritual-amount-val {
    font-family: 'Cinzel', serif;
    font-size: 44px;
    font-weight: 900;
    color: #FFFFFF;
    letter-spacing: 0.02em;
    text-shadow: 0 0 18px rgba(255, 255, 255, 0.3), 0 0 32px rgba(217, 38, 38, 0.4);
  }

  /* Single clean narrative sentence */
  .ritual-narrative {
    font-size: 13.5px;
    line-height: 1.6;
    color: #C2BBB0;
    margin-bottom: 22px;
    padding: 0 10px;
    font-style: italic;
  }

  /* Ledger Metadata Seal */
  .ritual-meta-bar {
    width: 100%;
    padding-top: 16px;
    border-top: 1px dashed rgba(200, 160, 114, 0.22);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    color: #6C747A;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .ritual-meta-sigil {
    color: #C89F72;
    font-weight: 700;
  }
`;

export default function RitualOfferingPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session") || "demo_session";
  const total = searchParams.get("total") || "150";

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const completeRitual = async () => {
    setLoading(true);
    try {
      // 1. Mark in localStorage and BroadcastChannel for instant cross-tab / local network sync
      localStorage.setItem("odyssey_ritual_completed_" + sessionId, "true");
      try {
        const bc = new BroadcastChannel("odyssey_ritual");
        bc.postMessage({ type: "RITUAL_COMPLETED", sessionId, total });
        bc.close();
      } catch (bcErr) {}

      // 2. Subtle physical haptic feedback on mobile
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([40, 30, 80]);
      }

      // 3. Notify backend API
      const backendHost = window.location.hostname || "localhost";
      try {
        await axios.post(`/api/ritual/complete/${sessionId}`, {
          total: Number(total),
        });
      } catch (proxyErr) {
        await axios.post(`http://${backendHost}:5000/api/ritual/complete/${sessionId}`, {
          total: Number(total),
        });
      }

      setCompleted(true);
    } catch (err) {
      setCompleted(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    completeRitual();
  }, [sessionId]);

  // Synchronize document body & mobile status bar color
  useEffect(() => {
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.name = "theme-color";
      document.head.appendChild(themeMeta);
    }
    const prevTheme = themeMeta.content;
    themeMeta.content = "#0A0D10";

    const prevBg = document.body.style.background;
    const prevOverflow = document.body.style.overflow;
    document.body.style.background = "#0A0D10";
    document.body.style.overflow = "hidden";

    return () => {
      themeMeta.content = prevTheme;
      document.body.style.background = prevBg;
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const sigilCode = sessionId.length > 6 ? sessionId.slice(-6).toUpperCase() : sessionId.toUpperCase();

  return (
    <>
      <style>{styles}</style>
      <div className="ritual-mobile-root">
        <div className="ritual-bg-glow" aria-hidden="true" />

        <div className="ritual-card">
          {/* Sacred Alchemical Sigil Emblem (matches the notice board occult circle) */}
          <div className="ritual-sigil-wrap" aria-hidden="true">
            <svg
              className="ritual-sigil-svg"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#8A1818"
                strokeWidth="1.2"
                strokeDasharray="4 2.5"
              />
              <circle cx="40" cy="40" r="31" stroke="#D92626" strokeWidth="1.5" />
              <circle
                cx="40"
                cy="40"
                r="25"
                stroke="rgba(226, 163, 66, 0.4)"
                strokeWidth="0.9"
              />
              <line x1="40" y1="10" x2="40" y2="18" stroke="#D92626" strokeWidth="1.4" />
              <line x1="40" y1="62" x2="40" y2="70" stroke="#D92626" strokeWidth="1.4" />
              <line x1="10" y1="40" x2="18" y2="40" stroke="#D92626" strokeWidth="1.4" />
              <line x1="62" y1="40" x2="70" y2="40" stroke="#D92626" strokeWidth="1.4" />
              <polygon
                points="40,22 49,40 40,58 31,40"
                fill="#1C090A"
                stroke="#D92626"
                strokeWidth="1.4"
              />
              <circle cx="40" cy="40" r="3.5" fill="#E2A342" />
            </svg>
          </div>

          {/* Ornate Shadow Altar Eyebrow */}
          <div className="ritual-altar-eyebrow" aria-hidden="true">
            <span className="ritual-altar-line" />
            <span className="ritual-altar-glyph">◆</span>
            <span className="ritual-altar-text">THE SHADOW ALTAR</span>
            <span className="ritual-altar-glyph">◆</span>
            <span className="ritual-altar-line right" />
          </div>

          <h1 className="ritual-headline">Offering Sealed</h1>

          {/* Consecrated Tribute Box (Evil Dark Red Blood-Obsidian) */}
          <div className="ritual-amount-slab">
            <span className="ritual-amount-slab-tag">Tribute Consecrated</span>
            <div className="ritual-amount-row">
              <span className="ritual-amount-cur">₹</span>
              <span className="ritual-amount-val">{total}</span>
            </div>
          </div>

          {/* Atmospheric Narrative */}
          <p className="ritual-narrative">
            The blood pact is sealed. Look upon your station terminal as the sacred parchment manifests.
          </p>

          {/* Altar Covenant Bar */}
          <div className="ritual-meta-bar">
            <span>COVENANT <span className="ritual-meta-sigil">#{sigilCode}</span></span>
            <span>SOUL CONSECRATED</span>
          </div>
        </div>
      </div>
    </>
  );
}
