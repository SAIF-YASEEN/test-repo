const User = require("../models/User"); // Import User model
const bcrypt = require("bcrypt"); // For hashing passwords
const nodemailer = require("nodemailer");

const otpStorage = new Map(); // Temporary store for OTPs
require("dotenv").config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saifurrehman0708@gmail.com", // The Gmail address you're using to send the email
    pass: process.env.PASSWORD, // Replace with your App password (not your actual password)
  },
  secure: true, // Use TLS encryption
});

// Function to send OTP
const sendOtpEmail = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  otpStorage.set(email, otp); // Store OTP temporarily

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully!" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Error sending OTP" };
  }
};

// API to send OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const result = await sendOtpEmail(email);
  if (result.success) {
    res.json({ message: result.message });
  } else {
    res.status(500).json({ message: result.message });
  }
};

// API to verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required" });

  const storedOtp = otpStorage.get(email);
  if (storedOtp && storedOtp == otp) {
    otpStorage.delete(email);
    res.json({ message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ message: "Invalid OTP or OTP expired" });
  }
};

/**
 * @description Fetch all registered users from the database and display them as an HTML table
 * @route GET /main
 */
const mainRouterGet = async (req, res) => {
  try {
    // Retrieve user details (name, email) from the database
    const users = await User.find({}, "name email password id").lean();

    // Construct HTML rows for each user
    const userRows = users.map(
      (user) =>
        `<tr><td>${user.name}</td><td>${user.email}</td><td>${user.password}</td></tr>`
    );

    // Return an HTML page with the user data
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Registered Users</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            table {
              margin: auto;
              border-collapse: collapse;
              width: 50%;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Registered Users</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              ${userRows.join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching user data");
  }
};

/**
 * @description Register a new user into the database
 * @route POST /main
 */
const mainRouterPost = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Fetch user profile data
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user is authenticated and their id is available in req.user
    const user = await User.findById(userId).select("name email"); // Select fields you want to return
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};
module.exports = {
  mainRouterGet,
  mainRouterPost,
  getUserProfile,
  sendOtp,
  verifyOtp,
};
