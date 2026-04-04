const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 Database Connected");
  } catch (error) {
    console.log("💩 DB Error:", error);
  }
};

module.exports = { connect };