const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'critical'],
    default: 'info'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'expert', 'customer'],
    default: 'all'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  } // Soft delete or just to hide
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
