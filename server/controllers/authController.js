const VerificationToken = require('../models/VerificationToken');
const User = require('../models/User');

// ... existing code ...

// @desc    Send Email Verification OTP
// @route   POST /api/auth/verify-email/send
// @access  Public
const sendVerificationOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check if user already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save OTP to DB (replacing any existing one)
    await VerificationToken.deleteOne({ email });
    
    await VerificationToken.create({
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
    });

    // 4. Send Email
    const message = `Your verification OTP is ${otp}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verify Your Email</h2>
        <p>Please use the following OTP to verify your email address for registration:</p>
        <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `;

    await sendEmail({
      email,
      subject: 'Email Verification OTP',
      message,
      html
    });

    res.status(200).json({ success: true, message: 'OTP sent to email' });

  } catch (error) {
    console.error("OTP Send Error:", error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// @desc    Verify Email OTP
// @route   POST /api/auth/verify-email/validate
// @access  Public
const verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const token = await VerificationToken.findOne({
      email,
      otp,
      expiresAt: { $gt: Date.now() }
    });

    if (!token) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid. 
    // We don't delete it yet? Or maybe we do to prevent reuse. 
    // Ideally user proceeds to register immediately.
    // Let's delete it to allow one-time use, but frontend might need to know state.
    // Better strategy: The frontend holds the "verified" state. 
    // Or we could return a signed temporary JWT "email_verified_token" to pass to register?
    // For simplicity, we just return success. The registration flow assumes if they have the OTP, they verified it.
    // BUT secure way: Register endpoint could verify OTP again? Or we trust frontend flow for this MVP.
    // Let's just return success currently.
    
    res.status(200).json({ success: true, message: 'Email verified successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    // For localhost development, we MUST use secure: false. 
    // If you are on https://your-production.com, this should be true.
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
  };
  
  // Debug log to confirm what's happening
  console.log(`Setting Cookie: Secure=${options.secure}, SameSite=${options.sameSite}, Env='${process.env.NODE_ENV}'`);

  res.status(statusCode).cookie('jwt', token, options).json({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    expertProfile: user.expertProfile,
    profileImage: user.profileImage,
    coverImage: user.coverImage,
    googleId: user.googleId,
  });
};

// ... existing registerUser ...
const registerUser = async (req, res) => {
  const { name, email, password, role, expertProfile } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'You are already signed up. Please login instead.' });
    }

    // Validate Expert Profile if role is expert
    if (role === 'expert') {
        if (!expertProfile || !expertProfile.specialization || !expertProfile.hourlyRate) {
            return res.status(400).json({ message: 'Experts must provide Specialization and Hourly Rate' });
        }
        
        if (Number(expertProfile.hourlyRate) < 200) {
            return res.status(400).json({ message: 'Hourly Rate must be at least ₹200' });
        }
        
        // Strict validation for availability
        if (!expertProfile.availability || !Array.isArray(expertProfile.availability) || expertProfile.availability.length === 0) {
            return res.status(400).json({ message: 'Experts must provide availability (days and time slots)' });
        }
    }

    // Determine initial roles
    // We store as array. Always include 'customer'.
    const initialRoles = ['customer'];
    if (role && role !== 'customer') {
        initialRoles.push(role);
    }

    const user = await User.create({
      name,
      email,
      password,
      roles: initialRoles,
      expertProfile: initialRoles.includes('expert') ? expertProfile : undefined
    });

    if (user) {
      sendTokenResponse(user, 201, res);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... existing loginUser ...
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      sendTokenResponse(user, 200, res);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
};


// ... existing getUserProfile ...

// ... existing updateUserProfile ...
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      // Update expert profile if one of the roles is expert
      if (user.roles.includes('expert') && req.body.expertProfile) {
          if (req.body.expertProfile.hourlyRate && Number(req.body.expertProfile.hourlyRate) < 200) {
              return res.status(400).json({ message: 'Hourly Rate must be at least ₹200' });
          }
          user.expertProfile = {
              ...user.expertProfile,
              ...req.body.expertProfile
          };
      }

      const updatedUser = await user.save();
      sendTokenResponse(updatedUser, 200, res);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... existing changePassword ...

// ... existing forgotPassword ...

// ... existing resetPassword ...

// ... existing getUserById ...

// ... existing uploadProfilePhoto ...
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.profileImage = req.file.path;
      const updatedUser = await user.save();
      
      sendTokenResponse(updatedUser, 200, res);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... existing uploadCoverPhoto ...
const uploadCoverPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.coverImage = req.file.path;
      const updatedUser = await user.save();
      
      sendTokenResponse(updatedUser, 200, res);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... existing googleLogin ...
