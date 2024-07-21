// Importing the mongoose library, which is used to interact with MongoDB.
const mongoose = require("mongoose");

// Defining a new schema for an appointment with various fields and their types/requirements.
const appointmentSchema = new mongoose.Schema(
{ 
  // Defining a new schema for the usertype = admin to add the apppointments in the application.
  date: { type: String, required: true },
  time: { type: String, required: true },
  isTimeSlotAvailable: { type: Boolean, required: true, default: true }
});

// This below line is exporting the Appointment model based on the defined schema.
module.exports = mongoose.model("Appointment", appointmentSchema);