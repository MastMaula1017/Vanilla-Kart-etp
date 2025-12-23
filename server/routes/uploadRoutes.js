const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/chatUploadMiddleware');

// @route POST /api/upload
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the Cloudinary URL
  res.json({
    message: 'File uploaded successfully',
    fileUrl: req.file.path,
    fileType: req.file.mimetype
  });
});

module.exports = router;
