const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');

    if (isImage || isVideo) {
      return {
        folder: 'chat_media',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'mp4', 'webm'],
      };
    } else {
      const extMap = {
          'application/pdf': 'pdf',
          'application/msword': 'doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
          'application/vnd.ms-powerpoint': 'ppt',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
          'application/vnd.ms-excel': 'xls',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
          'text/plain': 'txt',
          'application/zip': 'zip',
          'application/x-zip-compressed': 'zip'
      };
      
      const ext = extMap[file.mimetype] || file.originalname.split('.').pop() || 'bin';
      
      return {
        folder: 'chat_media',
        resource_type: 'raw',
        public_id: `${file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${ext}`,
      };
    }
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
