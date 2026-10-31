const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: String,

  documents: [
    {
      originalName: String,
      storedName: String,
      copies: Number,
      color: Boolean
    }
  ],

  stationeryItems: [
    {
      name: String,
      quantity: Number
    }
  ],

  status: {
    type: String,
    default: "awaiting payment"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);