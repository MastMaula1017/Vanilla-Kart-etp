const express = require('express');
const router = express.Router();
const { getExperts, getExpertById, updateExpertProfile, matchExperts } = require('../controllers/expertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/match', matchExperts);
router.get('/', getExperts);
router.get('/:id', getExpertById);
router.put('/profile', protect, authorize('expert'), updateExpertProfile);

module.exports = router;
