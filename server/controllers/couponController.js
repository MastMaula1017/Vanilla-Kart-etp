const Coupon = require('../models/Coupon');

// Create Coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountType, value, expirationDate, usageLimit } = req.body;

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code,
      discountType,
      value,
      expirationDate,
      usageLimit
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get All Coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete Coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Verify Coupon
exports.verifyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'Coupon is inactive' });
    }

    if (new Date() > new Date(coupon.expirationDate)) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    res.json({
      message: 'Coupon is valid',
      discountType: coupon.discountType,
      value: coupon.value,
      code: coupon.code
    });
  } catch (error) {
    console.error("Error verifying coupon:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Random Coupon (For Scratcher)
exports.getRandomCoupon = async (req, res) => {
  try {
    // Find coupons that are:
    // 1. Active
    // 2. Not expired
    // 3. Usage limit not reached (if limit exists)
    // Find coupons that are Active and Not Expired
    const potentialCoupons = await Coupon.find({
      isActive: true,
      expirationDate: { $gt: new Date() },
      code: { $in: ['RANDOM5', 'RANDOM10'] }
    });

    // Filter out coupons that have reached their usage limit
    const activeCoupons = potentialCoupons.filter(coupon => {
      if (!coupon.usageLimit) return true; // Unlimited
      return coupon.usedCount < coupon.usageLimit;
    });

    if (activeCoupons.length === 0) {
      return res.status(404).json({ message: 'No coupons available' });
    }

    // Pick a random coupon
    const randomIndex = Math.floor(Math.random() * activeCoupons.length);
    const randomCoupon = activeCoupons[randomIndex];

    res.json({
      code: randomCoupon.code,
      discountType: randomCoupon.discountType,
      value: randomCoupon.value
    });
  } catch (error) {
    console.error("Error fetching random coupon:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
