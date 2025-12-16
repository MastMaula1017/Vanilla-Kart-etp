const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { registerUser, loginUser, updateUserProfile, changePassword, forgotPassword, resetPassword, getUserById, uploadProfilePhoto, uploadCoverPhoto, googleLogin } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.put('/profile', protect, updateUserProfile);
router.post('/profile/image', protect, upload.single('image'), uploadProfilePhoto);
router.post('/profile/cover', protect, upload.single('image'), uploadCoverPhoto);
router.put('/password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/user/:id', protect, getUserById);

module.exports = router;
