// Requiring the DB (Schema).
const User = require("../models/user");

// Importing necessary models and libraries.
const Appointment = require("../models/appointment");

// Controller function for adding appointments by Admin.
const addAppointment = (req, res) => 
{
  // This below if statement will check if the user is authenticated and the userType is Admin.
  if (res.locals.isAuthenticated && res.locals.user.userType === "Admin") {
    const { date, times } = req.body;

    console.log("Received appointment data:", { date, times });

    // This below if condition will check if date and times are provided.
    if (!date || !times) 
    {
      console.log("Missing date or times in request body");
      return res.status(400).send("Missing date or times in request body");
    }

    // Creating an array of appointment slots
    const appointments = Array.isArray(times)
      ? times.map((time) => (
        {
          date,
          time,
          isTimeSlotAvailable: true,
        }))
      : [{ date, time: times, isTimeSlotAvailable: true }];

    console.log("Appointments to be added:", appointments);

    const timeSlots = Array.isArray(times) ? times : [times];

    // This will check if any of the provided time slots already exist for the given date.
    Appointment.find({ date, time: { $in: timeSlots } })
      .then((existingAppointments) => 
      {
        if (existingAppointments.length > 0) 
        {
          req.session.message = "Some time slots are already booked";
          return res.redirect("/appointment");
        } 
        else 
        {
          // This will insert the new appointment slots into the MongoDB database.
          Appointment.insertMany(appointments)
            .then((insertedAppointments) => 
            {
              console.log(
                "Appointments added successfully:",
                insertedAppointments
              );
              req.session.message = "Appointments added successfully";
              res.redirect("/appointment");
            })
            .catch((err) => 
            {
              console.log("Error adding appointments:", err);
              res.status(500).send("Error adding appointments");
            });
        }
      })
      .catch((err) => 
      {
        console.log("Error checking existing appointments:", err);
        res.status(500).send("Error checking existing appointments");
      });
  }
  // This else condition will redirect to login if the user is not an Admin
  else 
  {
    res.redirect("/login");
  }
};

// Exporting the whole controller and is used in the routes folder.
module.exports = { addAppointment };
