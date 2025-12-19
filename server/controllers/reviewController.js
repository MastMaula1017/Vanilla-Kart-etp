const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Customer only)
const createReview = async (req, res) => {
  const { expertId, rating, comment } = req.body;

  try {
    // 1. Count confirmed/completed appointments
    const appointmentCount = await Appointment.countDocuments({
        customer: req.user._id,
        expert: expertId,
        status: { $in: ['confirmed', 'completed'] }
    });

    if (appointmentCount === 0) {
        return res.status(403).json({ message: "You can only review experts after a confirmed appointment." });
    }

    // 2. Count existing reviews
    const reviewCount = await Review.countDocuments({
        customer: req.user._id,
        expert: expertId
    });

    if (reviewCount >= appointmentCount) {
        return res.status(403).json({ message: `You have ${appointmentCount} confirmed appointment(s) and already wrote ${reviewCount} review(s). Book another session to leave another review.` });
    }

    // 2. Check if user already reviewed this expert? (Optional: Allow 1 review per appointment? Or just 1 per expert?)
    // For now, let's allow multiple, or just restrict to 1 per expert if desired. 
    // Usually 1 review per unique service interaction. Let's keep it simple for now.

    const review = await Review.create({
      customer: req.user._id,
      expert: expertId,
      rating: Number(rating),
      comment
    });

    // 3. Calculate new Average Rating
    const stats = await Review.aggregate([
        { $match: { expert: new mongoose.Types.ObjectId(expertId) } },
        {
            $group: {
                _id: '$expert',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    // 4. Update Expert Profile
    if (stats.length > 0) {
        console.log(`Updating stats for expert ${expertId}:`, stats[0]);
        await User.findByIdAndUpdate(expertId, {
            'expertProfile.averageRating': stats[0].averageRating.toFixed(1), // Keep 1 decimal
            'expertProfile.totalReviews': stats[0].totalReviews
        });
    } else {
        console.log(`No stats found for expert ${expertId}`);
    }

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

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin, Moderator, or Review Owner)
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check permissions
        const isAdmin = req.user.roles && (req.user.roles.includes('admin') || req.user.roles.includes('moderator'));
        const isOwner = review.customer.toString() === req.user._id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(401).json({ message: 'Not authorized to delete this review' });
        }

        const expertId = review.expert;
        await review.deleteOne();

        // Recalculate stats
        await recalculateExpertStats(expertId);

        res.json({ message: 'Review removed' });
    } catch (error) {
        console.error("Delete Review Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Review Owner only)
const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check permissions
        if (review.customer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to edit this review' });
        }

        review.rating = Number(rating) || review.rating;
        review.comment = comment || review.comment;
        await review.save();

        // Recalculate stats
        await recalculateExpertStats(review.expert);

        // Forced restart
        res.status(200).json({ success: true, data: review });
    } catch (error) {
        console.error("Update Review Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Helper to recalculate stats
const recalculateExpertStats = async (expertId) => {
    try {
        const stats = await Review.aggregate([
            { $match: { expert: new mongoose.Types.ObjectId(String(expertId)) } },
            {
                $group: {
                    _id: '$expert',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await User.findByIdAndUpdate(expertId, {
                'expertProfile.averageRating': stats[0].averageRating.toFixed(1),
                'expertProfile.totalReviews': stats[0].totalReviews
            });
        } else {
            await User.findByIdAndUpdate(expertId, {
                'expertProfile.averageRating': 0,
                'expertProfile.totalReviews': 0
            });
        }
    } catch (error) {
        console.error("Recalculate Stats Error:", error);
    }
};

module.exports = { createReview, getExpertReviews, deleteReview, updateReview };
