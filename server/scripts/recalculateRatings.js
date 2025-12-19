const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Review = require('../models/Review');

dotenv.config({ path: '.env' }); // Adjust path if needed

const recalculateRatings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Get all users who are experts
        const experts = await User.find({ roles: 'expert' });
        console.log(`Found ${experts.length} experts.`);

        for (const expert of experts) {
            console.log(`Processing expert: ${expert.name} (${expert._id})`);
            
            const stats = await Review.aggregate([
                { $match: { expert: expert._id } },
                {
                    $group: {
                        _id: '$expert',
                        averageRating: { $avg: '$rating' },
                        totalReviews: { $sum: 1 }
                    }
                }
            ]);

            if (stats.length > 0) {
                const avg = stats[0].averageRating.toFixed(1);
                const total = stats[0].totalReviews;
                
                await User.findByIdAndUpdate(expert._id, {
                    'expertProfile.averageRating': avg,
                    'expertProfile.totalReviews': total
                });
                console.log(`  -> Updated: Rating ${avg}, Reviews ${total}`);
            } else {
                // Reset to 0 if no reviews
                 await User.findByIdAndUpdate(expert._id, {
                    'expertProfile.averageRating': 0,
                    'expertProfile.totalReviews': 0
                });
                console.log(`  -> No reviews found. Reset to 0.`);
            }
        }

        console.log('Recalculation Complete.');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

recalculateRatings();
