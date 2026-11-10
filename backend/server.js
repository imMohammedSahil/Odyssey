require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const orderRoutes = require("./routes/orderRoutes");
const ritualRoutes = require("./routes/ritualRoutes");
const profileRoutes = require("./routes/profileRoutes");
const stationeryRoutes = require("./routes/stationeryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campuscart";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/orders", orderRoutes);
app.use("/api/ritual", ritualRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/stationery", stationeryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ status: "healthy", service: "Odyssey API Gateway", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
