// This below is a middleware function to check if the user is authenticated.
module.exports.isAuthenticated = (req, res, next) => 
{
  
  // This will check if the session contains an 'isAuthenticated' flag set to true.
  if (req.session.isAuthenticated) 
  {
    return next();
  }

  
  // If the user is not authenticated, it will redirect the user to the login page.
  res.redirect('/login');
};