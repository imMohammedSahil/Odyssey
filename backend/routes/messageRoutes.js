const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { sendMessage, getMessages } = require("../controllers/messageController");

const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many message requests, please try again later." }
});

router.use(messageLimiter);

router.post("/", sendMessage);
router.get("/:orderId", getMessages);

module.exports = router;
