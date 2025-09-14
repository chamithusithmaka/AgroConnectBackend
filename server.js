// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require('cookie-parser');

// Route files
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes'); // Add this line
const storyRoutes = require('./routes/storyRoutes');

dotenv.config(); // Load .env file
connectDB(); // Connect to database

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(cookieParser());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); // Add this line
app.use('/api/products', require('./routes/productRoutes')); // Product routes
app.use('/api/stories', storyRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

