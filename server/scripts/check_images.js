const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to DB:', error);
        process.exit(1);
    }
};

const checkImages = async () => {
    await connectDB();
    const users = await User.find({ profileImage: { $exists: true, $ne: null } }).select('name email profileImage');
    console.log('Users with profile images:', JSON.stringify(users, null, 2));
    process.exit();
};

checkImages();
