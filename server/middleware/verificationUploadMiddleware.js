const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine format based on mimetype
    let resource_type = 'auto'; // Default to auto
    let folder = 'consultpro/verification';
    
    // Check if it's not an image (e.g. PDF)
    if (!file.mimetype.startsWith('image/')) {
        resource_type = 'raw'; 
        // For raw files (PDFs, Docs), Cloudinary often needs 'raw' resource type
        // However, 'auto' usually works if the file has an extension. 
        // Let's stick to 'auto' mostly, but explicit 'raw' for PDFs is safer if we want them downloadable easily.
        // Actually, for PDF viewability, 'image' or 'auto' is often fine. 
        // But for multer-storage-cloudinary, we need to be careful.
    }

    return {
      folder: folder,
      resource_type: 'auto', // Let Cloudinary decide (defaults to image for images, raw/video for others usually)
      // allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx'], // Optional: Restrict if needed
      public_id: `${file.originalname.split('.')[0]}_${Date.now()}`
    };
  },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
