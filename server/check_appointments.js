const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
require('dotenv').config();

const checkAppointments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Appointment.countDocuments();
    console.log(`Total Appointments in DB: ${count}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkAppointments();
