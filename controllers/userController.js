// Requiring the User Schema from the models folder.
const User = require('../models/user');

// Importing necessary models and libraries.
const Appointment = require('../models/appointment');
const moment = require('moment');

// Controller function for rendering the dashboard page.
const dashboard = (req, res) => 
{   
  //This below line will check if user is authenticated and is of type 'Driver'.
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') 
  {
    res.render('pages/dashboard', { title: 'Dashboard' });
  }   
  // This else block will redirect to login page if not authenticated or not a driver
  else 
  {
    res.redirect('/login');
  }
};

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

// Rendering the G page for Drivers showing their information.
const gPage = (req, res) => 
{
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') 
  {
    const userId = res.locals.user._id;

    User.findById(userId).populate('appointment')
      .then(user => 
      {
        console.log('Fetched user data:', user); // Log user data

        const message = req.session.message;
        delete req.session.message;

        // This will check if the user has provided all personal information
        const hasPersonalInfo = user.firstName && user.lastName && user.licenseNumber && user.age;

        res.render('pages/g', 
        { 
          title: 'G Page', 
          user, 
          message, 
          hasPersonalInfo 
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

// Controller function for saving user data
const saveUserData = (req, res) => 
{
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') 
  {
    console.log('Request body:', req.body); // Log the request body
    const userId = res.locals.user._id;
    const { firstName, lastName, licenseNumber, age, carMake, carModel, carYear, plateNumber, appointmentId } = req.body;

    const updateData = 
    {
      firstName,
      lastName,
      licenseNumber,
      age,
      'carDetails.make': carMake,
      'carDetails.model': carModel,
      'carDetails.year': carYear,
      'carDetails.plateNumber': plateNumber
    };

    // Including appointmentId if it exists.
    if (appointmentId) 
    {
      updateData.appointment = appointmentId;
    }
    
    // This below code will update user data in database and the user will be able to do it as many times as they want.
    User.findByIdAndUpdate(userId, updateData, { new: true })
      .then(updatedUser => 
      {
        if (!updatedUser) return res.status(404).send('User not found');
        console.log('Updated user data:', updatedUser);
        req.session.message = 'User data updated successfully';
        res.redirect('/g');
      })
      .catch(err =>
      {
        console.log('Error updating user data:', err);
        res.status(500).send('Error updating user data');
      });
  } 
  else 
  {
    res.redirect('/login');
  }
};

// For assignment-4 (Newly Added)
// Rendering the appointment page for Admin users to manage appointments.
const appointmentPage = (req, res) => 
{
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Admin') {
    const message = req.session.message;
    // This will pass message to the template
    res.render('pages/appointment', { title: 'Appointment', message }); 
  } 
  else 
  {
    res.redirect('/login');
  }
};

// Controller function for booking an appointment slot for Drivers.
const bookAppointment = (req, res) => 
{
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') 
  {
    const userId = res.locals.user._id;
    const { appointmentId } = req.body;

    User.findById(userId)
      .then(user => 
      {
        if (!user.firstName || !user.lastName || !user.licenseNumber || !user.age) {
          return res.status(403).send('Please complete your personal information before booking an appointment.');
        }

        Appointment.findByIdAndUpdate(appointmentId, { isTimeSlotAvailable: false }, { new: true })
          .then(updatedAppointment => 
          {
            if (!updatedAppointment) return res.status(404).send('Appointment not found');
            console.log('Updated appointment data:', updatedAppointment);

            User.findByIdAndUpdate(userId, { appointment: appointmentId }, { new: true })
              .then(updatedUser => 
              {
                if (!updatedUser) return res.status(404).send('User not found');
                console.log('Updated user data:', updatedUser);
                req.session.message = 'Appointment booked successfully';
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
    res.redirect('/login');
  }
};

// Controller function for adding appointments by Admin.
const addAppointment = (req, res) => 
{
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Admin') 
  {
    const { date, times } = req.body;

    console.log('Received appointment data:', { date, times });

    if (!date || !times) 
    {
      console.log('Missing date or times in request body');
      return res.status(400).send('Missing date or times in request body');
    }

    const appointments = Array.isArray(times) ? times.map(time => (
    {
      date,
      time,
      isTimeSlotAvailable: true
    })) : [{ date, time: times, isTimeSlotAvailable: true }];

    console.log('Appointments to be added:', appointments);

    const timeSlots = Array.isArray(times) ? times : [times];
    Appointment.find({ date, time: { $in: timeSlots } })
      .then(existingAppointments => 
      {
        if (existingAppointments.length > 0) {
          req.session.message = 'Some time slots are already booked';
          return res.redirect('/appointment');
        } 
        else 
        {
          Appointment.insertMany(appointments)
            .then(insertedAppointments => 
            {
              console.log('Appointments added successfully:', insertedAppointments);
              req.session.message = 'Appointments added successfully';
              res.redirect('/appointment');
            })
            .catch(err => 
            {
              console.log('Error adding appointments:', err);
              res.status(500).send('Error adding appointments');
            });
        }
      })
      .catch(err => 
      {
        console.log('Error checking existing appointments:', err);
        res.status(500).send('Error checking existing appointments');
      });
  } 
  else 
  {
    res.redirect('/login');
  }
};

// This will fetch the booked time slots for a given date.
const getBookedTimesForDate = (req, res) =>
{
  const date = req.params.date;

  Appointment.find({ date, isTimeSlotAvailable: false })
    .then(appointments => 
    {
      const bookedTimes = appointments.map(app => app.time);
      console.log('Booked times for date', date, ':', bookedTimes);
      res.json(bookedTimes);
    })
    .catch(err => 
    {
      console.log('Error fetching appointments:', err);
      res.status(500).send('Error fetching appointments');
    });
};

// Exporting all controller functions that we created above.
module.exports = 
{
  dashboard,
  g2Page,
  gPage,
  saveUserData,
  appointmentPage,
  addAppointment,
  bookAppointment,
  getBookedTimesForDate
};