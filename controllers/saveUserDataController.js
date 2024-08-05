// Requiring the DB (Schema).
const User = require("../models/user");

// Controller function for saving user data on the g2 page (POST request).
const saveUserData = (req, res) => 
{
  // Check if the user is authenticated and is a "Driver".
  if (res.locals.isAuthenticated && res.locals.user.userType === "Driver") 
  {
    console.log("Request body:", req.body);
  
    // Creating an update object to be used for updating the user data in the database
    const userId = res.locals.user._id;
    const 
    {
      firstName,
      lastName,
      licenseNumber,
      age,
      carMake,
      carModel,
      carYear,
      plateNumber,
      appointmentId,
      testType,
    } = req.body;
    
    // Creating an update object to be used for updating the user data in the database
    const updateData = 
    {
      firstName,
      lastName,
      licenseNumber,
      age,
      testType,
      "carDetails.make": carMake,
      "carDetails.model": carModel,
      "carDetails.year": carYear,
      "carDetails.plateNumber": plateNumber,
    };

    // Including appointmentId if it exists.
    if (appointmentId) {
      updateData.appointment = appointmentId;
    }

    // This below code will update user data in database and the user will be able to do it as many times as they want.
    User.findByIdAndUpdate(userId, updateData, { new: true })
      .then((updatedUser) => 
      {
        // This line wil handle the case if no user is found.
        if (!updatedUser) return res.status(404).send("User not found");

        // Logging the errors.
        console.log("Updated user data:", updatedUser);

        // Setting a success message in the session.
        req.session.message = "User data updated successfully";

        // Redirecting the user to "/g" after successful page update.
        res.redirect("/g");
      })
      .catch((err) => 
      {
        // Logging any errors encountered during the update operation.
        console.log("Error updating user data:", err);
        res.status(500).send("Error updating user data");
      });
  }  
  // This else block will redirect to the login page if the user is not authenticated or not a "Driver"
  else 
  {
    res.redirect("/login");
  }
};

// Exporting the whole controller and is used in the routes folder.
module.exports = 
{
  saveUserData,
};
