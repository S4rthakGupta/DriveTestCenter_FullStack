// Requiring the User Schema from the models folder.
const User = require("../models/user");

// requiring the library which is used to hash (encypt) the password.
const bcrypt = require("bcrypt");

// Rendering the login page
const renderLogin = (req, res) => 
{
  res.render("pages/login", { title: "Login" });
};

// Handling the form submission for login.
const login = async (req, res) => 
{
  
  // Extracting username and password from the request body.
  const { username, password } = req.body;

  try 
  {
      // If user is not found, set an error message in session and redirect to the login page.
    const user = await User.findOne({ username });
    if (!user) 
    {
      return res.send(`
        <script>
          alert('Invalid username or password');
          window.location.href = '/login';
        </script>
      `);
    }

    // Compare the provided password with the hashed password in the database.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) 
    {
      // If password is valid, set user session data and authentication status.
      req.session.user = user;
      req.session.isAuthenticated = true;

      // This below lines of code will be responsible for redirecting URL based on user type.
      let redirectUrl = "/dashboard";
      // When the userType is Driver it will go to /dashboard, 
      // admin for userType = Admin,
      // examiner for userType  = Examiner.
      if (user.userType === "Driver") 
      {
        redirectUrl = "/dashboard";
      } 
      else if (user.userType === "Admin") 
      {
        redirectUrl = "/appointment";
      } 
      else if (user.userType === "Examiner") 
      {
        redirectUrl = "/examiner";
      }

      res.send(`
        <script>
          alert('Login successful');
          window.location.href = '${redirectUrl}';
        </script>
      `);
    } 
    else
    {
      res.send(`
        <script>
          alert('Invalid username or password');
          window.location.href = '/login';
        </script>
      `);
    }
  } 
  catch (err) 
  {
    // Log the error and set an error message in session, then redirect to the login page.
    console.log("Error during login:", err);
    res.status(500).send(`
      <script>
        alert('Error during login');
        window.location.href = '/login';
      </script>
    `);
  }
};

// Exporting both controllers and is used in the routes folder.
module.exports = 
{
  renderLogin,
  login,
};
