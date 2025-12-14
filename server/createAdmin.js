const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'vansh14raturi@gmail.com';
    const user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`User ${email} is now an Admin!`);
    } else {
      console.log(`User ${email} not found. Please register first.`);
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
