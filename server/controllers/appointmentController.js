const Appointment = require('../models/Appointment');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const crypto = require('crypto');

const createAppointment = async (req, res) => {
  const { expertId, date, startTime, endTime, notes, payment } = req.body;

  if (req.user._id.toString() === expertId) {
    return res.status(400).json({ message: 'You cannot book an appointment with yourself' });
  }

  // Payment Verification (If payment details are provided)
  if (payment && payment.razorpayPaymentId) {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = payment;
      const sign = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

      if (razorpaySignature !== expectedSign) {
          return res.status(400).json({ message: "Invalid payment signature" });
      }
  }

  try {
    const appointment = await Appointment.create({
      customer: req.user._id,
      expert: expertId,
      date,
      startTime,
      endTime,
      notes,
      payment: payment ? {
          razorpayOrderId: payment.razorpayOrderId,
          razorpayPaymentId: payment.razorpayPaymentId,
          amount: payment.amount,
          status: 'captured'
      } : undefined,
      status: payment ? 'confirmed' : 'pending' // Auto-confirm if paid
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user appointments (Customer see theirs, Expert see theirs)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ customer: req.user._id }, { expert: req.user._id }]
    })
    .populate('customer', 'name email')
    .populate('expert', 'name email expertProfile')
    .sort({ date: 1 }); // Optional: sort by date

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status (e.g., Cancel, Confirm)
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.status = status;
      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAppointment, getAppointments, updateAppointmentStatus };
