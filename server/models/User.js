const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { 
    type: [String], 
    enum: ['customer', 'expert', 'admin', 'inquiry_support', 'moderator'], 
    default: ['customer'] 
  },
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
  resetPasswordOtp: String,
  resetPasswordOtpExpire: Date,
  createdAt: { type: Date, default: Date.now }
});

const bcrypt = require('bcryptjs');

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
