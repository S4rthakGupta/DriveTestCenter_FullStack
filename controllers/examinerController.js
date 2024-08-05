// Requiring the DB (Schema).
const User = require("../models/user");

// Controller function to handle rendering the examiner page (userType = "Examiner").
const examinerPage = async (req, res) => 
{
  try 
  {
    // Default to 'all' if no query parameter is provided
    const testType = req.query.testType || "all"; 
    
    // Creating a query object to find Drivers with existing appointments.
    const query = 
    {
      userType: "Driver", // This line will ensure only Drivers are queried
      appointment: { $exists: true },
    };

    // If a specific testType is provided, This below block will add it to the query.
    if (testType !== "all") 
    {
      query.testType = testType;
    }
    
    // This below line will fetch users based on the query and populate their appointment data.
    const users = await User.find(query).populate("appointment");

    // Retrieving and clearing any messages from the session.
    const message = req.session.message || "";
    delete req.session.message;
    
    // This below lines will render the examiner page with the fetched users, testType, and any message.
    res.render("pages/examiner", 
    {
      title: "Examiner View",
      users,
      testType,
      message,
    });
  } 
  catch (error) 
  {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller function to displays all the users in the (examiner.ejs) under the examiner view tab.
const examinerPageData = async (req, res) => 
{
  try 
  {
    const user = await User.findById(req.params.id);

    // This will make sure that the userType is driver.
    if (user && user.userType === "Driver") 
    {
      res.json(user);
    } 
    else 
    {
      // This will send a 404 response if the user is not found.
      res.status(404).json({ error: "User not found or not a Driver" });
    }
  } 
  catch (error) 
  {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Exporting the both controller's and is used in the routes folder.
module.exports = 
{ examinerPage, 
  examinerPageData 
};
