const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token and checks if it matches the token stored in the database
 * Ensures single-device session management
 */
const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired. Please login again.' });
      }
      return res.status(401).json({ error: 'Invalid token.' });
    }

    // Find user and verify token matches
    const user = await User.findById(decoded._id);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    // Check if token matches the one in database (single-device validation)
    if (user.token !== token) {
      return res.status(401).json({ error: 'Session invalid or expired. Please login again.' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ error: 'Authentication error.' });
  }
};

module.exports = auth;