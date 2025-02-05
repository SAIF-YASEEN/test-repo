const express = require("express");
const router = express.Router();
const UserController = require("../controllers/DeleteController");

// Login Route
router.post("/login", UserController.login);

// Delete User Route
router.delete("/delete", UserController.deleteUser);

module.exports = router;
