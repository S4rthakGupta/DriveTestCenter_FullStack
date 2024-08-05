const User = require('../models/user');

// Importing necessary models and libraries.
const Appointment = require('../models/appointment');
const moment = require('moment');

// This will fetch the booked time slots for a given date.
const getBookedTimesForDate = (req, res) =>
    {
      const date = req.params.date;
     
      // This will find all appointments that are booked (not available) for the given date.
      Appointment.find({ date, isTimeSlotAvailable: false })
        .then(appointments => 
        {
          // It will extract the time slots from the appointments.
          const bookedTimes = appointments.map(app => app.time);
          console.log('Booked times for date', date, ':', bookedTimes);
          
          // Respond with the booked times as JSON.
          res.json(bookedTimes);
        })
        .catch(err => 
        {
          console.log('Error fetching appointments:', err);
          res.status(500).send('Error fetching appointments');
        });
    };

    module.exports = { getBookedTimesForDate };