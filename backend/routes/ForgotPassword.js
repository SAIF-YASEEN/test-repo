// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/SendEmail");
const path = require("path");
const router = express.Router();

// JWT secret key (use a more secure key in production)
const JWT_SECRET = "your-secret-key";

// Login Route (Authentication and JWT issuance)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Respond with token and user info
    res.status(200).json({
      success: true,
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Send Password Reset Code
router.post("/reset", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit reset code
    user.resetCode = resetCode;
    await user.save();

    await sendEmail(
      email,
      "Your Password Reset Code",
      `Your password reset code is: ${resetCode}`
    );

    res.status(200).json({ message: "Reset code sent to your email" });
  } catch (error) {
    console.error("Error sending reset code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify Password Reset Code
router.post("/verify-reset-code", async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetCode !== parseInt(resetCode)) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    res.status(200).json({ message: "Reset code verified" });
  } catch (error) {
    console.error("Error verifying reset code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10); // Hash new password
    user.resetCode = null; // Clear the reset code
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Middleware to verify JWT and get user data
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // Proceed to the next middleware/route
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Profile Route (Only accessible with valid JWT token)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Account Route
router.delete("/delete-account", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
