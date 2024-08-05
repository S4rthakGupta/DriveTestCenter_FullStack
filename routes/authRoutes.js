const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const signupController = require('../controllers/signupController');
const logoutController = require('../controllers/logoutController');

// Authentication routes
router.get('/login', loginController.renderLogin);
router.post('/login', loginController.login);
router.get('/signup', signupController.renderSignup);
router.post('/signup', signupController.signup);
router.get('/logout', logoutController.logout);

module.exports = router;