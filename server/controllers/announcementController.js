const Announcement = require('../models/Announcement');

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private (Admin/Moderator)
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, type, targetAudience } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      type,
      targetAudience,
      createdBy: req.user._id
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all announcements (for Admin Dashboard)
// @route   GET /api/announcements/admin
// @access  Private (Admin/Moderator)
const getAdminAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active announcements for current user
// @route   GET /api/announcements
// @access  Public (or Protected)
const getAnnouncements = async (req, res) => {
  try {
    let filter = { isActive: true };

    // If user is logged in, filter by role
    if (req.user) {
        // Logged in: show 'all' + their role specific
        const roleFilter = [];
        roleFilter.push('all');
        if (req.user.roles.includes('expert')) roleFilter.push('expert');
        if (req.user.roles.includes('customer')) roleFilter.push('customer');
        
        // Admin sees all?
        if (req.user.roles.includes('admin')) {
             console.log('User is admin, fetching all announcements');
             // Don't restrict targetAudience for admin? 
             // Or keep it restricted to what they "should" see as a user?
             // Usually Admin wants to see what Users see + Admin announcements if any.
             // But if specific announcement is for "expert", does Admin see it?
             // If I do NOT filter, they see everything.
             // Let's NOT filter for admin to be safe for now.
             // filter.targetAudience = ... // Skip this
        } else {
             filter.targetAudience = { $in: roleFilter };
        }
    } else {
        // Public/Guest: only show 'all'
        filter.targetAudience = 'all';
    }
    
    // Limit to last 10 announcements to prevent bloat
    const announcements = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .limit(10);
      
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin/Moderator)
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
      await announcement.deleteOne();
      res.json({ message: 'Announcement removed' });
    } else {
      res.status(404).json({ message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getAdminAnnouncements,
  getAnnouncements,
  deleteAnnouncement
};
