require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./backend/models/User"); // Import User Model
const adminRoutes = require("./backend/routes/adminRoutes"); // Fix import path case
const productsRouter = require('./routes/products');

const app = express();
const server = http.createServer(app);

app.use(express.json()); // Middleware to parse JSON data
app.use(cors()); // Enable CORS
app.use(express.static('public'));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

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

    // Check if the registered email is the admin
    const isAdmin = email === process.env.ADMIN_EMAIL;

    // Save new user
    const newUser = new User({ name, email, password: hashedPassword, isAdmin });
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
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.status(200).json({ 
      message: "✅ Login Successful!", 
      token, 
      userId: user._id, 
      isAdmin: user.isAdmin, 
      redirectTo: "/" // Redirecting to home page after successful login
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error });
  }
});

// Middleware to check if user is admin
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from headers
    if (!token) return res.status(403).json({ message: "❌ Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: "❌ Access Denied" });

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "❌ Invalid Token" });
  }
};

// Protected Admin Route
app.use("/api/admin", verifyAdmin, adminRoutes);

// Routes
app.use('/api/products', productsRouter);

// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
