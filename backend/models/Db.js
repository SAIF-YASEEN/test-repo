// server/db.js
const mongoose = require("mongoose");

/**
 * @description Connect to MongoDB using Mongoose
 */
const connectDB = async () => {
  const uri = "mongodb+srv://saifurrehman0708:saifurrehman0708@saifcluster.dcw3i.mongodb.net/?retryWrites=true&w=majority&appName=SAIFCLUSTER";

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
