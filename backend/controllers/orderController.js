const mongoose = require("mongoose");
const Order = require("../models/Order");

// CREATE order
const createOrder = async (req, res) => {
  try {
    const { stationeryItems = [] } = req.body;

    // count existing orders
    const count = await Order.countDocuments();

    // generate order number
    const orderNumber = "OD-" + (1001 + count);

    const order = new Order({
      ...req.body,
      orderNumber,
      stationeryItems   // ✅ store stationery items
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE order status
const updateOrderStatus = async (req, res) => {
  try {
    const rawId = req.params.id;
    if (typeof rawId !== "string" || !mongoose.Types.ObjectId.isValid(rawId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const { status } = req.body;
    if (typeof status !== "string") {
      return res.status(400).json({ error: "Invalid status format" });
    }

    const order = await Order.findByIdAndUpdate(
      new mongoose.Types.ObjectId(rawId),
      { $set: { status: String(status).trim() } },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
