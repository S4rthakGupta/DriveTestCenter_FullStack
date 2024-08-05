// Importing neccessary libraries.
const express = require('express');

// Creating a router instance using Express router.
const router = express.Router();

// Requiring the middleware from auth.js file.
const { isAuthenticated, isExaminer, isAdmin, isDriver } = require('../middleware/auth');

// Importing all the controllers for handling operations for all the userTypes.
const routesController = require('../controllers/routesController');
const g2PageController = require('../controllers/g2PageController');
const gPageController = require('../controllers/gPageController');
const saveUserDataController = require('../controllers/saveUserDataController');
const appointmentPageController = require('../controllers/appointmentPageController');
const addAppointmentController = require('../controllers/addAppointmentController');
const bookedTimesController = require('../controllers/bookedTimesController');
const examinerController = require('../controllers/examinerController');
const testResultController = require('../controllers/testResultController');

// Routes for rendering the different sort of pages as per the requirement for the user.
router.get("/dashboard", isAuthenticated, routesController.allRoutes);
router.get("/g2", isAuthenticated, isDriver, g2PageController.g2Page);
router.get("/g", isAuthenticated, isDriver, gPageController.gPage);
router.post("/saveUserData", isAuthenticated, isDriver, saveUserDataController.saveUserData);
router.get('/appointment', isAuthenticated, isAdmin, appointmentPageController.appointmentPage);
router.post('/add-appointment', isAuthenticated, isAdmin, addAppointmentController.addAppointment);
router.get('/appointments/:date', isAuthenticated, bookedTimesController.getBookedTimesForDate);
router.get('/examiner', isAuthenticated, isExaminer, examinerController.examinerPage);
router.post('/resultData', isAuthenticated, isExaminer, testResultController.resultData);

// Route for fetching user data by ID, accessible only to examiners. (code is in examiner.ejs - script)
router.get('/users/:id', isExaminer, examinerController.examinerPageData);

// Exporting routers to be used in the app.js
module.exports = router;