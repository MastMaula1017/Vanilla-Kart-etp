const Question = require('../models/Question');

// @desc    Submit a new question/contact message
// @route   POST /api/questions
// @access  Public
const submitQuestion = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message' });
    }

    const question = await Question.create({
      name,
      email,
      message
    });

    res.status(201).json({
      success: true,
      data: question,
      message: 'Your message has been received. We will get back to you shortly!'
    });
  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  submitQuestion
};
