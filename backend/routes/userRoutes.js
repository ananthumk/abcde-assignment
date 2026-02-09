const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// ===== POST /api/users - Create a new user =====
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      token: null
    });

    // Save user first to get the ID
    await user.save();

    // Generate token for auto-login after registration (using actual user ID)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Save token to DB to "lock" the session
    user.token = token;
    await user.save();

    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Error creating user: ' + err.message });
  }
});

// ===== POST /api/users/login - Login with single-device check =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if user is already logged in on another device
    if (user.token) {
      return res.status(403).json({ error: 'You are already logged in on another device. Please logout first.' });
    }

    // Verify password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, 
      { expiresIn: '7d' });

    // Save token to DB to "lock" the session
    user.token = token;
    await user.save();

    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error during login: ' + err.message });
  }
});

// ===== POST /api/users/logout - Logout and clear token =====
router.post('/logout', auth, async (req, res) => {
  try {
    // Clear the token in the DB to allow future logins
    req.user.token = null;
    await req.user.save();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Error during logout' });
  }
});

module.exports = router;