const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'nutriheal_fallback_secret_key'
    );

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists',
      });
    }

    return next();
  } catch (error) {
    console.error('[Auth Middleware] Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed or expired',
    });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Admin access required',
  });
};

module.exports = {
  authenticateUser,
  authorizeAdmin,
};
