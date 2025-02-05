const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetCode: Number,
    lastUsernameChange: { type: Date, default: Date.now }, // Added field
  },
  {
    timestamps: true, // Automatically create createdAt & updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
