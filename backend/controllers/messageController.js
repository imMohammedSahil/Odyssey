const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const rawOrderId = req.params.orderId;
    if (typeof rawOrderId !== "string" || !rawOrderId.trim()) {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    const orderId = String(rawOrderId).trim();
    const messages = await Message.find({ orderId: { $eq: orderId } });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendMessage, getMessages };
