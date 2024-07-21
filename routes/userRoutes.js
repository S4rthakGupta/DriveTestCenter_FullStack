const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Import the isAuthenticated middleware
const { isAuthenticated } = require('../middleware/auth');

// Driver routes
router.get("/dashboard", userController.dashboard);
router.get("/g2", userController.g2Page);
router.get("/g", userController.gPage);
router.post("/saveUserData", userController.saveUserData);
router.get('/appointment', isAuthenticated, userController.appointmentPage);
router.post('/add-appointment', isAuthenticated, userController.addAppointment);
router.post('/book-appointment', isAuthenticated, userController.bookAppointment);

router.get('/appointments/:date', isAuthenticated, userController.getBookedTimesForDate);


module.exports = router;