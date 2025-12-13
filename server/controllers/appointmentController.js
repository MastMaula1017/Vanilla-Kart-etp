const Appointment = require('../models/Appointment');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  const { expertId, date, startTime, endTime, notes } = req.body;

  if (req.user._id.toString() === expertId) {
    return res.status(400).json({ message: 'You cannot book an appointment with yourself' });
  }

  try {
    const appointment = await Appointment.create({
      customer: req.user._id,
      expert: expertId,
      date,
      startTime,
      endTime,
      notes
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
    let appointments;
    if (req.user.role === 'customer') {
      appointments = await Appointment.find({ customer: req.user._id }).populate('expert', 'name email expertProfile');
    } else if (req.user.role === 'expert') {
      appointments = await Appointment.find({ expert: req.user._id }).populate('customer', 'name email');
    } else {
      appointments = await Appointment.find({}).populate('customer', 'name').populate('expert', 'name');
    }
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
