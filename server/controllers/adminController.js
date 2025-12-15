const User = require('../models/User');
const Question = require('../models/Question');
// const Appointment = require('../models/Appointment'); // Assuming you have this or will have it

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ roles: 'customer' });
    const totalExperts = await User.countDocuments({ roles: 'expert' });
    const totalInquiries = await Question.countDocuments();
    const pendingInquiries = await Question.countDocuments({ status: 'pending' });
    
    // Once you have Appointment model
    // const totalAppointments = await Appointment.countDocuments();
    const totalAppointments = 0; // Placeholder

    res.json({
      users: totalUsers,
      experts: totalExperts,
      inquiries: totalInquiries,
      pendingInquiries,
      appointments: totalAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Users (Customers)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ roles: 'customer' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Experts
// @route   GET /api/admin/experts
// @access  Private/Admin
const getAllExperts = async (req, res) => {
  try {
    const experts = await User.find({ roles: 'expert' }).select('-password');
    res.json(experts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update User Roles (Promote/Demote)
// @route   PUT /api/admin/users/:id/roles
// @access  Private/Admin
const updateUserRoles = async (req, res) => {
  const { roles } = req.body; // Expect array of roles
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.roles = roles;
      const updatedUser = await user.save();
      res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          roles: updatedUser.roles
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};

// @desc    Delete User/Expert
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Inquiries
// @route   GET /api/admin/inquiries
// @access  Private/Admin
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Question.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Inquiry Status
// @route   PUT /api/admin/inquiries/:id
// @access  Private/Admin
const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Question.findById(req.params.id);

    if (inquiry) {
      inquiry.status = req.body.status || inquiry.status;
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to Inquiry (Send Email)
// @route   POST /api/admin/inquiries/:id/reply
// @access  Private/Admin
const replyToInquiry = async (req, res) => {
  const { reply } = req.body;
  
  try {
    const inquiry = await Question.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Update Inquiry in DB
    inquiry.adminReply = reply;
    inquiry.repliedAt = Date.now();
    inquiry.status = 'replied'; // or 'resolved'
    await inquiry.save();

    // Send Email via Resend
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      await resend.emails.send({
        from: 'ConsultPro <support@mail.vanshraturi.me>', // Verified domain
        to: inquiry.email,
        subject: `Re: ${inquiry.subject} - Response from ConsultPro`,
        html: `<p>Hello <strong>${inquiry.name}</strong>,</p><p>${reply}</p><br/><p>Best regards,<br/>ConsultPro Team</p>`
      });
      console.log(`Email sent to ${inquiry.email} via Resend`);
    } catch (emailError) {
      console.error("Resend email failed:", emailError);
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllExperts,
  deleteUser,
  getAllInquiries,
  updateInquiryStatus,
  replyToInquiry,
  updateUserRoles
};

