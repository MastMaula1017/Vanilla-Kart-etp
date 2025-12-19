const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for Google Auth
  googleId: { type: String },
  profileImage: { type: String, default: '' },
  coverImage: { type: String, default: '' },
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
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      startTime: { type: String }, // "09:00"
      endTime: { type: String },   // "17:00"
      isActive: { type: Boolean, default: true }
    }],
    verificationStatus: { 
      type: String, 
      enum: ['unverified', 'pending', 'verified', 'rejected'], 
      default: 'unverified' 
    },
    verificationDocuments: [{ type: String }],
    badges: [{ type: String }], // e.g., "Top Rated", "Verified"
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
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
