const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};
