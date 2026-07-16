const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || '';
    const host = mongoUri.split('@')[1] || 'unknown host';
    console.log(`Attempting to connect to database host: ${host}`);

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Do not call process.exit(1) to let the server start and serve CORS headers/errors
  }
};

module.exports = connectDB;
