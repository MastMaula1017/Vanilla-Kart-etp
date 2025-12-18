const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: { // Optional, e.g., for appointment requests
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
  type: {
    type: String,
    enum: ['appointment_request', 'appointment_status', 'payment_success', 'payment_failure', 'reminder', 'system', 'message'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: { // Link to related page, e.g., /dashboard
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
