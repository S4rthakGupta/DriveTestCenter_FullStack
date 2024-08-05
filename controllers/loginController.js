const User = require('../models/user');
const bcrypt = require('bcrypt');

// Rendering the login page
const renderLogin = (req, res) => {
  res.render('pages/login', { title: 'Login' });
};

// Handling the form submission for login
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
      req.session.user = user;
      req.session.isAuthenticated = true;

      let redirectUrl = '/dashboard';
      if (user.userType === 'Driver') {
        redirectUrl = '/dashboard';
      } else if (user.userType === 'Admin') {
        redirectUrl = '/appointment';
      } else if (user.userType === 'Examiner') {
        redirectUrl = '/examiner';
      }

      res.send(`
        <script>
          alert('Login successful');
          window.location.href = '${redirectUrl}';
        </script>
      `);
    } else {
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

// Exporting the whole controller and is used in the routes folder.
module.exports = {
  renderLogin,
  login
};