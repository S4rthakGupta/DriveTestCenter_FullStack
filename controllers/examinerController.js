const User = require('../models/user');
const Appointment = require('../models/appointment');
const moment = require('moment');

const examinerPage = async (req, res) => {
  try {
    const testType = req.query.testType || 'all'; // Default to 'all' if no query parameter is provided
    const query = { 
      userType: 'Driver', // Ensure only Drivers are queried
      appointment: { $exists: true }
    };

    if (testType !== 'all') {
      query.testType = testType;
    }

    const users = await User.find(query).populate('appointment');
    const message = req.session.message || '';
    delete req.session.message;

    res.render('pages/examiner', { title: 'Examiner View', users, testType, message });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
};

const examinerPageData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user && user.userType === 'Driver') {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found or not a Driver' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

module.exports = { examinerPage, examinerPageData };