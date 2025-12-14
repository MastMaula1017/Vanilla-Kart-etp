const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixUserData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Use lean to get raw documents including fields not in current schema
    const users = await User.find({}).lean();
    console.log(`Processing ${users.length} users...`);

    let updatedCount = 0;

    for (const user of users) {
        let roles = user.roles || [];
        let needsUpdate = false;

        // Attempt to recover from old 'role' field if 'roles' is empty
        if (roles.length === 0) {
            if (user.role) {
                console.log(`Recovering role '${user.role}' for ${user.email}`);
                roles.push(user.role);
                needsUpdate = true;
            } else {
                console.log(`No role found for ${user.email}, defaulting to customer`);
                roles.push('customer');
                needsUpdate = true;
            }
        }

        // Ensure roles is valid array
        if (!Array.isArray(roles)) {
            roles = [roles];
            needsUpdate = true;
        }
        
        // Remove 'role' field if it exists to clean up
        const unset = user.role ? { role: "" } : {};

        if (needsUpdate || user.role) {
            await User.updateOne(
                { _id: user._id },
                { 
                    $set: { roles: roles },
                    $unset: { role: "" }
                }
            );
            updatedCount++;
            console.log(`Updated ${user.email}: roles=[${roles.join(', ')}]`);
        }
    }

    console.log(`Fixed ${updatedCount} users.`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

fixUserData();
