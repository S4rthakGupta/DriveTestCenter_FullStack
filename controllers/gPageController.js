// Requiring the User Schema from the models folder.
const User = require('../models/user');


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

// Exporting the whole controller and is used in the routes folder.
module.exports = { gPage };