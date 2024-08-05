// Requiring the User Schema from the models folder.
const User = require('../models/user');

// Rendering the G page for Drivers showing their information.
const gPage = (req, res) => 
{
  // Checks if the user is authenticated and is a "Driver".
  if (res.locals.isAuthenticated && res.locals.user.userType === 'Driver') 
  {
    const userId = res.locals.user._id;
    
    // Find the user by their ID and populate the appointment data.
    User.findById(userId).populate('appointment')
      .then(user => 
      {
        // Log the fetched user data for debugging purposes.
        console.log('Fetched user data:', user);
        
        // Retrieving any message from the session and then delete it.
        const message = req.session.message;
        delete req.session.message;

        // This will check if the user has provided all personal information
        const hasPersonalInfo = user.firstName && user.lastName && user.licenseNumber && user.age;

        // Rendering the G page with the fetched user data and additional information.
        res.render('pages/g', 
        { 
          title: 'G Page', 
          user, 
          message, 
          hasPersonalInfo 
        });
      })      
      // Logging and handling any errors that occur when fetching user data.
      .catch(err => 
      {
        console.log('Error fetching user data:', err);
        res.status(500).send('Error fetching user data');
      });
  }   
  // This below else block will redirect to login page if the user is not authenticated or not a Driver.
  else 
  {
    res.redirect('/login');
  }
};

// Exporting the whole controller and is used in the routes folder.
module.exports = { gPage };