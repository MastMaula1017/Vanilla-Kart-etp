const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); 
const Appointment = require('./models/Appointment');
const Message = require('./models/Message');
const Review = require('./models/Review');

dotenv.config();

const resetDB = async () => {
  try {
    // Allow passing URI as command line argument, or use .env
    const uri = process.argv[2] || process.env.MONGO_URI;
    
    if (!uri) {
        console.error('Error: No MONGO_URI provided. Pass it as an argument or set it in .env');
        process.exit(1);
    }

    console.log(`Connecting to: ${uri.split('@')[1]}`); // Log only host for safety

    await mongoose.connect(uri);
    console.log('MongoDB Connected');

    console.log('Clearing Users...');
    await User.deleteMany({});
    
    console.log('Clearing Appointments...');
    await Appointment.deleteMany({});

    console.log('Clearing Messages...');
    await Message.deleteMany({});

    console.log('Clearing Reviews...');
    // Check if Review model exists/is imported correctly before deleting
    try {
        await Review.deleteMany({});
    } catch (e) {
        console.log('Skipping Reviews (model might be missing or empty)');
    }

    console.log('SUCCESS: Database cleared!');
    process.exit();
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
};

resetDB();
