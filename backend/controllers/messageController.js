const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.json(message);
};

const getMessages = async (req, res) => {
  const messages = await Message.find({ orderId: req.params.orderId });
  res.json(messages);
};

module.exports = { sendMessage, getMessages };