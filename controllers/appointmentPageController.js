const User = require('../models/user');
const Appointment = require('../models/appointment');
const moment = require('moment');

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

  module.exports= {
    appointmentPage
};