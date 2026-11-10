require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const orderRoutes = require("./routes/orderRoutes");
const ritualRoutes = require("./routes/ritualRoutes");
const profileRoutes = require("./routes/profileRoutes");
const stationeryRoutes = require("./routes/stationeryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campuscart";

let dbConnected = false;
mongoose.connect(MONGO_URI)
  .then(() => {
    dbConnected = true;
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    dbConnected = false;
    console.error("MongoDB connection error:", err);
  });

app.use("/api/orders", orderRoutes);
app.use("/api/ritual", ritualRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/stationery", stationeryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);

// Raw JSON health check endpoint for monitoring tools
app.get("/health", (req, res) => {
  res.json({
    status: dbConnected ? "healthy" : "degraded",
    service: "Odyssey API Gateway",
    version: "1.0.0",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// Branded interactive dashboard for browser visitors
app.get("/", (req, res) => {
  // If request explicitly asks for JSON, serve JSON
  if (req.headers.accept && req.headers.accept.includes("application/json") && !req.headers.accept.includes("text/html")) {
    return res.json({
      status: dbConnected ? "healthy" : "degraded",
      service: "Odyssey API Gateway",
      version: "1.0.0",
      database: dbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString()
    });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Odyssey API Gateway — Operational</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Titan+One&display=swap" rel="stylesheet">
  <style>
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
      color: var(--void-black);
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Neo-Brutalist Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 14px;
    }
    ::-webkit-scrollbar-track {
      background: #0D0D0D;
      border-left: 3px solid #222222;
    }
    ::-webkit-scrollbar-thumb {
      background: #9DE869;
      border: 3px solid #0D0D0D;
      border-radius: 6px;
      box-shadow: inset -2px -2px 0px rgba(0, 0, 0, 0.4), inset 2px 2px 0px rgba(255, 255, 255, 0.5);
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #FF70A6;
    }

    /* Top Slime Green Navigation Banner */
    .top-bar {
      background-color: var(--slime-green);
      border-bottom: 4px solid var(--border-dark);
      padding: 16px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 0px rgba(0, 0, 0, 0.25);
    }

    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
      font-size: 24px;
      letter-spacing: 1px;
      color: var(--void-black);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-badge {
      font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
      background: var(--hazard-gold);
      color: var(--void-black);
      font-size: 11px;
      letter-spacing: 0.8px;
      padding: 4px 12px;
      border-radius: 999px;
      border: 2.5px solid var(--border-dark);
      box-shadow: var(--shadow-comic-sm);
    }

    /* Main Content Area */
    .main-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px 60px;
      background-image: 
        radial-gradient(circle, rgba(157, 232, 105, 0.08) 1.5px, transparent 1.5px);
      background-size: 24px 24px;
    }

    .card-panel {
      background: var(--parchment);
      border: 3.5px solid var(--border-dark);
      border-radius: 20px;
      box-shadow: var(--shadow-comic-lg);
      max-width: 780px;
      width: 100%;
      padding: 34px 30px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Card Header */
    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 3px dashed rgba(13, 13, 13, 0.2);
      padding-bottom: 22px;
    }

    .hero-title {
      font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
      font-size: clamp(30px, 4.5vw, 46px);
      text-transform: uppercase;
      color: var(--brain-pink);
      -webkit-text-stroke: 2.5px var(--border-dark);
      paint-order: stroke fill;
      text-shadow: 4px 4px 0px var(--border-dark);
      line-height: 1.05;
      letter-spacing: 1.2px;
      margin-bottom: 8px;
    }

    .hero-subtitle {
      font-size: 14.5px;
      font-weight: 700;
      color: #2D3748;
      letter-spacing: 0.2px;
    }

    /* Feature Telemetry Grid */
    .telemetry-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    .telemetry-box {
      border: 3px solid var(--border-dark);
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: var(--shadow-comic-sm);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .telemetry-box.box-green { background: var(--slime-green); }
    .telemetry-box.box-gold { background: var(--hazard-gold); }
    .telemetry-box.box-seafoam { background: var(--seafoam); }
    .telemetry-box.box-pink { background: var(--brain-pink); }

    .telemetry-label {
      font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
      font-size: 11px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: var(--void-black);
    }

    .telemetry-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13.5px;
      font-weight: 700;
      color: var(--void-black);
    }

    /* Manifest Section */
    .manifest-wrap {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .manifest-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .manifest-badge {
      font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
      font-size: 11px;
      background: var(--void-black);
      color: var(--slime-green);
      padding: 4px 10px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }

    .manifest-title {
      font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
      font-size: 13px;
      text-transform: uppercase;
      color: var(--void-black);
      letter-spacing: 0.8px;
    }

    .routes-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .route-row {
      border: 3px solid var(--border-dark);
      border-radius: 12px;
      padding: 14px 18px;
      box-shadow: var(--shadow-comic-sm);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 18px;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
      color: var(--void-black);
    }

    .route-row:hover {
      transform: translate(-1.5px, -1.5px);
      box-shadow: var(--shadow-comic);
    }

    /* Solid Signature Colors for Each Row */
    .route-row.row-pink { background: var(--brain-pink); }
    .route-row.row-gold { background: var(--hazard-gold); }
    .route-row.row-seafoam { background: var(--seafoam); }
    .route-row.row-green { background: var(--slime-green); }

    .route-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 220px;
      flex-shrink: 0;
    }

    .method-pill {
      font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      background: var(--void-black);
      color: #FFFFFF;
      letter-spacing: 0.5px;
    }

    .route-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13.5px;
      font-weight: 800;
      color: var(--void-black);
      letter-spacing: 0.2px;
    }

    .route-desc {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Action Buttons */
    .actions-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 6px;
    }

    .comic-btn {
      flex: 1;
      height: 46px;
      padding: 0 16px;
      border-radius: 10px;
      border: 3.5px solid var(--border-dark);
      font-family: 'Titan One', 'Archivo Black', cursive, sans-serif;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: var(--shadow-comic);
      cursor: pointer;
      transition: transform 0.08s ease, box-shadow 0.08s ease;
      color: var(--void-black);
    }

    .comic-btn:hover {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px var(--border-dark);
    }

    .btn-pink { background: var(--brain-pink); }
    .btn-gold { background: var(--hazard-gold); }
    .btn-green { background: var(--slime-green); }

    @media (max-width: 640px) {
      .card-panel { padding: 22px 18px; }
      .telemetry-grid { grid-template-columns: 1fr; }
      .actions-row { flex-direction: column; }
      .comic-btn { width: 100%; }
      .route-desc { display: none; }
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="brand-wrap">
      <a href="https://odyssey-official.vercel.app" class="brand-logo" target="_blank" rel="noopener noreferrer">
        ODYSSEY
      </a>
      <span class="brand-badge">REST GATEWAY</span>
    </div>
  </div>

  <div class="main-wrap">
    <div class="card-panel">
      <div class="card-header">
        <div>
          <h1 class="hero-title">API GATEWAY</h1>
          <p class="hero-subtitle">High-Throughput Campus Cart & Stationery Requisition Tier</p>
        </div>
      </div>

      <div class="telemetry-grid">
        <div class="telemetry-box box-green">
          <div class="telemetry-label">DATABASE PERSISTENCE</div>
          <div class="telemetry-value">${dbConnected ? "MongoDB Atlas (Online)" : "Connecting..."}</div>
        </div>
        <div class="telemetry-box box-gold">
          <div class="telemetry-label">RUNTIME ENGINE</div>
          <div class="telemetry-value">Node.js + Express 5</div>
        </div>
        <div class="telemetry-box box-seafoam">
          <div class="telemetry-label">CLOUD INFRASTRUCTURE</div>
          <div class="telemetry-value">Oregon, US (Render Cloud)</div>
        </div>
        <div class="telemetry-box box-pink">
          <div class="telemetry-label">CONNECTED CLIENT</div>
          <div class="telemetry-value">Vercel Production</div>
        </div>
      </div>

      <div class="manifest-wrap">
        <div class="manifest-header">
          <span class="manifest-badge">ROUTES</span>
          <span class="manifest-title">Active Gateway Manifest</span>
        </div>
        <div class="routes-list">
          <div class="route-row row-pink">
            <div class="route-left">
              <span class="method-pill">POST</span>
              <span class="route-path">/api/orders</span>
            </div>
            <span class="route-desc">Student checkout & requisition queue manifest</span>
          </div>
          <div class="route-row row-gold">
            <div class="route-left">
              <span class="method-pill">POST</span>
              <span class="route-path">/api/ritual/session</span>
            </div>
            <span class="route-desc">Dynamic UPI QR payment handshake</span>
          </div>
          <div class="route-row row-seafoam">
            <div class="route-left">
              <span class="method-pill">GET</span>
              <span class="route-path">/api/profile/:id</span>
            </div>
            <span class="route-desc">Student history & avatar telemetry</span>
          </div>
          <div class="route-row row-green">
            <div class="route-left">
              <span class="method-pill">GET</span>
              <span class="route-path">/api/stationery</span>
            </div>
            <span class="route-desc">Aisles & inventory specifications</span>
          </div>
        </div>
      </div>

      <div class="actions-row">
        <a href="https://odyssey-official.vercel.app" class="comic-btn btn-pink" target="_blank" rel="noopener noreferrer">
          Launch Web App →
        </a>
        <a href="https://github.com/imMohammedSahil/Odyssey" class="comic-btn btn-gold" target="_blank" rel="noopener noreferrer">
          GitHub Repo ↗
        </a>
        <a href="/health" class="comic-btn btn-green" target="_blank">
          Health JSON ↗
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;

  res.send(html);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
