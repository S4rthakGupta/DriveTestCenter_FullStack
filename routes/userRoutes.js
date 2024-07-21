// Importing the reuired module.
const express = require("express");

// Creating a new router setup
const router = express.Router();

// Requiring the controller from the controllers folder.
const userController = require("../controllers/userController");

// Importing the isAuthenticated middleware.
const { isAuthenticated } = require('../middleware/auth');

// Below are the routers for the user's personal information as well as the admin user-type.(first name, last name, vehicle details, adding appointment, booking appointment. etc).
router.get("/dashboard", userController.dashboard);
router.get("/g2", userController.g2Page);
router.get("/g", userController.gPage);
router.post("/saveUserData", userController.saveUserData);
router.get('/appointment', isAuthenticated, userController.appointmentPage);
router.post('/add-appointment', isAuthenticated, userController.addAppointment);
router.post('/book-appointment', isAuthenticated, userController.bookAppointment);

// This is the route to get booked times for a specific date and these are protected by authentication middleware.
router.get('/appointments/:date', isAuthenticated, userController.getBookedTimesForDate);

// Exporting the routers so that they can be used in the whole project.
module.exports = router;