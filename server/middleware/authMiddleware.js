const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to authorize roles (e.g., 'expert', 'admin')
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user has at least one of the allowed roles
    if (!req.user.roles || !req.user.roles.some(role => allowedRoles.includes(role))) {
      return res.status(403).json({ message: `User roles [${req.user.roles ? req.user.roles.join(', ') : ''}] are not authorized` });
    }
    next();
  };
};

module.exports = { protect, authorize };
