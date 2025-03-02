require("dotenv").config(); // Load environment variables
const User = require("./backend/models/User");
const Product = require("./backend/models/product");


const express = require("express");
const mongoose = require("mongoose");
const http = require("http");

const app = express();
const server = http.createServer(app);

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Basic Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
