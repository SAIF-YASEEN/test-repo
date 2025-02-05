const express = require("express");
const router = express.Router();
const multer = require("multer");
const Profile = require("../models/Profile");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Ensure unique filenames
  },
});

const upload = multer({ storage }); // File storage configuration

// Serve static files from the uploads directory
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// POST: Complete Profile
// POST: Complete Profile
router.post(
  "/complete-profile",
  upload.single("profilePicture"), // File upload handler
  async (req, res) => {
    try {
      const {
        username,
        email,
        dob,
        gender,
        city,
        country,
        bio,
        address,
        phone,
        education,
        github,
        linkedin,
        facebook,
        instagram,
      } = req.body;

      // Check if required fields are missing
      if (!username || !email || !dob || !gender || !city || !country) {
        return res
          .status(400)
          .json({ message: "Required fields are missing." });
      }

      // Check if profile with this email already exists
      let profile = await Profile.findOne({ email });

      // If profile exists, update it
      if (profile) {
        profile.username = username;
        profile.dob = dob;
        profile.gender = gender;
        profile.city = city;
        profile.country = country;
        profile.bio = bio;
        profile.address = address;
        profile.phone = phone;
        profile.education = education;
        profile.github = github;
        profile.linkedin = linkedin;
        profile.facebook = facebook;
        profile.instagram = instagram;

        if (req.file) {
          profile.profilePicture = `/uploads/${req.file.filename}`; // Update profile picture if uploaded
        }

        await profile.save(); // Save updated profile
        return res.status(200).json(profile); // Return the updated profile
      }

      // If no profile exists, create a new one
      const profilePicture = req.file ? `/uploads/${req.file.filename}` : "";

      profile = new Profile({
        username,
        email,
        dob,
        gender,
        city,
        country,
        bio,
        address,
        phone,
        education,
        github,
        linkedin,
        facebook,
        instagram,
        profilePicture,
      });

      await profile.save(); // Save new profile

      res.status(201).json(profile); // Return the created profile
    } catch (error) {
      console.error("Error creating or updating profile:", error);
      res.status(500).json({
        message: "Failed to create or update profile.",
        error: error.message,
      });
    }
  }
);

router.get("/complete-profile", async (req, res) => {
  try {
    const email = req.query.email; // Get email from query params
    console.log("Received request for email:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const profile = await Profile.findOne({ email });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile data" });
  }
});

module.exports = router;
