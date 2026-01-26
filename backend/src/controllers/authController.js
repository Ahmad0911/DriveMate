const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { uploadToCloudinary } = require('../utils/cloudinary');
const mongoose = require('mongoose');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isHost: user.isHost,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Sanitize user object (remove sensitive data)
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  const { password, __v, ...sanitizedUser } = userObj;
  return sanitizedUser;
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password);
};

// POST /api/auth/signup
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Please provide all required fields: email, password, firstName, lastName' 
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters and contain uppercase, lowercase, and numbers' 
      });
    }

    // Validate phone format (if provided)
    if (phone && !/^\+?[\d\s-()]{10,}$/.test(phone)) {
      return res.status(400).json({ error: 'Please provide a valid phone number' });
    }

    // Check if user exists (case-insensitive)
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('email');

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim()
    });

    // Generate token
    const token = generateToken(user);

    // Return sanitized user data
    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user and explicitly select password (if it's excluded by default in schema)
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+password');

    // Use consistent timing to prevent email enumeration attacks
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user account is active
    if (user.isBlocked) {
      return res.status(403).json({ error: 'Account has been suspended. Please contact support.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Return sanitized user data
    res.json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// GET /api/auth/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('favorites', 'make model year dailyPrice images');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;
    const updateData = {};

    // Validate and add fields to update
    if (firstName) {
      if (firstName.trim().length < 2) {
        return res.status(400).json({ error: 'First name must be at least 2 characters' });
      }
      updateData.firstName = firstName.trim();
    }

    if (lastName) {
      if (lastName.trim().length < 2) {
        return res.status(400).json({ error: 'Last name must be at least 2 characters' });
      }
      updateData.lastName = lastName.trim();
    }

    if (phone) {
      if (!/^\+?[\d\s-()]{10,}$/.test(phone)) {
        return res.status(400).json({ error: 'Please provide a valid phone number' });
      }
      updateData.phone = phone.trim();
    }

    if (bio !== undefined) {
      if (bio.length > 500) {
        return res.status(400).json({ error: 'Bio must be less than 500 characters' });
      }
      updateData.bio = bio.trim();
    }

    // Handle avatar upload
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path, 'avatars');
        updateData.avatar = result.secure_url;
        updateData.avatarPublicId = result.public_id;
      } catch (uploadError) {
        console.error('Avatar upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload avatar' });
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// POST /api/auth/become-host
exports.becomeHost = async (req, res) => {
  try {
    const { driverLicense, licenseNumber } = req.body;

    // Validate required fields
    if (!driverLicense || !licenseNumber) {
      return res.status(400).json({ 
        error: 'Please provide driver license information and license number' 
      });
    }

    // Check if user is already a host
    const existingUser = await User.findById(req.user.id);
    if (existingUser.isHost) {
      return res.status(400).json({ error: 'You are already registered as a host' });
    }

    // Update user to host
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        driverLicense: driverLicense.trim(),
        licenseNumber: licenseNumber.trim(),
        licenseVerified: false,
        isHost: true,
        hostAppliedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Host application submitted successfully. Your license will be verified within 24-48 hours.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Become host error:', error);
    res.status(500).json({ error: 'Failed to submit host application' });
  }
};

// POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Please provide current password and new password' 
      });
    }

    // Validate new password strength
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ 
        error: 'New password must be at least 8 characters and contain uppercase, lowercase, and numbers' 
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};