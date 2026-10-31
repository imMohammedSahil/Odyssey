const Order = require("../models/Order");

// CREATE order
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
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status },
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