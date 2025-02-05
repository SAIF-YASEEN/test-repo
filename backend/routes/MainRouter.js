const express = require("express");
const {
  mainRouterGet,
  mainRouterPost,
  getUserProfile, // Import the new function
  sendOtp,
  verifyOtp,
} = require("../controllers/MainController");

const router = express.Router();

// Existing routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/main", mainRouterGet);
router.post("/main", mainRouterPost);
router.get("/user/profile", getUserProfile); // Create the API endpoint for fetching user profile

module.exports = router;
