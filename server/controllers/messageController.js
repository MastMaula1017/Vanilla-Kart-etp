const Message = require('../models/Message');

// @desc    Get chat history between two users
// @route   GET /api/messages/:userId
// @access  Private
const https = require('https');

// @desc    Get chat history between two users
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Proxy download for files
// @route   GET /api/messages/download
// @access  Public (or Protected)
const downloadFile = (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  // Extract filename
  const filename = url.split('/').pop().split('?')[0] || 'download';

  // Set headers for download
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Stream file
  https.get(url, (stream) => {
    stream.pipe(res);
  }).on('error', (err) => {
    console.error('Download error:', err);
    res.status(500).send('Error downloading file');
  });
};

module.exports = { getMessages, downloadFile };
