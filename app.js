require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const partyRoutes = require("./routes/partyRoutes");
const voteRoutes = require("./routes/voteRoutes");

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Root route (health check)
app.get("/", (req, res) => {
  res.status(200).json({ message: "API running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/party", partyRoutes);
app.use("/api/vote", voteRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("UNCAUGHT ERROR:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message,
  });
});

module.exports = app;
