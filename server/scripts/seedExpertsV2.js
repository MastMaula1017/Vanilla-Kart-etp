const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Review = require('../models/Review');

dotenv.config({ path: '.env' }); // Adjust path if running from server/scripts

const categories = [
  "Software Development",
  "Marketing", 
  "Business", 
  "Finance", 
  "Legal", 
  "Design", 
  "Health", 
  "Career Coaching"
];

const expertData = [
    // Software Development
    { name: "Alex Chen", category: "Software Development", bio: "Senior Full Stack Developer with 10 years of experience in React, Node.js, and Cloud Architecture.", rate: 80, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
    { name: "Sarah Jenkins", category: "Software Development", bio: "Expert in Python/Django and AI integration. Helping startups scale their tech stack.", rate: 95, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
    
    // Marketing
    { name: "Emily Wong", category: "Marketing", bio: "Digital Marketing Strategist specializing in SEO and Content Marketing for SaaS companies.", rate: 60, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
    { name: "David Miller", category: "Marketing", bio: "Brand Consultant and Social Media expert. I help brands find their voice.", rate: 75, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },

    // Business
    { name: "Robert Fox", category: "Business", bio: "Business Analyst and Strategy Consultant. MBA with a focus on operational efficiency.", rate: 120, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
    { name: "Lisa Park", category: "Business", bio: "Startup Advisor helping founders with pitch decks, fundraising, and go-to-market strategy.", rate: 150, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop" },

    // Finance
    { name: "James Wilson", category: "Finance", bio: "Certified Financial Planner (CFP). Specialized in personal finance and investment strategies.", rate: 100, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
    { name: "Maria Garcia", category: "Finance", bio: "Corporate Finance expert and tax consultant for small businesses.", rate: 110, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop" },

    // Legal
    { name: "William Turner", category: "Legal", bio: "Corporate Lawyer specializing in intellectual property and contract law.", rate: 200, image: "https://images.unsplash.com/photo-1556157382-97eda2d6229b?w=400&h=400&fit=crop" },
    { name: "Jennifer Lee", category: "Legal", bio: "Family Law Attorney and Mediator. compassionate legal advice for difficult times.", rate: 180, image: "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=400&h=400&fit=crop" },

    // Design
    { name: "Michael Brown", category: "Design", bio: "UI/UX Designer tailored for high-conversion web and mobile applications.", rate: 70, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
    { name: "Ashley Taylor", category: "Design", bio: "Graphic Designer and Brand Identity specialist. Creating visual systems that last.", rate: 65, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" },

    // Health
    { name: "Dr. Thomas Clark", category: "Health", bio: "Nutritionist and Health Coach. Focusing on holistic wellness and preventive care.", rate: 90, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" },
    { name: "Dr. Susan White", category: "Health", bio: "Mental Health Counselor. Providing a safe space for stress management and personal growth.", rate: 85, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop" },

    // Career Coaching
    { name: "Kevin Martinez", category: "Career Coaching", bio: "Resume Writer and Interview Coach. I help you land your dream job at top tech companies.", rate: 55, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
    { name: "Patricia Moore", category: "Career Coaching", bio: "Executive Coach for leadership development and career transitions.", rate: 130, image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop" }
];

const customerData = [
    { name: "Alice Customer", email: "alice.c@example.com" },
    { name: "Bob Client", email: "bob.c@example.com" },
    { name: "Charlie User", email: "charlie.c@example.com" },
    { name: "Diana Buyer", email: "diana.c@example.com" },
    { name: "Evan Guest", email: "evan.c@example.com" }
];

const reviewComments = [
    "Amazing experience! Highly recommended.",
    "Very professional and knowledgeable.",
    "Helped me solve my problem in just one session.",
    "Great advice, but a bit expensive.",
    "Excellent communication skills.",
    "Truly an expert in their field.",
    "I learned so much, thank you!",
    "Would definitely book again."
];

const seedExperts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Create Customers first
        const customers = [];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        for (const c of customerData) {
            let user = await User.findOne({ email: c.email });
            if (!user) {
                user = await User.create({
                    name: c.name,
                    email: c.email,
                    password: hashedPassword,
                    roles: ['customer']
                });
                console.log(`Created customer: ${c.name}`);
            }
            customers.push(user);
        }

        // Create Experts
        for (const e of expertData) {
            const email = `${e.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
            let user = await User.findOne({ email });

            const expertProfile = {
                specialization: e.category,
                bio: e.bio,
                hourlyRate: e.rate,
                verificationStatus: 'verified',
                badges: ['Verified'],
                availability: [
                    { day: 'Monday', slots: ['09:00', '10:00', '14:00', '15:00'] },
                    { day: 'Tuesday', slots: ['09:00', '11:00', '13:00', '16:00'] },
                    { day: 'Wednesday', slots: ['10:00', '14:00', '15:00', '17:00'] },
                    { day: 'Thursday', slots: ['09:00', '12:00', '14:00'] },
                    { day: 'Friday', slots: ['09:00', '10:00', '11:00', '15:00'] }
                ],
                averageRating: 0,
                totalReviews: 0
            };

            if (!user) {
                user = await User.create({
                    name: e.name,
                    email: email,
                    password: hashedPassword,
                    roles: ['expert'],
                    profileImage: e.image,
                    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop', // Generic professional cover
                    expertProfile
                });
                console.log(`Created expert: ${e.name}`);
            } else {
                // Update existing if found
                if (!user.roles.includes('expert')) user.roles.push('expert');
                user.expertProfile = expertProfile;
                user.profileImage = e.image;
                user.coverImage = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop';
                await user.save();
                console.log(`Updated expert: ${e.name}`);
            }

            // Add Reviews
            const numReviews = Math.floor(Math.random() * 4) + 2; // 2 to 5 reviews
            for (let i = 0; i < numReviews; i++) {
                const customer = customers[Math.floor(Math.random() * customers.length)];
                const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5
                const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];

                // Check if review exists to avoid duplicates
                const existingReview = await Review.findOne({ customer: customer._id, expert: user._id });
                if (!existingReview) {
                    await Review.create({
                        expert: user._id,
                        customer: customer._id,
                        rating,
                        comment,
                        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)) // Random date in past
                    });
                }
            }
        }

        console.log('Experts and Reviews seeded. Recalculating ratings...');
        // Recalculate ratings manually here to be sure
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
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedExperts();
