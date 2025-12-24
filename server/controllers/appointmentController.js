const Appointment = require('../models/Appointment');
const Coupon = require('../models/Coupon');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const crypto = require('crypto');

const getBookedSlots = async (req, res) => {
  const { expertId, date } = req.query;
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      expert: expertId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: 'cancelled' }
    }).select('startTime endTime');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAppointment = async (req, res) => {
  const { expertId, date, startTime, endTime, notes, payment, couponCode } = req.body;

  if (req.user._id.toString() === expertId) {
    return res.status(400).json({ message: 'You cannot book an appointment with yourself' });
  }

  // 1. Enforce 1-Hour Duration
  // StartTime and EndTime are expected to be in "HH:MM" format (24h)
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;
  const duration = endTotalMinutes - startTotalMinutes;

  if (duration !== 60) {
      return res.status(400).json({ message: 'Appointments must be exactly 1 hour long.' });
  }

  // 2. Check for Overlaps
  // We check if there is any existing appointment for the same expert and date
  // where the new time range overlaps with an existing one.
  // Overlap logic: (StartA < EndB) and (EndA > StartB)
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAppointments = await Appointment.find({
      expert: expertId,
      date: {
          $gte: startOfDay,
          $lte: endOfDay
      },
      status: { $ne: 'cancelled' }
  });

  const hasOverlap = existingAppointments.some(appt => {
      // Convert existing times to comparable values
      // Assuming appt.startTime and appt.endTime are "HH:MM" strings
      // Ideally better to store as full Dates or minutes from midnight, but sticking to current schema string format
      return (startTime < appt.endTime && endTime > appt.startTime);
  });

  if (hasOverlap) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
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
          status: 'captured',
          platformFee: payment.amount * 0.05,
          expertEarnings: payment.amount * 0.95
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

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Authorization Check
    if (status === 'confirmed') {
      if (appointment.expert.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to confirm this appointment' });
      }
    } else if (status === 'cancelled') {
       if (appointment.expert.toString() !== req.user._id.toString() && appointment.customer.toString() !== req.user._id.toString()) {
         return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
       }
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAppointment, getAppointments, updateAppointmentStatus, getBookedSlots };
