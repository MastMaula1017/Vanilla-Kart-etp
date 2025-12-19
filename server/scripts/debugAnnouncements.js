const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Announcement = require('../models/Announcement');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkAnnouncements = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const count = await Announcement.countDocuments();
        console.log(`Total Announcements: ${count}`);

        const all = await Announcement.find({});
        console.log('Announcements:', JSON.stringify(all, null, 2));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAnnouncements();
