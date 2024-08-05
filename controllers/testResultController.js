// Requiring the DB (Schema).
const User = require("../models/user");

// Controller function for updating user result data and fetching drivers. (examiner - comments) to display on appointment page.
const resultData = async (req, res) => 
{
  try 
  {
    const body = req.body;
    const id = body.userId;
    
    // Updating the user's data with comments and pass status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        // Updating both fields for comments as well as pass status for the "Driver"
        Comments: body.comment,
        isPassed: body.passed,
      },
      // This option returns the updated document.
      { new: true }
    ); 

    // If no user is found, status will be 404 and it will say no result found.
    if (!updatedUser) 
    {
      return res.status(404).send("User not found");
    }

    // Logging the updated user.
    console.log("Updated User:", updatedUser);

    // Fetch the updated list of users who are "Drivers" only
    const users = await User.find(
    {
      userType: "Driver",
      appointment: { $exists: true },
      // Putting data in DB - appointment fields.
    }).populate("appointment");

    // Rendering examiner page with list of users.
    res.render("pages/examiner", 
    {
      title: "Examiner Page",
      users,
    });
  }   
  // Logging any errors that occur during the operation
  catch (error) 
  {
    console.log("Error updating user data:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Exporting the whole controller and is used in the routes folder.
module.exports = 
{ 
  resultData 
};
