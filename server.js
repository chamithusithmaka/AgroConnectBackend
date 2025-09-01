// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config(); // Load .env file
connectDB(); // Connect to database

const app = express();
app.use(cors());
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