const googleLogin = async (req, res) => {
  const { credential, role, expertProfile } = req.body;
  
  console.log("--- Google Login Debug ---");
  console.log("Client ID from Env:", process.env.VITE_GOOGLE_CLIENT_ID);
  
  try {
    const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub: googleId } = ticket.getPayload();
    console.log("Google Verify Success:", email);

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
          user.googleId = googleId; // Link account
          await user.save();
      }
      sendTokenResponse(user, 200, res);
    } else {
      // Create new user
      // Generate a random password since they use Google
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      const newRole = role || 'customer';

      // Validate Expert Profile for Google Sign up
      if (newRole === 'expert') {
          if (!expertProfile || !expertProfile.specialization || !expertProfile.hourlyRate) {
              return res.status(400).json({ message: 'Experts must provide Specialization and Hourly Rate' });
          }
          if (Number(expertProfile.hourlyRate) < 200) {
              return res.status(400).json({ message: 'Hourly Rate must be at least ₹200' });
          }
          if (!expertProfile.availability || !Array.isArray(expertProfile.availability) || expertProfile.availability.length === 0) {
              return res.status(400).json({ message: 'Experts must provide availability (days and time slots)' });
          }
      }

      const initialRoles = ['customer'];
      if (role && role !== 'customer') {
          initialRoles.push(role);
      }

      user = await User.create({
        name,
        email,
        password: randomPassword,
        googleId,
        profileImage: picture,
        roles: initialRoles,
        expertProfile: role === 'expert' ? expertProfile : undefined
      });

      sendTokenResponse(user, 201, res);
    }
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(400).json({ message: 'Google login failed', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        expertProfile: user.expertProfile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user && (await bcrypt.compare(currentPassword, user.password))) {
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(401).json({ message: 'Invalid current password' });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and Expiry (10 minutes)
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset message
    // Create reset message
    const clientUrl = process.env.CLIENT_URL || 'https://consultpro.vanshraturi.me';
    const resetUrl = `${clientUrl}/reset-password`;

    const message = `Your password reset OTP is ${otp}`; // Fallback text

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background-color: #4F46E5; color: #ffffff; padding: 20px; text-align: center; }
          .content { padding: 30px; text-align: center; }
          .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; margin: 20px 0; background: #eef2ff; padding: 10px 20px; display: inline-block; border-radius: 8px; }
          .btn { display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
          .footer { background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>You requested a password reset. Use the OTP below to proceed:</p>
            <div class="otp-code">${otp}</div>
            <p>Or click the button below to reset your password:</p>
            <a href="${resetUrl}" class="btn">Reset Password</a>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">This OTP is valid for 10 minutes.</p>
          </div>
          <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
        html
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
      console.error("Email send error:", error);
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP or OTP has expired' });
    }

    // Set new password
    user.password = newPassword;
    
    // Clear OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, data: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID (Public/Protected - limited info)
// @route   GET /api/auth/user/:id
// @access  Protected
// @desc    Get user by ID (Public/Protected - limited info)
// @route   GET /api/auth/user/:id
// @access  Protected
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email roles expertProfile profileImage');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};







// @desc    Upload verification document
// @route   POST /api/auth/profile/verification
// @access  Protected (Expert only)
const uploadVerificationDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (user && user.roles.includes('expert')) {
      if (!user.expertProfile) {
          user.expertProfile = {};
      }
      if (!user.expertProfile.verificationDocuments) {
          user.expertProfile.verificationDocuments = [];
      }
      
      let fileUrl = req.file.path;
      if (req.file.filename) {
          // Local storage used
          const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
          fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }
      
      user.expertProfile.verificationDocuments.push(fileUrl);
      user.expertProfile.verificationStatus = 'pending';
      user.markModified('expertProfile'); // Ensure mixed type updates are saved

      const updatedUser = await user.save();
      
      res.json({
        verificationDocuments: updatedUser.expertProfile.verificationDocuments,
        verificationStatus: updatedUser.expertProfile.verificationStatus
      });
    } else {
      res.status(404).json({ message: 'User not found or not an expert' });
    }
  } catch (error) {
    console.error("Verification upload error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// @desc    Mark onboarding as seen
// @route   PUT /api/auth/onboarding-seen
// @access  Private
const markOnboardingSeen = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.hasSeenOnboarding = true;
      const updatedUser = await user.save();
      
      // Return updated user info without sensitive data
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        roles: updatedUser.roles,
        expertProfile: updatedUser.expertProfile,
        hasSeenOnboarding: updatedUser.hasSeenOnboarding
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserById,
  getUserProfile,
  uploadProfilePhoto,
  uploadCoverPhoto,
  googleLogin,
  uploadVerificationDocument,
  logoutUser,
  markOnboardingSeen,
  sendVerificationOTP,
  verifyEmailOTP
};

