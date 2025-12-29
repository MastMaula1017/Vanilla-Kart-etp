const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Cloudinary storage handles format validation somewhat, but we keep this for safety
        // Note: Cloudinary storage params 'allowed_formats' also enforces this.
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});

module.exports = upload;
