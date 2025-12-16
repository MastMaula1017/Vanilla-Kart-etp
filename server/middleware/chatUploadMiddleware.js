const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chat_media',
    resource_type: 'auto', // Important for video/raw files
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'mp4', 'webm', 'pdf', 'doc', 'docx'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
