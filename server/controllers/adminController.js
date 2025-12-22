const User = require('../models/User');
const Question = require('../models/Question');
const { Resend } = require('resend');
const Appointment = require('../models/Appointment'); 

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
    const totalAppointments = await Appointment.countDocuments();
    
    // Calculate Total Platform Earnings (Sum of platformFee)
    const earningsResult = await Appointment.aggregate([
        { $match: { 'payment.status': 'captured' } },
        { $group: { _id: null, total: { $sum: "$payment.platformFee" } } }
    ]);
    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].total : 0;

    res.json({
      users: totalUsers,
      experts: totalExperts,
      inquiries: totalInquiries,
      pendingInquiries,
      appointments: totalAppointments,
      totalEarnings // Platform earnings
    });  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Users (Everyone)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
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
  
  // RESTRICTION: Only Super Admin can assign 'admin' role
  if (roles.includes('admin') && req.user.email !== 'vansh14raturi@gmail.com') {
      return res.status(403).json({ message: 'Access Denied: Only the Super Admin can assign the Admin role.' });
  }

  // Check if requester is a moderator
  const isModerator = req.user.roles.includes('moderator') && !req.user.roles.includes('admin');

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // PROTCTION: Prevent modification of Super Admin
      if (user.email === 'vansh14raturi@gmail.com') {
          return res.status(403).json({ message: 'Super Admin Protected: Cannot modify this account.' });
      }

      if (isModerator) {
         // Moderators can ONLY assign 'inquiry_support' and 'customer' (default)
         // They cannot assign 'admin' or 'moderator'
         // They cannot Modify an Admin or Moderator
         
         const targetIsAdminOrMod = user.roles.includes('admin') || user.roles.includes('moderator');
         if (targetIsAdminOrMod) {
             return res.status(403).json({ message: 'Moderators cannot modify Admins or Moderators' });
         }

         const illegalRoles = roles.filter(r => r === 'admin' || r === 'moderator');
         if (illegalRoles.length > 0) {
             return res.status(403).json({ message: 'Moderators can only assign inquiry_support role' });
         }
      }

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
    // RESTRICTION: Only the Super Admin can delete users
    if (req.user.email !== 'vansh14raturi@gmail.com') {
      return res.status(403).json({ message: 'Access Denied: Only the Super Admin can delete users.' });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      // PROTCTION: Prevent deletion of Super Admin
      if (user.email === 'vansh14raturi@gmail.com') {
          return res.status(403).json({ message: 'Super Admin Protected: Cannot delete this account.' });
      }

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
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      const { data, error } = await resend.emails.send({
        from: 'ConsultPro <support@mail.vanshraturi.me>', // Verified domain
        to: inquiry.email,
        subject: `Re: ${inquiry.subject || 'Inquiry'} - Response from ConsultPro`,
        text: `Hello ${inquiry.name},\n\n${reply}\n\nBest regards,\nConsultPro Team`,
        html: `<p>Hello <strong>${inquiry.name}</strong>,</p><p>${reply}</p><br/><p>Best regards,<br/>ConsultPro Team</p>`
      });

      if (error) {
        console.error("Resend API Error:", error);
        return res.status(400).json({ message: 'Email sending failed', error });
      }

      console.log(`Email sent to ${inquiry.email} via Resend. ID: ${data?.id}`);
    } catch (emailError) {
      console.error("Resend execution failed:", emailError);
      return res.status(500).json({ message: 'Email execution failed', error: emailError.message });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get Monthly Activity Stats
// @route   GET /api/admin/stats/monthly
// @access  Private/Admin
const getMonthlyStats = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    
    const userStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      }
    ]);

    const appointmentStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      }
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const data = months.map((month, index) => {
      const userMonth = userStats.find(item => item._id === index + 1);
      const appointmentMonth = appointmentStats.find(item => item._id === index + 1);
      
      return {
        name: month,
        users: userMonth ? userMonth.count : 0,
        appointments: appointmentMonth ? appointmentMonth.count : 0
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending verification requests
// @route   GET /api/admin/verifications
// @access  Private/Admin
const getVerificationRequests = async (req, res) => {
  try {
    const experts = await User.find({ 
      roles: 'expert', 
      'expertProfile.verificationStatus': 'pending' 
    }).select('name email expertProfile');
    res.json(experts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update verification status
// @route   PUT /api/admin/verifications/:id
// @access  Private/Admin
const updateVerificationStatus = async (req, res) => {
  const { status, badges } = req.body; // status: 'verified' | 'rejected'
  
  try {
    const user = await User.findById(req.params.id);
    
    if (user && user.roles.includes('expert')) {
      if (user.expertProfile) {
          user.expertProfile.verificationStatus = status;
          
          if (status === 'verified') {
              // Add 'Verified' badge if not present
              if (!user.expertProfile.badges) {
                  user.expertProfile.badges = [];
              }
              if (!user.expertProfile.badges.includes('Verified')) {
                  user.expertProfile.badges.push('Verified');
              }
              
              // Add other badges if provided
               if (badges && Array.isArray(badges)) {
                  badges.forEach(badge => {
                      if (!user.expertProfile.badges.includes(badge)) {
                          user.expertProfile.badges.push(badge);
                      }
                  });
              }
          } else if (status === 'rejected') {
              // Remove 'Verified' badge
              if (user.expertProfile.badges) {
                  user.expertProfile.badges = user.expertProfile.badges.filter(b => b !== 'Verified');
              }
          }
          user.markModified('expertProfile');
      }
      
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Revoke expert role
// @route   PUT /api/admin/users/:id/revoke-expert
// @access  Private/Admin/Moderator
const revokeExpertRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Check permissions: Moderator cannot modify Admin/Moderator
      const isModerator = req.user.roles.includes('moderator') && !req.user.roles.includes('admin');
      const targetIsAdminOrMod = user.roles.includes('admin') || user.roles.includes('moderator');
      
      if (isModerator && targetIsAdminOrMod) {
          return res.status(403).json({ message: 'Moderators cannot modify Admins or Moderators' });
      }

      user.roles = user.roles.filter(role => role !== 'expert');
      
      // If user has no roles left, maybe default to customer?
      if (!user.roles.includes('customer')) {
          user.roles.push('customer');
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grant expert role
// @route   PUT /api/admin/users/:id/grant-expert
// @access  Private/Admin/Moderator
const grantExpertRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Check permissions: Moderator cannot modify Admin/Moderator
      const isModerator = req.user.roles.includes('moderator') && !req.user.roles.includes('admin');
      const targetIsAdminOrMod = user.roles.includes('admin') || user.roles.includes('moderator');
      
      if (isModerator && targetIsAdminOrMod) {
          return res.status(403).json({ message: 'Moderators cannot modify Admins or Moderators' });
      }

      if (!user.roles.includes('expert')) {
          user.roles.push('expert');
          
          // Initialize expert profile if missing
          if (!user.expertProfile) {
              user.expertProfile = {
                  specialization: 'General', // Default
                  hourlyRate: 0,
                  bio: 'New expert.',
                  verificationStatus: 'pending',
                  averageRating: 0,
                  totalReviews: 0
              };
          }
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
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
  updateUserRoles,
  getMonthlyStats,
  getVerificationRequests,
  updateVerificationStatus,
  revokeExpertRole,
  grantExpertRole
};
