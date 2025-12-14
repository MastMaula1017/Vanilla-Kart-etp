const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const inspectUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const users = await User.find({});
    console.log(`Total Users Found: ${users.length}`);
    
    users.forEach(u => {
        console.log(`User: ${u.email} | ID: ${u._id}`);
        console.log(`   - role (old): ${u.role}`);
        console.log(`   - roles (new): ${u.roles}`);
        console.log('---');
    });

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

inspectUsers();
