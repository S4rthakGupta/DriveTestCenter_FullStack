const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated, isExaminer, isAdmin, isDriver } = require('../middleware/auth');

router.get("/dashboard", isAuthenticated, userController.dashboard);
router.get("/g2", isAuthenticated, isDriver, userController.g2Page);
router.get("/g", isAuthenticated, isDriver, userController.gPage);
router.post("/saveUserData", isAuthenticated, isDriver, userController.saveUserData);
router.get('/appointment', isAuthenticated, isAdmin, userController.appointmentPage);
router.post('/add-appointment', isAuthenticated, isAdmin, userController.addAppointment);
router.post('/book-appointment', isAuthenticated, isDriver, userController.bookAppointment);
router.get('/appointments/:date', isAuthenticated, userController.getBookedTimesForDate);
router.get('/examiner', isAuthenticated, isExaminer, userController.examinerPage);
router.post('/resultData', isAuthenticated, isExaminer, userController.resultData);
router.get('/users/:id', isExaminer, userController.examinerPageData);

module.exports = router;