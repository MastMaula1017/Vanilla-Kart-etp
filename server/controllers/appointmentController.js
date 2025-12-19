const Appointment = require('../models/Appointment');
const Coupon = require('../models/Coupon');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const crypto = require('crypto');

const createAppointment = async (req, res) => {
  const { expertId, date, startTime, endTime, notes, payment, couponCode } = req.body;

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

      // Increment Coupon Usage if payment is successful
      if (couponCode) {
          const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
          if (coupon) {
              coupon.usedCount += 1;
              await coupon.save();
          }
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
      status: 'pending' // Expert must manually approve even if paid
    });

    // Create Notification for the Expert
    const Notification = require('../models/Notification');
    await Notification.create({
        recipient: expertId,
        sender: req.user._id,
        type: 'appointment_request',
        message: `New appointment request from ${req.user.name}`,
        link: '/dashboard'
    });

    // Notify Customer of Payment Success
    if (payment) {
        await Notification.create({
            recipient: req.user._id,
            sender: null, // System notification
            type: 'payment_success',
            message: `Payment of ₹${payment.amount} successful!`,
            link: '/dashboard'
        });
    }
    
    // Real-time notification
    const io = req.app.get('io');
    if (io) {
        // We emit to the specific user room (userId)
        io.to(expertId.toString()).emit('notification', {
            type: 'appointment_request',
            message: `New appointment request from ${req.user.name}`
        });

        // Emit to Customer (Payment Success)
        if (payment) {
            io.to(req.user._id.toString()).emit('notification', {
                type: 'payment_success',
                message: `Payment of ₹${payment.amount} successful!`
            });
        }
    }

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
