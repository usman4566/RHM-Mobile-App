const mongoose = require("mongoose");

// Define the schema
const ResetCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  resetCode: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const ResetCode = mongoose.model("ResetCode", ResetCodeSchema);

module.exports = ResetCode;
