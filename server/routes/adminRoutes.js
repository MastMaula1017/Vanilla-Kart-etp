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
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/experts', getAllExperts);
router.route('/users/:id').delete(deleteUser);
router.put('/users/:id/roles', updateUserRoles);
router.get('/inquiries', getAllInquiries);
router.put('/inquiries/:id', updateInquiryStatus);
router.post('/inquiries/:id/reply', replyToInquiry);

module.exports = router;
