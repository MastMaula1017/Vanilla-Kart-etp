const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  message: {
    type: String,
    required: [true, 'Please add a message']
  },
  subject: {
    type: String,
    default: 'General Inquiry'
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'replied'],
    default: 'pending'
  },
  adminReply: {
    type: String
  },
  repliedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);
