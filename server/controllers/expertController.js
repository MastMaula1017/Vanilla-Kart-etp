const User = require('../models/User');

// @desc    Get all experts (with filtering)
// @route   GET /api/experts
// @access  Public
const getExperts = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, specialization, rating, day } = req.query;

    const query = { roles: 'expert' };

    // Search (Name or Bio or Specialization)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { 'expertProfile.bio': searchRegex },
        { 'expertProfile.specialization': searchRegex }
      ];
    }

    // Specialization Filter
    if (specialization) {
      query['expertProfile.specialization'] = specialization;
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query['expertProfile.hourlyRate'] = {};
      if (minPrice) query['expertProfile.hourlyRate'].$gte = Number(minPrice);
      if (maxPrice) query['expertProfile.hourlyRate'].$lte = Number(maxPrice);
    }

    // Availability Filter (Day)
    if (day) {
      query['expertProfile.availability'] = {
        $elemMatch: {
          day: day,
          isActive: true
        }
      };
    }

    // Rating Filter
    if (rating) {
        query['expertProfile.averageRating'] = { $gte: Number(rating) };
    }

    let experts = await User.find(query).select('-password');

    // Rating Filter (Client-side aggregation in simplified backend, or handled here if ratings stored on user)
    // NOTE: For now, assuming reviews are separate. 
    // Ideally we aggregate reviews. For simplicity, skipping strict DB rating filter unless we add avgRating to User model.
    // If we want to filter by rating here, we'd need to fetch reviews or rely on a pre-calculated field.
    // Let's assume for this MVP we filter after fetch OR just skip backend rating filter if complex.
    // Actually, let's filter in memory if the dataset is small, or just ignore if not stored.
    
    res.json(experts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expert by ID
// @route   GET /api/experts/:id
// @access  Public
const getExpertById = async (req, res) => {
  try {
    const expert = await User.findById(req.params.id).select('-password');
    if (expert && expert.roles.includes('expert')) {
      res.json(expert);
    } else {
      res.status(404).json({ message: 'Expert not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update expert profile (including availability)
// @route   PUT /api/experts/profile
// @access  Private (Expert only)
const updateExpertProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.expertProfile) {
        user.expertProfile = { ...user.expertProfile, ...req.body.expertProfile };
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        roles: updatedUser.roles,
        expertProfile: updatedUser.expertProfile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    AI Matchmaker - Suggest experts based on problem description
// @route   POST /api/experts/match
// @access  Public
const matchExperts = async (req, res) => {
  try {
    const { problem, category, budget } = req.body;
    
    // 1. Base Query: Get Active Experts
    let query = { roles: 'expert' };
    
    // Optional hard filter for category if user is very specific, 
    // but for AI match we usually prefer soft matching (scoring) unless explicitly selected.
    // If 'category' is provided from a dropdown, we can use it as a booster or hard filter.
    // Let's use it as a booster in scoring, but fetch broad set first.
    
    // Fetch all experts to process in memory (assuming expert count < 1000 for now)
    // For scale, we'd use MongoDB text search ($text).
    const experts = await User.find(query).select('-password');
    
    // 2. Scoring Logic
    const scoredExperts = experts.map(expert => {
        let score = 0;
        const profile = expert.expertProfile || {};
        const specialization = profile.specialization?.toLowerCase() || '';
        const bio = profile.bio?.toLowerCase() || '';
        const userProblem = problem?.toLowerCase() || '';
        const userCategory = category?.toLowerCase() || '';
        
        // A. Category Match (High Weight)
        if (userCategory && specialization.includes(userCategory)) {
            score += 20;
        } else if (userCategory && bio.includes(userCategory)) {
            score += 10;
        }
        
        // B. Keyword Matching in Bio/Specialization
        // Split problem into keywords (remove common stopwords if we wanted to be fancy)
        const keywords = userProblem.split(' ').filter(word => word.length > 3);
        
        keywords.forEach(word => {
            if (specialization.includes(word)) score += 5;
            if (bio.includes(word)) score += 3;
        });
        
        // C. Rating Boost
        if (profile.averageRating >= 4.5) score += 5;
        else if (profile.averageRating >= 4.0) score += 2;
        
        // D. Budget Fit (If budget provided)
        // budget might be "low" (<500), "medium" (500-1500), "high" (>1500) or a number
        const rate = profile.hourlyRate || 0;
        if (budget) {
            if (budget === 'low' && rate <= 500) score += 10;
            else if (budget === 'medium' && rate > 500 && rate <= 1500) score += 10;
            else if (budget === 'high' && rate > 1500) score += 10;
            // Penalize slightly if way out of range? No, just don't boost.
        }

        return {
            ...expert.toObject(),
            matchScore: score,
            matchReason: score > 10 ? 'High relevance to your needs' : 'Potential match'
        };
    });
    
    // 3. Sort and Filter
    const recommendations = scoredExperts
        .filter(e => e.matchScore > 0) // Only return relevant ones
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3); // Top 3
        
    res.json(recommendations);
    
  } catch (error) {
    console.error("Matchmaker Error:", error);
    res.status(500).json({ message: 'Error processing match' });
  }
};

module.exports = { getExperts, getExpertById, updateExpertProfile, matchExperts };
