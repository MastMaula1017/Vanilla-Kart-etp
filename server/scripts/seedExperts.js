const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User'); // Adjust path if needed

dotenv.config();

const experts = [
  {
    name: "Dr. Sarah Chinoy",
    email: "sarah.chen@example.com",
    password: "password123",
    role: "expert",
    expertProfile: {
      specialization: "Clinical Psychology",
      hourlyRate: 1500,
      bio: "Licensed with 10+ years experience in CBT and anxiety management. I help professionals navigate stress and burnout.",
      availability: []
    }
  },
  {
    name: "Rohan Mehta",
    email: "james.wilson@example.com",
    password: "password123",
    role: "expert",
    expertProfile: {
      specialization: "Financial Planning",
      hourlyRate: 2500,
      bio: "Certified CFP helping you build wealth and secure your future. Expert in retirement planning and investment strategies.",
      availability: []
    }
  },
  {
    name: "Anita Roy",
    email: "anita.roy@example.com",
    password: "password123",
    role: "expert",
    expertProfile: {
      specialization: "Career Coaching",
      hourlyRate: 1200,
      bio: "Ex-Google recruiter helping you land your dream job. Resume reviews, interview prep, and salary negotiation.",
      availability: []
    }
  },
  {
    name: "Vikram Malhotra",
    email: "michael.chang@example.com",
    password: "password123",
    role: "expert",
    expertProfile: {
      specialization: "Software Architecture",
      hourlyRate: 3000,
      bio: "Staff Engineer at a Big Tech firm. I can help you design scalable systems and clear your system design interviews.",
      availability: []
    }
  },
  {
    name: "Sneha Kapoor",
    email: "elena.rodriguez@example.com",
    password: "password123",
    role: "expert",
    expertProfile: {
      specialization: "Legal Consulting",
      hourlyRate: 4000,
      bio: "Corporate lawyer with expertise in startup law, IP protection, and contract negotiation.",
      availability: []
    }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing experts to avoid duplicates/stale data
    await User.deleteMany({ role: 'expert' });
    
    for (const expertData of experts) {
      const existing = await User.findOne({ email: expertData.email });
      if (existing) {
        console.log(`User ${expertData.email} already exists`);
        continue;
      }

      const user = new User({
        name: expertData.name,
        email: expertData.email,
        password: expertData.password,
        role: expertData.role,
        expertProfile: expertData.expertProfile
      });

      await user.save();
      console.log(`Created expert: ${user.name}`);
    }

    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
