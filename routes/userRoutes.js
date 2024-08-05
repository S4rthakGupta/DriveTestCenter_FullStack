const express = require("express");
const router = express.Router();

const { isAuthenticated, isExaminer, isAdmin, isDriver } = require('../middleware/auth');

const routesController = require('../controllers/routesController');
const g2PageController = require('../controllers/g2PageController');
const gPageController = require('../controllers/gPageController');
const saveUserDataController = require('../controllers/saveUserDataController');
const appointmentPageController = require('../controllers/appointmentPageController');
const addAppointmentController = require('../controllers/addAppointmentController');
const bookedTimesController = require('../controllers/bookedTimesController');
const examinerController = require('../controllers/examinerController');
const testResultController = require('../controllers/testResultController');
const bookAppointmentController = require('../controllers/bookAppointmentController');



router.get("/dashboard", isAuthenticated, routesController.allRoutes);
router.get("/g2", isAuthenticated, isDriver, g2PageController.g2Page);
router.get("/g", isAuthenticated, isDriver, gPageController.gPage);
router.post("/saveUserData", isAuthenticated, isDriver, saveUserDataController.saveUserData);
router.get('/appointment', isAuthenticated, isAdmin, appointmentPageController.appointmentPage);
router.post('/add-appointment', isAuthenticated, isAdmin, addAppointmentController.addAppointment);
router.get('/appointments/:date', isAuthenticated, bookedTimesController.getBookedTimesForDate);
router.get('/examiner', isAuthenticated, isExaminer, examinerController.examinerPage);
router.post('/resultData', isAuthenticated, isExaminer, testResultController.resultData);
router.post('/book-appointment', isAuthenticated, isDriver, bookAppointmentController.bookAppointment);


router.get('/users/:id', isExaminer, examinerController.examinerPageData);

module.exports = router;