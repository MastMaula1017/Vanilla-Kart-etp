const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    ref: 'User'
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => Date.now() + 10 * 60 * 1000 // 10 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Auto-delete document after 10 minutes (TTL index)
  }
});

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);
