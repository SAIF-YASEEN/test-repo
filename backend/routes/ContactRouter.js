const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact"); // Import the Contact model

// POST route to save contact information
router.post("/contact", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: "Email and message are required." });
  }

  try {
    const newContact = new Contact({
      email,
      message,
    });

    await newContact.save();

    res.status(201).json({
      message: "Contact saved successfully.",
      contact: newContact,
    });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({
      message: "Failed to save contact.",
      error: error.message,
    });
  }
});

// GET route to fetch all contact data and render as HTML table
router.get("/contact", async (req, res) => {
  try {
    // Fetch all contacts from the database, sorted by 'createdAt' in descending order
    const contacts = await Contact.find().sort({ createdAt: -1 });

    // Start HTML response to display contact data as a table
    let responseHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Information</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f8f9fa;
              padding: 20px;
              margin: 0;
            }
            h1 {
              text-align: center;
              color: #333;
            }
            table {
              margin: auto;
              border-collapse: collapse;
              width: 80%;
            }
            table, th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
            }
            td {
              background-color: #ffffff;
            }
          </style>
        </head>
        <body>
          <h1>Contact Information</h1>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Message</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
    `;

    // Loop through each contact and add their info to the table
    contacts.forEach((contact) => {
      responseHTML += `
        <tr>
          <td>${contact.email}</td>
          <td>${contact.message}</td>
          <td>${new Date(contact.createdAt).toLocaleString()}</td>
        </tr>
      `;
    });

    // Close the table and HTML structure
    responseHTML += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Send the response as HTML
    res.send(responseHTML);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).send("Failed to fetch contact data.");
  }
});

module.exports = router;
