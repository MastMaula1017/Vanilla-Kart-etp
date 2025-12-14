const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const restoreAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'vansh14raturi@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
        console.log(`User ${email} not found!`);
    } else {
        console.log(`User found: ${user.name}`);
        console.log(`Current Roles: ${user.roles}`);
        console.log(`Old Role Field: ${user.role}`); // Should be undefined

        // Force update to include both expert and admin
        // using $addToSet to avoid duplicates, but considering we want to FORCE both:
        user.roles = ['expert', 'admin', 'customer']; // Adding customer to be safe if used elsewhere
        
        // Remove duplicates just in case
        user.roles = [...new Set(user.roles)];
        
        await user.save();
        console.log(`UPDATED Roles: ${user.roles}`);
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

restoreAdmin();
