const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to last 20
    
    // Count unread
    const unreadCount = await Notification.countDocuments({ 
        recipient: req.user._id, 
        isRead: false 
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: 'All marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a notification (Internal/System use mainly)
// @route   POST /api/notifications
// @access  Private
const createNotification = async (req, res) => {
    try {
        const { recipient, message, type, link } = req.body;

        const notification = await Notification.create({
            recipient: recipient || req.user._id, // Default to self if not specified (e.g., self-trigger)
            message,
            type: type || 'system',
            link,
            sender: req.user._id
        });

        // Emit socket event if io is available (accessed via req.app.get)
        const io = req.app.get('io');
        if (io) {
            // Emit to specific user room if you have rooms set up, or just broadcast generic
            // For simplicity in this Setup:
            io.emit('notification', notification); 
        }

        res.status(201).json(notification);
    } catch (error) {
        console.error("Create Notif Error:", error);
        res.status(500).json({ message: 'Failed to create notification' });
    }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
};
