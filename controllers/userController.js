// Requiring the User Schema from the models folder.
const User = require('../models/user');

// Importing necessary models and libraries.
const Appointment = require('../models/appointment');
const moment = require('moment');


const dashboard = async (req, res) => {
  try {
    const testType = req.query.testType || ''; // Get the testType from query parameters or set to empty string by default
    const message = req.query.message || ''; // Get message from query parameters if available
    const users = await User.find(); // Adjust query as needed

    if (res.locals.isAuthenticated) {
      const userType = res.locals.user.userType;
      const viewData = { title: userType === 'Driver' ? 'Dashboard' : userType === 'Admin' ? 'Appointment' : 'Examiner', message };

      if (userType === 'Driver') {
        res.render('pages/dashboard', viewData);
      } else if (userType === 'Admin') {
        res.render('pages/appointment', { ...viewData, users });
      } else if (userType === 'Examiner') {
        res.render('pages/examiner', { ...viewData, users, testType });
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
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
    const { firstName, lastName, licenseNumber, age, carMake, carModel, carYear, plateNumber, appointmentId, testType } = req.body;

    const updateData = 
    {
      firstName,
      lastName,
      licenseNumber,
      age,
      testType,
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
// Rendering the appointment page for Admin users to manage appointments and view test results.
const appointmentPage = async (req, res) => {
  // Check if the user is authenticated and is an Admin.
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Admin') {
    const message = req.session.message;
    delete req.session.message;

    try {
      // Fetch users with their test results.
      const users = await User.find({ testType: { $exists: true }, appointment: { $exists: true } }).populate('appointment');
      res.render('pages/appointment', { title: 'Appointment', message, users });
    } catch (err) {
      console.log('Error fetching users:', err);
      res.status(500).send('Error fetching users');
    }
  } else {
    // Redirect to login if the user is not an Admin.
    res.redirect('/login');
  }
};

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

// Controller function for adding appointments by Admin.
const addAppointment = (req, res) => 
{  
  // This below if statement will check if the user is authenticated and the userType is Admin.
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Admin') 
  {
    const { date, times } = req.body;

    console.log('Received appointment data:', { date, times });

    // This below if condition will check if date and times are provided.
    if (!date || !times) 
    {
      console.log('Missing date or times in request body');
      return res.status(400).send('Missing date or times in request body');
    }

    // Creating an array of appointment slots
    const appointments = Array.isArray(times) ? times.map(time => (
    {
      date,
      time,
      isTimeSlotAvailable: true
    })) : [{ date, time: times, isTimeSlotAvailable: true }];

    console.log('Appointments to be added:', appointments);

    const timeSlots = Array.isArray(times) ? times : [times];

    
    // This will check if any of the provided time slots already exist for the given date.
    Appointment.find({ date, time: { $in: timeSlots } })
      .then(existingAppointments => 
      {
        if (existingAppointments.length > 0) {
          req.session.message = 'Some time slots are already booked';
          return res.redirect('/appointment');
        } 
        else 
        {          
          // This will insert the new appointment slots into the MongoDB database.
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
  // This else condition will redirect to login if the user is not an Admin
  {
    res.redirect('/login');
  }
};

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

const examinerPage = async (req, res) => {
  try {
    const testType = req.query.testType || ''; // Ensure this line is present
    const query = { appointment: { $exists: true } };

    if (testType) {
      query.testType = testType;
    }

    const users = await User.find(query).populate('appointment');
    const message = req.session.message || ''; // Get message from session if available
    delete req.session.message; // Clear message after use

    res.render('pages/examiner', { title: 'Examiner View', users, testType, message });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
};
const examinerPageData = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        //handle error
        console.log(error);
        console.error(error);
        res.status(500).json({  
            error: 'Failed to fetch user'
        });
    }
}

const resultData = async (req, res) => {
  try {
    const body = req.body;
    const id = body.userId;

    // Update the user's data
    const updatedUser = await User.findByIdAndUpdate(id, {
      Comments: body.comment,
      isPassed: body.passed
    }, { new: true }); // This option returns the updated document

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    console.log('Updated User:', updatedUser); // Log the updated user

    // Fetch the updated list of users
    const users = await User.find({ appointment: { $exists: true } }).populate('appointment');
    res.render('pages/examiner', {
      title: 'Examiner Page', // Provide the title here
      users
    });
  } catch (error) {
    console.log('Error updating user data:', error);
    res.status(500).send('Internal Server Error');
  }
};



module.exports = {
  dashboard,
  g2Page,
  gPage,
  saveUserData,
  appointmentPage,
  addAppointment,
  bookAppointment,
  getBookedTimesForDate,
  examinerPage,
  examinerPageData,
  resultData
  
};