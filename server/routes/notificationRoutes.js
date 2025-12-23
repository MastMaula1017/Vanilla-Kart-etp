const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getUserNotifications, 
    markAsRead, 
    markAllAsRead,
    createNotification
} = require('../controllers/notificationController');

router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.post('/', protect, createNotification);

module.exports = router;
