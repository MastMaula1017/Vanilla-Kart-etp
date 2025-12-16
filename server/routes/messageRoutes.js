const express = require('express');
const router = express.Router();
const { getMessages, downloadFile } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/download', downloadFile); // Place before /:userId
router.get('/:userId', protect, getMessages);

module.exports = router;
