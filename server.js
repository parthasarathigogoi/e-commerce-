require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./backend/models/User"); // Import User Model
const adminRoutes = require("./backend/routes/adminroutes"); // Import Admin Routes

const app = express();
const server = http.createServer(app);

app.use(express.json()); // Middleware to parse JSON data
app.use(cors()); // Enable CORS

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

// User Registration Route
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "✅ User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error });
  }
});

// User Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "❌ Invalid Email or Password!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid Email or Password!" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.status(200).json({ message: "✅ Login Successful!", token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error });
  }
});

// Admin Routes
app.use("/api/admin", adminRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});