const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'expert', 'admin'], default: 'customer' },
  // Expert specific fields
  expertProfile: {
    specialization: { type: String }, // e.g., Finance, Education
    bio: { type: String },
    hourlyRate: { type: Number },
    availability: [{
      day: { type: String }, // e.g., "Monday"
      startTime: { type: String }, // e.g., "09:00"
      endTime: { type: String }   // e.g., "17:00"
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
