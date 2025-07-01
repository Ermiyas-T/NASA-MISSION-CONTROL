const mongoose = require("mongoose");
const launchesSchema = mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  missionName: {
    type: String,
    required: true,
  },
  rocketType: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  customers: [String],
  upcomming: {
    type: Boolean,
    default: true,
  },
  success: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("Launch", launchesSchema);
