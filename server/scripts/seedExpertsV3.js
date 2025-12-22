const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Review = require('../models/Review');
const path = require('path');

// Load env vars from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const newExperts = [
    {
        name: "Vikram Malhotra",
        category: "Software Development",
        bio: "Senior Architect with 12 years in Cloud Computing and Distributed Systems. Ex-Google.",
        rate: 150,
        image: "https://i.pinimg.com/736x/02/6c/0a/026c0a103972e2abf7c8cc035fe603c4.jpg", // User provided specific image
        cover: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=400&fit=crop"
    },
    {
        name: "Priya Singh",
        category: "Marketing",
        bio: "Digital Brand Manager helping brands scale on social media. Specialist in Instagram and LinkedIn growth.",
        rate: 90,
        image: "https://i.pinimg.com/1200x/f0/51/6e/f0516e29434baa16e8793b41245ff659.jpg", // User provided specific image
        cover: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&h=400&fit=crop"
    },
    {
        name: "Amit Patel",
        category: "Finance",
        bio: "Chartered Accountant (CA) and Investment Advisor. Helping you plan your tax and wealth creation.",
        rate: 110,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop", // Authentic Indian Male
        cover: "https://images.unsplash.com/photo-1554224155-98406852d009?w=1200&h=400&fit=crop"
    },
    {
        name: "Anjali Gupta",
        category: "Legal",
        bio: "Corporate Lawyer specialized in Contract Law for Startups and SMEs.",
        rate: 130,
        image: "https://i.pinimg.com/736x/5e/44/96/5e4496343bccec7c4bcac682dce2ce2c.jpg", // User provided specific image
        cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1200&h=400&fit=crop"
    }
];

const customerData = [
    { name: "Rahul Verma", email: "rahul.v@example.com" },
    { name: "Sneha Reddy", email: "sneha.r@example.com" }
];

const reviewComments = [
    "Excellent advice, very practical.",
    "Highly knowledgeable and professional.",
    "Solved my issue in 30 minutes. worth it!",
    "Great session, will book again."
];

const seedIndianExperts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Ensure dummy customers exist
        const customers = [];
        for (const c of customerData) {
            let user = await User.findOne({ email: c.email });
            if (!user) {
                user = await User.create({
                    name: c.name,
                    email: c.email,
                    password: hashedPassword,
                    roles: ['customer']
                });
            }
            customers.push(user);
        }

        for (const e of newExperts) {
            const email = `${e.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
            let user = await User.findOne({ email });

            const expertProfile = {
                specialization: e.category,
                bio: e.bio,
                hourlyRate: e.rate,
                verificationStatus: 'verified',
                badges: ['Verified', 'Top Rated'],
                availability: [
                    { day: 'Monday', startTime: '09:00', endTime: '17:00', isActive: true },
                    { day: 'Wednesday', startTime: '10:00', endTime: '18:00', isActive: true },
                    { day: 'Friday', startTime: '09:00', endTime: '15:00', isActive: true },
                    { day: 'Saturday', startTime: '10:00', endTime: '14:00', isActive: true }
                ],
                averageRating: 0,
                totalReviews: 0
            };

            if (!user) {
                user = await User.create({
                    name: e.name,
                    email: email,
                    password: hashedPassword,
                    roles: ['customer', 'expert'],
                    profileImage: e.image,
                    coverImage: e.cover,
                    expertProfile
                });
                console.log(`Created expert: ${e.name}`);
            } else {
                 // Update if exists
                if (!user.roles.includes('customer')) user.roles.push('customer');
                if (!user.roles.includes('expert')) user.roles.push('expert');
                user.expertProfile = expertProfile;
                user.profileImage = e.image;
                user.coverImage = e.cover;
                await user.save();
                console.log(`Updated expert: ${e.name}`);
            }

            // Add 1-2 Reviews
            const numReviews = 2;
            for (let i = 0; i < numReviews; i++) {
                const customer = customers[i % customers.length];
                const rating = 5; 
                const comment = reviewComments[i % reviewComments.length];

                const existingReview = await Review.findOne({ customer: customer._id, expert: user._id });
                if (!existingReview) {
                    await Review.create({
                        expert: user._id,
                        customer: customer._id,
                        rating,
                        comment,
                        createdAt: new Date()
                    });
                }
            }
        }

        // Recalculate stats
        console.log('Recalculating ratings...');
        const allExperts = await User.find({ roles: 'expert' });
        for (const exp of allExperts) {
             const stats = await Review.aggregate([
                { $match: { expert: exp._id } },
                { $group: { _id: '$expert', averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
            ]);

            if (stats.length > 0) {
                const avg = stats[0].averageRating.toFixed(1);
                const total = stats[0].totalReviews;
                await User.findByIdAndUpdate(exp._id, {
                    'expertProfile.averageRating': avg,
                    'expertProfile.totalReviews': total
                });
            }
        }

        console.log('Seeding Complete.');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedIndianExperts();
