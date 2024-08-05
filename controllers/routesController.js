// Requiring the DB (Schema).
const User = require("../models/user");

// Controller function to handle navigation routes based on user type (Driver, Examiner, Admin).
const allRoutes = async (req, res) => 
{
  try 
  {    
    // Extracting query parameters from the request, defaulting to empty strings if not provided.
    const testType = req.query.testType || "";
    const message = req.query.message || "";

    // Fetching data from the the database.
    const users = await User.find();

    if (res.locals.isAuthenticated) 
    {
      const userType = res.locals.user.userType;

      // Defining view data to be used in rendering templates, including title and message.
      const viewData = 
      {
        title:
          userType === "Driver"
            ? "Dashboard"
            : userType === "Admin"
            ? "Appointment"
            : "Examiner",
        message,
      };

      // Rendering different views based on the user type.
      if (userType === "Driver") 
      {
        res.render("pages/dashboard", viewData);
      } 
      else if (userType === "Admin") 
      {
        res.render("pages/appointment", { ...viewData, users });
      } 
      else if (userType === "Examiner") 
      {
        res.render("pages/examiner", { ...viewData, users, testType });
      }
      // User will be redirected to this else block if userType is not authenticated.
      else 
      {
        res.redirect("/login");
      }
    } 
    // User will be redirected to this else block if user is not authenticated.
    else 
    {
      res.redirect("/login");
    }
  } 
  catch (error) 
  {
    // This catch block will log any errors that occurs during the process.
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Exporting the whole controller and is used in the routes folder.
module.exports = 
{
  allRoutes
};
