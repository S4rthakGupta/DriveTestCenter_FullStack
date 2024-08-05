// Importing the mongoose library, which is used to interact with MongoDB.
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Defining a new schema for a user with various fields and their types/requirements.
const userSchema = new mongoose.Schema(
{
  // Defining a new schema for a user to enter the login creditionals.
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  
  // Like the user's first name should be a String and it is a required field.
  firstName: { type: String, default: "default" },
  lastName: { type: String, default: "default" },
  licenseNumber: { type: String, default: "default" },
  age: { type: Number, default: 0 },
  
  // Below is the nested object to store details about the user's car.
  carDetails: {
    make: { type: String, default: "default" },
    model: { type: String, default: "default" },
    year: { type: Number, default: 0 },
    plateNumber: { type: String, default: "default" }
  },
  
  // This below is the reference to the appointment document, using ObjectId to link to the appointment.js model in the models folder.
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },

  // This is for the Examiner userType and it will store information of the test result of the Driver.
  testType: { type: String},
  Comments: { type: String},
  isPassed: { type: Boolean}
});

// Hashing the password before saving user document.
userSchema.pre("save", async function (next) 
{
  
  // This conditional statement will check if the password field is modified or if this is a new document.
  if (this.isModified("password") || this.isNew) 
  {
    // This will hash the password with bcrypt and set it on the user document.
    this.password = await bcrypt.hash(this.password, 10);
  }
  // It will proceed to the next middleware or save operation.
  next();
});

// This below line is exporting the User model based on the defined schema.
module.exports = mongoose.model("User", userSchema);