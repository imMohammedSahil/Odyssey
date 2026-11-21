const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many order requests, please try again later." }
});

router.use(orderLimiter);

const {
  createOrder,
  getOrders,
  updateOrderStatus
} = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/", createOrder);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
