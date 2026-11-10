const express = require("express");
const router = express.Router();
const os = require("os");

// In-memory session store for transient ritual offering sessions
const ritualSessions = new Map();

// Helper to determine the local Wi-Fi / LAN IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Prefer non-internal IPv4 addresses (Wi-Fi or Ethernet)
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

// 1. Get network information for QR code generation
router.get("/network-info", (req, res) => {
  const localIp = getLocalIpAddress();
  res.json({
    localIp,
    frontendPort: 3000,
    backendPort: 5000,
    timestamp: Date.now()
  });
});

// 2. Create or register a ritual session
router.post("/session", (req, res) => {
  const { total = 150, items = [] } = req.body;
  const sessionId = "ritual_" + Date.now() + "_" + Math.floor(1000 + Math.random() * 9000);
  const localIp = getLocalIpAddress();

  const sessionData = {
    id: sessionId,
    total,
    items,
    status: "pending",
    createdAt: Date.now(),
    completedAt: null
  };

  ritualSessions.set(sessionId, sessionData);

  // Clean up sessions older than 1 hour to prevent memory leaks
  const oneHourAgo = Date.now() - 3600000;
  for (const [key, sess] of ritualSessions.entries()) {
    if (sess.createdAt < oneHourAgo) {
      ritualSessions.delete(key);
    }
  }

  const offerUrl = `http://${localIp}:3000/ritual-offering?session=${sessionId}&total=${total}`;

  res.status(201).json({
    sessionId,
    offerUrl,
    localIp,
    status: "pending"
  });
});

// 3. Query ritual session status (polled by the laptop PaymentPage)
router.get("/status/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const session = ritualSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: "Ritual session not found or expired" });
  }

  res.json({
    sessionId: session.id,
    status: session.status,
    total: session.total,
    completedAt: session.completedAt
  });
});

// 4. Complete the ritual (triggered when phone opens or confirms the ritual)
router.post("/complete/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  let session = ritualSessions.get(sessionId);

  if (!session) {
    // If session expired or wasn't in memory, dynamically create it as completed
    session = {
      id: sessionId,
      status: "completed",
      total: req.body.total || 150,
      createdAt: Date.now(),
      completedAt: Date.now()
    };
    ritualSessions.set(sessionId, session);
  } else {
    session.status = "completed";
    session.completedAt = Date.now();
  }

  res.json({
    success: true,
    message: "Ritual completed! The altar has accepted the tribute.",
    status: "completed",
    sessionId: session.id
  });
});

module.exports = router;

