const Review = require('../models/Review');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Customer only)
const createReview = async (req, res) => {
  const { expertId, rating, comment } = req.body;

  try {
    // Check if user already reviewed this expert? Maybe allow multiple.
    const review = await Review.create({
      customer: req.user._id,
      expert: expertId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for an expert
// @route   GET /api/reviews/:expertId
// @access  Public
const getExpertReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ expert: req.params.expertId }).populate('customer', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getExpertReviews };
