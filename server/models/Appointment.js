const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // "10:00"
  endTime: { type: String, required: true },   // "11:00"
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  payment: {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    amount: { type: Number },
    status: { type: String, enum: ['pending', 'captured', 'failed'], default: 'pending' }
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
