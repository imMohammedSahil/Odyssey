const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus
} = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/", createOrder);

// update order status
router.patch("/:id/status", updateOrderStatus);

module.exports = router;