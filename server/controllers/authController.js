const User = require('../models/User');
const Class = require('../models/Class');
const Department = require('../models/Department');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middlewares/authMiddleware');
const { sendResetEmail } = require('../utils/emailService');

// Helper: Generate JWT token
const generateToken = (user, remember) => {
  const expiresIn = remember ? '30d' : '1d'; // 30 days or 1 day
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

/**
 * @desc    Register superadmin
 * @route   POST /api/auth/register-superadmin
 * @access  Public
 */
exports.registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create superadmin user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'superadmin'
    });

    // Generate token
    const token = generateToken(newUser, false);

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Superadmin registration failed' });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Check if user is active
    if (user.isActive === false) {
      return res
        .status(403)
        .json({ error: 'Account is inactive. Please contact admin.' });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Generate token with remember logic
    const token = generateToken(user, remember);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: '1h' }
    );

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    await sendResetEmail(user.email, resetToken);

    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

/**
 * @desc    Update password
 * @route   POST /api/auth/update-password/:token
 * @access  Public
 */
exports.updatePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Password update failed' });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user);
    const user = await User.findById(req.user.id).select('-password');
    const responseData = { ...user._doc };
    if (req.user.role === 'staff' && user.class) {
      const classDetails = await Class.findById(user.class);
      responseData.classDepartment = classDetails.department;
    }
    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword, name, email } =
      req.body;

    if (currentPassword && newPassword) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect current password' });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New passwords do not match' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      return res.status(200).json({ message: 'Password updated successfully' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: 'Profile update failed',
      details: err.message
    });
  }
};
