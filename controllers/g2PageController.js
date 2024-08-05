// Requiring the User Schema from the models folder.
const User = require('../models/user');

// Importing necessary models and libraries.
const Appointment = require('../models/appointment');
const moment = require('moment');


// Rendering the G2 page for Drivers with available appointment slots.
const g2Page = (req, res) => 
{
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') 
  {
    const userId = res.locals.user._id;
    const selectedDate = req.query.date || moment().format('YYYY-MM-DD');

    User.findById(userId)
      .then(user => 
      {
        Appointment.find({ date: selectedDate, isTimeSlotAvailable: true })
          .then(appointments => 
          {
            const message = req.session.message;
            delete req.session.message;

            // This will fetch the user's current appointment if any
            const userAppointment = user.appointment ? 
              appointments.find(appointment => appointment._id.toString() === user.appointment.toString()) 
              : null;

            // This will check if the user has provided all personal information
            const hasPersonalInfo = user.firstName && user.lastName && user.licenseNumber && user.age;

            console.log('User object for G2 page:', user);
            res.render('pages/g2', 
            { 
              title: 'G2 Page', 
              user, 
              appointments, 
              selectedDate, 
              message, 
              userAppointment,
              hasPersonalInfo  
            });
          })
          .catch(err => 
          {
            console.log('Error fetching appointments:', err);
            res.status(500).send('Error fetching appointments');
          });
      })
      .catch(err => 
      {
        console.log('Error fetching user data:', err);
        res.status(500).send('Error fetching user data');
      });
  } 
  else
  {
    res.redirect('/login');
  }

};
module.exports = { g2Page };