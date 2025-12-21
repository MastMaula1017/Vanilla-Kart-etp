const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const migrateRoles = async () => {
  await connectDB();

  try {
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate...`);

    for (const user of users) {
        // If user already has roles array, skip or ensure it's synced? 
        // Assuming we are migrating from role (string) -> roles (array)
        
        // We can't access .role if the schema is already changed to .roles and strict is on, 
        // but checking the raw document, 'role' field exists. 
        // To be safe, we will rely on Mongoose seeing the 'role' field if we haven't changed schema yet.
        // OR better: use updateOne with $set and $unset using raw commands.
        
        // Strategy: 
        // 1. Read 'role' field.
        // 2. Set 'roles' = [role].
        // 3. Unset 'role'.
        
        // However, Mongoose model 'User' still has 'role' string in the file when I run this script *before* changing the file.
        // So I should treat user as having .role.
        
        if (user.role && (!user.roles || user.roles.length === 0)) {
            const newRoles = ['customer'];
            if (user.role && user.role !== 'customer') {
                newRoles.push(user.role);
            }
            
            await User.updateOne(
                { _id: user._id }, 
                { 
                    $set: { roles: newRoles },
                    $unset: { role: "" }
                }
            );
            console.log(`Migrated user ${user.email} (${user.role}) -> roles: ${JSON.stringify(newRoles)}`);
        }
    }

    console.log('Migration completed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

migrateRoles();
