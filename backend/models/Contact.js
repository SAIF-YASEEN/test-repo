// models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }, // Store the time and date automatically
  },
  {
    timestamps: true, // This will automatically create `createdAt` and `updatedAt` fields
  }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
