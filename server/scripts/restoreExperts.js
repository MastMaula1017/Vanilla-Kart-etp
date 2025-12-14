const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const expertsEmails = [
    "sarah.chen@example.com",
    "james.wilson@example.com", // Rohan Mehta's email in seed
    "anita.roy@example.com",
    "michael.chang@example.com", // Vikram Malhotra
    "elena.rodriguez@example.com" // Sneha Kapoor
];

const restoreExperts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    for (const email of expertsEmails) {
        const user = await User.findOne({ email });
        if (user) {
            // Restore expert role
            // We use $addToSet to ensure uniqueness
            await User.updateOne(
                { _id: user._id },
                { $addToSet: { roles: 'expert' } }
            );
            console.log(`Restored expert role for ${user.name} (${email})`);
        } else {
            console.log(`User ${email} not found`);
        }
    }

    console.log('Experts restoration complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

restoreExperts();
