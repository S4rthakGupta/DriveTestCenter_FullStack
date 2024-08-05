const User = require('../models/user');
const Appointment = require('../models/appointment');
const moment = require('moment');

const resultData = async (req, res) => {
  try {
    const body = req.body;
    const id = body.userId;

    // Update the user's data
    const updatedUser = await User.findByIdAndUpdate(id, {
      Comments: body.comment,
      isPassed: body.passed
    }, { new: true }); // This option returns the updated document

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    console.log('Updated User:', updatedUser); // Log the updated user

    // Fetch the updated list of users who are "Drivers" only
    const users = await User.find({ userType: 'Driver', appointment: { $exists: true } }).populate('appointment');
    res.render('pages/examiner', {
      title: 'Examiner Page', // Provide the title here
      users
    });
  } catch (error) {
    console.log('Error updating user data:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { resultData };