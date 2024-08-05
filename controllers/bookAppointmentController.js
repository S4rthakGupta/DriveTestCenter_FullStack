const User = require('../models/user');

// Importing necessary models and libraries.
const Appointment = require('../models/appointment');

// Controller function for booking an appointment slot for Drivers.
const bookAppointment = (req, res) => 
    {  
      // This below line will check if the user is authenticated and is a Driver.
      if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') 
      {
        const userId = res.locals.user._id;
        const { appointmentId } = req.body;
    
        // It will find the user by ID.
        User.findById(userId)
          .then(user => 
          {
            // This below if statement will check if user has completed their personal information or not.
            if (!user.firstName || !user.lastName || !user.licenseNumber || !user.age) {
              return res.status(403).send('Please complete your personal information before booking an appointment.');
            }
            
            // This will update the appointment slot to mark it as booked.
            Appointment.findByIdAndUpdate(appointmentId, { isTimeSlotAvailable: false }, { new: true })
              .then(updatedAppointment => 
              {
                if (!updatedAppointment) return res.status(404).send('Appointment not found');
                console.log('Updated appointment data:', updatedAppointment);
    
                
                // This will update the user's record with the booked appointment ID
                User.findByIdAndUpdate(userId, { appointment: appointmentId }, { new: true })
                  .then(updatedUser => 
                  {
                    if (!updatedUser) return res.status(404).send('User not found');
                    console.log('Updated user data:', updatedUser);
                    // This will set a success message in the session.
                    req.session.message = 'Appointment booked successfully';
                    // After that it will redirect the user to the G page.
                    res.redirect('/g');
                  })
                  .catch(err => 
                  {
                    console.log('Error updating user data:', err);
                    res.status(500).send('Error updating user data');
                  });
              })
              .catch(err => 
              {
                console.log('Error updating appointment:', err);
                res.status(500).send('Error updating appointment');
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
        // It will redirect the user to login page again if the userType is not Driver.
        res.redirect('/login');
      }
    };
    

  // Exporting the whole controller and is used in the routes folder.  
  module.exports = {
      bookAppointment,
    };