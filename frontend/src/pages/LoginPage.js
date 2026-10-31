import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    min-height: 100vh;
    background: #0d0d10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    padding: 24px 16px;
    position: relative;
    overflow: hidden;
  }

  .lg-bg-glow {
    position: fixed;
    pointer-events: none;
    z-index: 0;
  }

  .lg-bg-glow.top {
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(109,86,210,0.09) 0%, transparent 65%);
  }

  .lg-bg-glow.bottom {
    bottom: -25%;
    left: 30%;
    width: 500px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(60,40,140,0.06) 0%, transparent 65%);
  }

  .lg-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    background: #13131a;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 22px;
    padding: 44px 40px 36px;
    box-shadow:
      0 0 0 1px rgba(109,86,210,0.06),
      0 24px 60px rgba(0,0,0,0.65),
      0 8px 24px rgba(0,0,0,0.4);
    animation: lgFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes lgFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Brand mark */
  .lg-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
  }

  .lg-logo-mark {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(109,86,210,0.25) 0%, rgba(80,60,180,0.15) 100%);
    border: 1px solid rgba(109,86,210,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    box-shadow: 0 4px 20px rgba(109,86,210,0.18);
  }

  .lg-logo-mark svg {
    width: 22px;
    height: 22px;
    color: #9b7ff0;
  }

  .lg-app-name {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #3d3b52;
    margin-bottom: 10px;
  }

  .lg-heading {
    font-size: 22px;
    font-weight: 600;
    color: #e8e6f0;
    letter-spacing: -0.025em;
    text-align: center;
    margin-bottom: 6px;
  }

  .lg-subheading {
    font-size: 13px;
    color: #4e4c65;
    text-align: center;
    line-height: 1.6;
  }

  /* Form */
  .lg-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 28px;
  }

  .lg-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .lg-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #4e4c65;
  }

  .lg-input-wrap {
    position: relative;
  }

  .lg-input-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #3d3b52;
    display: flex;
    transition: color 0.15s ease;
  }

  .lg-input-icon svg { width: 15px; height: 15px; }

  .lg-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px;
    padding: 12px 14px 12px 40px;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    color: #ccc9dd;
    outline: none;
    transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
    -webkit-appearance: none;
  }

  .lg-input::placeholder { color: #2e2d3e; }

  .lg-input:focus {
    border-color: rgba(109,86,210,0.55);
    background: rgba(109,86,210,0.04);
    box-shadow: 0 0 0 3px rgba(109,86,210,0.1);
  }

  .lg-input:focus + .lg-input-focus-ring { opacity: 1; }

  .lg-input-wrap:focus-within .lg-input-icon { color: #6d56d2; }

  /* Submit button */
  .lg-submit-btn {
    margin-top: 6px;
    width: 100%;
    padding: 14px 24px;
    background: linear-gradient(135deg, #6d56d2 0%, #5440be 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: 14.5px;
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
    box-shadow: 0 4px 20px rgba(109,86,210,0.35), 0 1px 3px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
  }

  .lg-submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
    pointer-events: none;
  }

  .lg-submit-btn:hover {
    transform: translateY(-1.5px);
    box-shadow: 0 8px 28px rgba(109,86,210,0.48), 0 2px 6px rgba(0,0,0,0.3);
    filter: brightness(1.05);
  }

  .lg-submit-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(109,86,210,0.2);
  }

  .lg-submit-btn svg { width: 15px; height: 15px; }

  /* Footer */
  .lg-footer {
    margin-top: 28px;
    padding-top: 22px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .lg-footer-lock { color: #2e2d3e; display: flex; }
  .lg-footer-lock svg { width: 12px; height: 12px; }
  .lg-footer-text { font-size: 11px; color: #2e2d3e; letter-spacing: 0.03em; }

  @media (max-width: 480px) {
    .lg-card { padding: 32px 24px 28px; border-radius: 18px; }
    .lg-heading { font-size: 20px; }
  }
`;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("role", "admin");
      sessionStorage.setItem("user", username);
      navigate("/admin-intro");
      return;
    }

    // student login
    sessionStorage.setItem("role", "student");
    sessionStorage.setItem("user", username);
    navigate("/student");
  };

  return (
    <>
      <style>{css}</style>
      <div className="lg-root">
        <div className="lg-bg-glow top"/>
        <div className="lg-bg-glow bottom"/>

        <div className="lg-card">
          {/* Brand */}
          <div className="lg-brand">
            <div className="lg-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
            </div>
            <p className="lg-app-name">Odyssey</p>
            <h1 className="lg-heading">Welcome back</h1>
            <p className="lg-subheading">Log in to your account to continue</p>
          </div>

          {/* Form */}
          <div className="lg-form">
            <div className="lg-field">
              <label className="lg-label">Username</label>
              <div className="lg-input-wrap">
                <span className="lg-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  className="lg-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            <div className="lg-field">
              <label className="lg-label">Password</label>
              <div className="lg-input-wrap">
                <span className="lg-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  className="lg-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            <button
              className="lg-submit-btn"
              onClick={() => {
                console.log("LOGIN CLICKED");
                handleLogin();
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Login
            </button>
          </div>

          {/* Footer */}
          <div className="lg-footer">
            <span className="lg-footer-lock">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </span>
            <span className="lg-footer-text">Secured · Encrypted · Private</span>
          </div>
        </div>
      </div>
    </>
  );
}