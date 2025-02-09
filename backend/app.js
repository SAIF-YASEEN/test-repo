const express = require("express");
const cors = require("cors");
const connectDB = require("./models/Db");
const MainRouter = require("./routes/MainRouter");
const ContactRouter = require("./routes/ContactRouter");
const profileRoute = require("./routes/ProfileRoute");
const ForgotPasswordRouter = require("./routes/ForgotPassword");
const userRoutes = require("./routes/DeleteUser"); // Update path as necessary
require("dotenv").config();
const User = require("./models/User");
const app = express();
const Profile = require("./models/Profile"); // Correctly import the Profile model

const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use("/", MainRouter);
app.use("/", ContactRouter);
app.use("/", ForgotPasswordRouter);
app.use("/api/auth", ForgotPasswordRouter);
app.use("/", profileRoute);
app.use("/api/users", userRoutes);
// Example: API route for fetching user details

app.get("/", (req, res) => {
  res.send("get page");
});
app.get("/api/users/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "name email createdAt updatedAt"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});
// In your backend (e.g., in userRoutes.js)

// Update username endpoint
app.post("/update-username", async (req, res) => {
  const { email, username } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Email and username are required" });
  }

  try {
    // Find the profile by email and update the username
    const profile = await Profile.findOneAndUpdate(
      { email }, // Assuming email is unique
      { $set: { username } },
      { new: true } // Return the updated profile
    );

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Username updated successfully",
      profile: {
        username: profile.username,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating username", error });
  }
});

// Example: API route for fetching user profile by email
app.get("/api/users/:email", async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.email }).select(
      "username email createdAt updatedAt"
    );
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

// Example: API route for fetching user details
app.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If user is not found, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back the user data including createdAt and updatedAt
    res.json({
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Example: API route for fetching user profile by email
app.get("/api/users/:email", async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.email }).select(
      "username email createdAt updatedAt"
    );
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

app.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ createdAt: user.createdAt, username: user.name });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});
app.get("/profile/:email", async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.email });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ updatedAt: profile.updatedAt });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile data" });
  }
});
// Email validation endpoint
app.get("/validate-email", async (req, res) => {
  const { email } = req.query;

  try {
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=39cd6d6d4dbe4019b3ebde960b9104fc&email=${email}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error validating email:", error);
    res.status(500).json({ error: "Email validation failed" });
  }
});
connectDB();

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
