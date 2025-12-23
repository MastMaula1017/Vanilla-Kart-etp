const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin'), couponController.createCoupon);
router.get('/', protect, authorize('admin'), couponController.getAllCoupons);
router.delete('/:id', protect, authorize('admin'), couponController.deleteCoupon);
router.post('/verify', protect, couponController.verifyCoupon);

router.get('/random', couponController.getRandomCoupon);

module.exports = router;
