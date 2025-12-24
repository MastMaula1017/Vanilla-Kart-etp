const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const resetPass = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/consultancy_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const email = 'riderknight6789@gmail.com';
    const user = await User.findOne({ email });

    if (user) {
      user.password = '123'; // The pre-save hook will hash this
      await user.save();
      console.log(`Password for ${email} has been reset to '123'.`);
    } else {
      console.log(`User ${email} not found.`);
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPass();
