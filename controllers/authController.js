const User = require('../models/user');
const bcrypt = require('bcrypt');

// Render login page.
const renderLogin = (req, res) => {
  res.render('pages/login', { title: 'Login' });
};

// Render signup page.
const renderSignup = (req, res) => {
  res.render('pages/signup', { title: 'Sign Up' });
};

// Handle signup form submission.
const signup = async (req, res) => {
  const { username, password, confirmPassword, userType } = req.body;

  if (password !== confirmPassword) {
    return res.send(`
      <script>
        alert('Passwords do not match');
        window.location.href = '/signup';
      </script>
    `);
  }

  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.send(`
        <script>
          alert('Username already exists. Please login or choose a different username.');
          window.location.href = '/login';
        </script>
      `);
    }

    const newUser = new User({
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

    await newUser.save();
    res.send(`
      <script>
        alert('User registered successfully');
        window.location.href = '/login';
      </script>
    `);
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

// Handle login form submission.
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.send(`
        <script>
          alert('Invalid username or password');
          window.location.href = '/login';
        </script>
      `);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      req.session.user = user;
      req.session.isAuthenticated = true;
      res.send(`
        <script>
          alert('Login successful');
          window.location.href = '/dashboard';
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

// Handle logout.
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Error logging out');
    res.redirect('/login');
  });
};

module.exports = {
  renderLogin,
  renderSignup,
  signup,
  login,
  logout
};