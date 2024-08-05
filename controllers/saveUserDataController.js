const User = require('../models/user');


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

    // Exporting the whole controller and is used in the routes folder.
    module.exports= {
        saveUserData
        
    };
    