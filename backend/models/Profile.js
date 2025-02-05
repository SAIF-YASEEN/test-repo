const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    dob: String,
    gender: String,
    city: String,
    country: String,
    bio: String,
    address: String,
    phone: String,
    education: String,
    github: String,
    linkedin: String,
    facebook: String,
    instagram: String,
    profilePicture: String,
  },
  { timestamps: true } // This adds createdAt and updatedAt automatically
);

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
