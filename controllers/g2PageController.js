// Requiring the DB (Schema).
const User = require("../models/user");

// Importing necessary models and libraries.
const Appointment = require("../models/appointment");
// Using this library to manipulate date and times.
const moment = require("moment");

// Rendering the G2 page for Drivers with available appointment slots.
const g2Page = (req, res) => 
{
  if (res.locals.isAuthenticated && res.locals.user.userType === "Driver") 
  {
    const userId = res.locals.user._id;
    
    // Get the selected date from the query parameters, defaulting to today's date if not provided.
    const selectedDate = req.query.date || moment().format("YYYY-MM-DD");

    // Finding the user by the userID.
    User.findById(userId)
      .then((user) => 
      {        
        // Finding all available appointment slots for the selected date.
        Appointment.find({ date: selectedDate, isTimeSlotAvailable: true })
          .then((appointments) => 
          {            
            // Retrieve and clear any messages from the session.
            const message = req.session.message;
            delete req.session.message;

            // This will fetch the user's current appointment if any
            const userAppointment = user.appointment
              ? appointments.find(
                  (appointment) =>
                    appointment._id.toString() === user.appointment.toString()
                )
              : null;

            // This will check if the user has provided all personal information
            const hasPersonalInfo =
              user.firstName && user.lastName && user.licenseNumber && user.age;

            console.log("User object for G2 page:", user);
            
            // Rendering the G2 page with the retrieved data.
            res.render("pages/g2", 
            {
              title: "G2 Page",
              user,
              appointments,
              selectedDate,
              message,
              userAppointment,
              hasPersonalInfo,
            });
          })
          .catch((err) => 
          {            
            // Logging and handle errors that occur when fetching appointments.
            console.log("Error fetching appointments:", err);
            res.status(500).send("Error fetching appointments");
          });
      })
      .catch((err) =>
      {
        console.log("Error fetching user data:", err);
        res.status(500).send("Error fetching user data");
      });
  }   
  // This below else block will redirect to login if the user is not authenticated or not a Driver.
  else 
  {
    res.redirect("/login");
  }
};

// Exporting the whole controller and is used in the routes folder.
module.exports = 
{ 
  g2Page 
};
