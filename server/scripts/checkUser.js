const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const checkUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/consultancy_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const email = 'riderknight6789@gmail.com';
    const user = await User.findOne({ email });

    if (user) {
      console.log('User found:');
      console.log(`ID: ${user._id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name}`);
      console.log(`Roles: ${user.roles}`);
      console.log(`Has Password: ${!!user.password}`);
      console.log(`Google ID: ${user.googleId}`);
    } else {
      console.log(`User with email ${email} NOT found.`);
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUser();
