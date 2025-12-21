const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus, getBookedSlots } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAppointments);

router.get('/booked-slots', protect, getBookedSlots);

router.route('/:id').put(protect, updateAppointmentStatus);

module.exports = router;
