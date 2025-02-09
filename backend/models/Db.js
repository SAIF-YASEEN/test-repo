// server/db.js
const mongoose = require("mongoose");
require("dotenv").config();

/**
 * @description Connect to MongoDB using Mongoose
 */
const connectDB = async () => {

  const uri = process.env.MONGO_URL;
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
