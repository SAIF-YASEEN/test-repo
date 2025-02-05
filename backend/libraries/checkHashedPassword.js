const bcrypt = require("bcrypt");

// User input (the password they enter during login)
const userInput = "1234";

// Stored hashed password from the database
const storedHash =
  "$$2b$10$v0v5TCqNpJ0NR4wAsihHI.8RyP9mJtalmHiIkUStioBeBZ9Msvhai"; // Example hashed password

// Compare hashed password with the user input
bcrypt.compare(userInput, storedHash, (err, isMatch) => {
  if (err) {
    console.error("Error comparing passwords:", err);
  } else if (isMatch) {
    console.log("Password is correct!");
  } else {
    console.log("Invalid password!");
  }
});
