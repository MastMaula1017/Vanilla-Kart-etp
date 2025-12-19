const express = require('express');
const router = express.Router();
const { createReview, getExpertReviews, deleteReview, updateReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), createReview);
router.get('/:expertId', getExpertReviews);
router.delete('/:id', protect, deleteReview);
router.put('/:id', protect, updateReview);

module.exports = router;
