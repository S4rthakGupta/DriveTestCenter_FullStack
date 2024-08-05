const User = require('../models/user');


const dashboard = async (req, res) => {
  try {
    const testType = req.query.testType || '';
    const message = req.query.message || '';
    const users = await User.find();

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

// Exporting the whole controller and is used in the routes folder.
module.exports = { 
  dashboard
};
