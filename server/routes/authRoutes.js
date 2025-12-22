const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, changePassword, forgotPassword, resetPassword, getUserById, uploadProfilePhoto, uploadCoverPhoto, googleLogin, uploadVerificationDocument } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
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
router.post('/profile/image', protect, upload.single('image'), uploadProfilePhoto);
router.post('/profile/cover', protect, upload.single('image'), uploadCoverPhoto);
router.post('/profile/verification', protect, upload.single('document'), uploadVerificationDocument);
router.put('/password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/user/:id', protect, getUserById);

module.exports = router;
