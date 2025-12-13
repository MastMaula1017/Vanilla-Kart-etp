const User = require('../models/User');

// @desc    Get all experts (with filtering)
// @route   GET /api/experts
// @access  Public
const getExperts = async (req, res) => {
  try {
    const experts = await User.find({ role: 'expert' }).select('-password');
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
    if (expert && expert.role === 'expert') {
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
        role: updatedUser.role,
        expertProfile: updatedUser.expertProfile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExperts, getExpertById, updateExpertProfile };
