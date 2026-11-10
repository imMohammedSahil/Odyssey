const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");
const ritualRoutes = require("./routes/ritualRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/campuscart")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use("/api/orders", orderRoutes);
app.use("/api/ritual", ritualRoutes);

app.get("/", (req, res) => {
res.send("API Running");
});

app.listen(5000, () => console.log("Server running on port 5000"));
