const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, sensitiveLimiter } = require('../middleware/rateLimiters');

const { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, changePassword, forgotPassword, resetPassword, getUserById, uploadProfilePhoto, uploadCoverPhoto, googleLogin, uploadVerificationDocument, markOnboardingSeen, sendVerificationOTP, verifyEmailOTP } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

router.post('/verify-email/send', sensitiveLimiter, sendVerificationOTP);
router.post('/verify-email/validate', sensitiveLimiter, verifyEmailOTP);

router.post('/register', sensitiveLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);
router.post('/google', googleLogin);
router.get('/debug-cookie', (req, res) => {
  res.json({
    cookies: req.cookies || 'No cookies object',
    hasJwt: !!(req.cookies && req.cookies.jwt),
    protocol: req.protocol,
    secure: req.secure,
    env: process.env.NODE_ENV,
    headers: {
        origin: req.headers.origin,
        'x-forwarded-proto': req.headers['x-forwarded-proto']
    }
  });
});
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Multer Upload Error:", err);
      // Return JSON directly to avoid default HTML error page
      return res.status(400).json({ message: 'Image upload failed', error: err.message, stack: err.stack });
    }
    next();
  });
};

const uploadCoverMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Multer Cover Upload Error:", err);
      return res.status(400).json({ message: 'Cover upload failed', error: err.message, stack: err.stack });
    }
    next();
  });
};

router.post('/profile/image', protect, uploadMiddleware, uploadProfilePhoto);
router.post('/profile/cover', protect, uploadCoverMiddleware, uploadCoverPhoto);
router.post('/profile/verification', protect, upload.single('document'), uploadVerificationDocument);
router.put('/password', protect, changePassword);
router.put('/onboarding-seen', protect, markOnboardingSeen);
router.post('/forgot-password', sensitiveLimiter, forgotPassword);
router.post('/reset-password', sensitiveLimiter, resetPassword);
router.get('/user/:id', protect, getUserById);

module.exports = router;
