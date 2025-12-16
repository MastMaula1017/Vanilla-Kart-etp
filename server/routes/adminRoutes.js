const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getAllUsers,
  getAllExperts,
  deleteUser,
  getAllInquiries,
  updateInquiryStatus,
  replyToInquiry,
  updateUserRoles,
  getMonthlyStats
} = require('../controllers/adminController');

// All routes are protected and require 'admin' role
router.use(protect);
// Protect all routes
router.use(protect);

// Dashboard & User Management (Admin Only)
// Dashboard & User Management (Admin Only)
router.get('/stats', authorize('admin', 'moderator'), getDashboardStats);
router.get('/stats/monthly', authorize('admin', 'moderator'), getMonthlyStats); 
router.get('/users', authorize('admin', 'moderator'), getAllUsers);
router.get('/experts', authorize('admin', 'moderator'), getAllExperts);
router.route('/users/:id')
    .delete(authorize('admin'), deleteUser);
router.put('/users/:id/roles', authorize('admin', 'moderator'), updateUserRoles);

// Inquiries (Admin, Inquiry Support & Moderator)
router.get('/inquiries', authorize('admin', 'inquiry_support', 'moderator'), getAllInquiries);
router.put('/inquiries/:id', authorize('admin', 'inquiry_support', 'moderator'), updateInquiryStatus);
router.post('/inquiries/:id/reply', authorize('admin', 'inquiry_support', 'moderator'), replyToInquiry);

module.exports = router;
