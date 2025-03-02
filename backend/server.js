require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json()); // Allows JSON data in requests
app.use(cors()); // Enables CORS for frontend communication

// Check if MongoDB URI is defined
if (!process.env.MONGO_URI) {
  console.error("MongoDB URI is missing. Check your .env file.");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
const userRoutes = require("./backend/routes/userRoutes");
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

