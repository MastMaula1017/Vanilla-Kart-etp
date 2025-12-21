const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Load env variables from server/.env

const promoteUser = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/consultancy_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const emailsToCheck = ['vansh14raturi@gmail.com', 'vansh14raturi@gmail.ocm'];
    let user = await User.findOne({ email: { $in: emailsToCheck } });

    if (!user) {
      console.log('User not found! Listing all users:');
      const allUsers = await User.find({}, 'email name role');
      console.log(allUsers);
      process.exit(1);
    }

    if (!user.roles.includes('admin')) {
      user.roles.push('admin');
    }
    // Ensure customer role is also there conform to new policy
    if (!user.roles.includes('customer')) {
      user.roles.push('customer');
    }
    await user.save();

    console.log(`User ${user.email} (Name: ${user.name}) has been promoted to ADMIN.`);
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

promoteUser();
