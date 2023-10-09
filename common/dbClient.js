const mongoose = require("mongoose");
const process = require("process");

const dbClient = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database.");
  } catch (error) {
    console.log("Error in DB connection", error);
  }
};

module.exports = dbClient;
