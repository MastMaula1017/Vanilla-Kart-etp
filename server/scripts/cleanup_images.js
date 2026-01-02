const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const cleanupImages = async () => {
    await connectDB();
    
    try {
        const users = await User.find({
            $or: [
                { profileImage: { $regex: 'localhost' } },
                { coverImage: { $regex: 'localhost' } },
                { profileImage: { $regex: '/uploads/' } }, // Catch relative paths too if any
                { coverImage: { $regex: '/uploads/' } }
            ]
        });

        console.log(`Found ${users.length} users with local image paths.`);

        for (const user of users) {
             let updated = false;
             if (user.profileImage && (user.profileImage.includes('localhost') || !user.profileImage.startsWith('http'))) {
                 user.profileImage = '';
                 updated = true;
             }
             if (user.coverImage && (user.coverImage.includes('localhost') || !user.coverImage.startsWith('http'))) {
                 user.coverImage = '';
                 updated = true;
             }
             
             if (updated) {
                 await user.save();
                 console.log(`Cleaned images for user: ${user.email}`);
             }
        }
        
        console.log("Cleanup complete.");
        process.exit();
    } catch (error) {
        console.error("Cleanup Error:", error);
        process.exit(1);
    }
};

cleanupImages();
