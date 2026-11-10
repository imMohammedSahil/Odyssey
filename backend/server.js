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
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #07090E;
      color: #E2E8F0;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      overflow-x: hidden;
    }
    .bg-grid {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
    }
    .glow {
      position: absolute;
      width: 480px;
      height: 480px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
    .container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 680px;
      background: rgba(13, 17, 23, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 36px 32px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .title-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      color: #10B981;
      font-family: 'JetBrains Mono', monospace;
    }
    .beacon {
      width: 8px;
      height: 8px;
      background-color: #10B981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10B981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    h1 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #FFFFFF;
    }
    .subtitle {
      font-size: 13px;
      color: #94A3B8;
      margin-top: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 14px 16px;
    }
    .card-label {
      font-size: 11px;
      color: #64748B;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .card-value {
      font-size: 13.5px;
      font-weight: 600;
      color: #F1F5F9;
      font-family: 'JetBrains Mono', monospace;
    }
    .endpoints-title {
      font-size: 12px;
      color: #94A3B8;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 12px;
    }
    .endpoints-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 28px;
    }
    .endpoint {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }
    .method {
      font-weight: 700;
      color: #38BDF8;
      font-size: 11px;
      padding: 2px 6px;
      background: rgba(56, 189, 248, 0.1);
      border-radius: 4px;
      margin-right: 8px;
    }
    .path { color: #E2E8F0; }
    .desc { color: #64748B; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11.5px; }
    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 20px;
    }
    .btn {
      flex: 1;
      padding: 12px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      text-align: center;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-primary {
      background: #10B981;
      color: #041F14;
    }
    .btn-primary:hover {
      background: #059669;
      color: #FFFFFF;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      color: #CBD5E1;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #FFFFFF;
    }
    @media (max-width: 580px) {
      .grid { grid-template-columns: 1fr; }
      .actions { flex-direction: column; }
      .endpoint .desc { display: none; }
    }
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="glow"></div>
  <div class="container">
    <div class="header">
      <div>
        <h1>Odyssey API Gateway</h1>
        <div class="subtitle">Decoupled RESTful Service Architecture</div>
      </div>
      <div class="badge">
        <span class="beacon"></span>
        <span>ONLINE</span>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-label">Database Status</div>
        <div class="card-value">${dbConnected ? "MongoDB Atlas (Online)" : "Connecting..."}</div>
      </div>
      <div class="card">
        <div class="card-label">Runtime Engine</div>
        <div class="card-value">Node.js + Express 5</div>
      </div>
      <div class="card">
        <div class="card-label">Deployment Region</div>
        <div class="card-value">Oregon, US (Render)</div>
      </div>
      <div class="card">
        <div class="card-label">Client Application</div>
        <div class="card-value">Vercel Production</div>
      </div>
    </div>

    <div class="endpoints-title">Active Gateway Routes</div>
    <div class="endpoints-list">
      <div class="endpoint">
        <div><span class="method">POST</span><span class="path">/api/orders</span></div>
        <span class="desc">Student checkout & queue manifest</span>
      </div>
      <div class="endpoint">
        <div><span class="method">POST</span><span class="path">/api/ritual/session</span></div>
        <span class="desc">Dynamic UPI QR payment handshake</span>
      </div>
      <div class="endpoint">
        <div><span class="method">GET</span><span class="path">/api/profile/:id</span></div>
        <span class="desc">Student history & avatar telemetry</span>
      </div>
      <div class="endpoint">
        <div><span class="method">GET</span><span class="path">/api/stationery</span></div>
        <span class="desc">Aisles & inventory specifications</span>
      </div>
    </div>

    <div class="actions">
      <a href="https://odyssey-official.vercel.app" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
        Launch Web Application →
      </a>
      <a href="https://github.com/imMohammedSahil/Odyssey" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
        GitHub Repository ↗
      </a>
      <a href="/health" class="btn btn-secondary" target="_blank">
        Raw Health JSON ↗
      </a>
    </div>
  </div>
</body>
</html>`;

  res.send(html);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
