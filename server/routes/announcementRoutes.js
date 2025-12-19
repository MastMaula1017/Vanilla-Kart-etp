const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    createAnnouncement, 
    getAdminAnnouncements, 
    getAnnouncements, 
    deleteAnnouncement 
} = require('../controllers/announcementController');

// Public/User route to fetch notifications
// Note: We use 'protect' optionally inside the controller if we wanted strict role check, 
// but here we might want 'protect' middleware to attach req.user if token exists.
// However, the current 'protect' middleware throws 401 if no token. 
// So for general 'getAnnouncements', we might need a "lax" protect or just 2 routes.
// Let's assume the frontend calls this with token if logged in.
// Actually, let's keep it simple: Protected route for "My Notifications"
router.get('/', protect, getAnnouncements); 
// Public route if we want one? 
// router.get('/public', getPublicAnnouncements);

// Admin Routes
router.post('/', protect, authorize('admin', 'moderator'), createAnnouncement);
router.get('/admin', protect, authorize('admin', 'moderator'), getAdminAnnouncements);
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteAnnouncement);

module.exports = router;
