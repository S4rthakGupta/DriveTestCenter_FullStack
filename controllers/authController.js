// Requiring the User Schema from the models folder.
const User = require('../models/user');

// Requiring bcyrpt for hashing of password when user sign's up.
const bcrypt = require('bcrypt');

// Rendering the login page and giving it's path and title as well.
const renderLogin = (req, res) => 
{
  res.render('pages/login', { title: 'Login' });
};

// Rendering the signup page and giving it's path and title as well.
const renderSignup = (req, res) => 
{
  res.render('pages/signup', { title: 'Sign Up' });
};

// Handling the submission for the signup form.
const signup = async (req, res) => 
{
  const { username, password, confirmPassword, userType } = req.body;
  
  // This below if else block will check if the passwords match or not.
  if (password !== confirmPassword) 
  {
    return res.send(`
      <script>
        alert('Passwords do not match');
        window.location.href = '/signup';
      </script>
    `);
  }
  
  // This will check from the DB (User) if the same username in the DB exists or not.
  try
  {
    const user = await User.findOne({ username });
    if (user) 
    {
      return res.send(`
        <script>
          alert('Username already exists. Please login or choose a different username.');
          window.location.href = '/login';
        </script>
      `);
    }
    
    // Creating new User inside the database.
    const newUser = new User(
    {
      username,
      password,
      userType,
      firstName: 'default',
      lastName: 'default',
      licenseNumber: username + new Date().getTime(),
      carDetails: {
        make: 'default',
        model: 'default',
        year: 0,
        plateNumber: 'default'
      }
    });
    
    // Giving an alert that user is saved.
    await newUser.save();
    res.send(`
      <script>
        alert('User registered successfully');
        window.location.href = '/login';
      </script>
    `);
    
    // If there is an error saving data then this catch block will give an error with a message.
  } catch (err) {
    console.log('Error saving user data:', err);
    res.status(500).send(`
      <script>
        alert('Error saving user data');
        window.location.href = '/login';
      </script>
    `);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.send(`
        <script>
          alert('Invalid username or password');
          window.location.href = '/login';
        </script>
      `);
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Set session variables for authenticated users
      req.session.user = user;
      req.session.isAuthenticated = true;

      // Redirect to dashboard page
      res.send(`
        <script>
          alert('Login successful');
          window.location.href = '/dashboard';
        </script>
      `);
    } else {
      // Incorrect password
      res.send(`
        <script>
          alert('Invalid username or password');
          window.location.href = '/login';
        </script>
      `);
    }
  } catch (err) {
    console.log('Error during login:', err);
    res.status(500).send(`
      <script>
        alert('Error during login');
        window.location.href = '/login';
      </script>
    `);
  }
};
// This will handle the logout and will also destroy the session.
const logout = (req, res) => 
{
  req.session.destroy(err => 
  {
    if (err) return res.status(500).send('Error logging out');
    res.redirect('/login');
  });
};

// Exporting modules that are created.
module.exports = 
{
  renderLogin,
  renderSignup,
  signup,
  login,
  logout
};