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
  updateUserRoles
} = require('../controllers/adminController');

// All routes are protected and require 'admin' role
router.use(protect);
// Protect all routes
router.use(protect);

// Dashboard & User Management (Admin Only)
router.get('/stats', authorize('admin'), getDashboardStats);
router.get('/users', authorize('admin'), getAllUsers);
router.get('/experts', authorize('admin'), getAllExperts);
router.route('/users/:id')
    .delete(authorize('admin'), deleteUser);
router.put('/users/:id/roles', authorize('admin'), updateUserRoles);

// Inquiries (Admin & Inquiry Support)
router.get('/inquiries', authorize('admin', 'inquiry_support'), getAllInquiries);
router.put('/inquiries/:id', authorize('admin', 'inquiry_support'), updateInquiryStatus);
router.post('/inquiries/:id/reply', authorize('admin', 'inquiry_support'), replyToInquiry);

module.exports = router;
