// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/login');
};

// Middleware to check if the user is a Driver
const isDriver = (req, res, next) => {
  if (req.session.user && req.session.user.userType === 'Driver') {
    return next();
  }
  res.status(403).send('Access denied');
};

// Middleware to check if the user is an Admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.userType === 'Admin') {
    return next();
  }
  res.status(403).send('Access denied');
};

// Middleware to check if the user is an Examiner
const isExaminer = (req, res, next) => {
  if (req.session.user && req.session.user.userType === 'Examiner') {
    return next();
  }
  res.status(403).send('Access denied');
};

module.exports = { isAuthenticated, isDriver, isAdmin, isExaminer };