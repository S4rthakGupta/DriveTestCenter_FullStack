// Requiring the DB (Schema).
const User = require("../models/user");

// appointmentPage controller is a function which will render the appointment management page for userType = "Admin".
const appointmentPage = async (req, res) => 
{
  // Check if the user is authenticated and is an Admin.
  if (res.locals.isAuthenticated && res.locals.user.userType === "Admin") 
  {
    // This below will retrieve any message from the session and then clear it.
    const message = req.session.message;
    delete req.session.message;

    try 
    {
      // Fetch users with their test results.
      const users = await User.find({
        testType: { $exists: true },
        appointment: { $exists: true },
      }).populate("appointment");
      res.render("pages/appointment", { title: "Appointment", message, users });
    }
    catch (err) 
    {
      console.log("Error fetching users:", err);
      res.status(500).send("Error fetching users");
    }
    }
    else 
    {
    // Redirect to login if the user is not an Admin.
    res.redirect("/login");
  }
};

// Exporting the whole controller and is used in the routes folder.
module.exports = {
  appointmentPage,
};
