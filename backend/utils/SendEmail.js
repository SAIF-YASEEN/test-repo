require("dotenv").config();
const nodemailer = require("nodemailer");

// Create the transporter for Gmail service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,   // The Gmail address you're using to send the email
    pass: process.env.PASSWORD, // The app password you generated
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    // Attempt to send the email
    await transporter.sendMail({
      from: process.env.EMAIL,  // From address (this is your Gmail address)
      to,                       // To address (the recipient's email)
      subject,                  // Subject line
      text,                     // Body of the email
    });
    console.log("Email sent successfully.");
  } catch (error) {
    // Log any errors if email fails to send
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
