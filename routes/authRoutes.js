// Importing the reuired module.
const express = require('express');

// Creating a new router setup.
const router = express.Router();

// Requiring the controller from the controllers folder.
const authController = require('../controllers/authController'); 

// Below are the routers for the Authentication of the user's profile (Sign up and Login).
router.get('/login', authController.renderLogin);
router.get('/signup', authController.renderSignup);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Exporting the routers so that they can be used in the whole project.
module.exports = router;
