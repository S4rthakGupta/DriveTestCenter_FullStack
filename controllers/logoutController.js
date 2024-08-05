// Handling the logout and destroying the session
const logout = (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).send('Error logging out');
      res.redirect('/login');
    });
  };
  
  module.exports = {
    logout
  };