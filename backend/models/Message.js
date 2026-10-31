const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  orderId: String,
  sender: String, // "student" or "admin"
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);