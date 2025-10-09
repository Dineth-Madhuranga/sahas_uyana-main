const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [{ username }, { email: username }],
      isActive: true
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({ message: 'Account is temporarily locked due to too many failed login attempts' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await admin.incLoginAttempts();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        username: admin.username, 
        role: admin.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        fullName: admin.fullName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Get admin profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin profile', error: error.message });
  }
});

// Update admin profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, firstName, lastName, phone } = req.body;
    
    // Check if username is being changed and if it already exists
    if (username && username !== req.user.username) {
      const existingAdmin = await Admin.findOne({ 
        username: username.toLowerCase(),
        _id: { $ne: req.user.id }
      });
      
      if (existingAdmin) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    
    const updateData = {
      'profile.firstName': firstName,
      'profile.lastName': lastName,
      'profile.phone': phone
    };
    
    // Add username to update if provided
    if (username) {
      updateData.username = username.toLowerCase();
    }
    
    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin profile', error: error.message });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

// Get all admins (admin and above)
router.get('/admins', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const admins = await Admin.find({}).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
});

// Create new admin (admin and above)
router.post('/admins', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const {
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      phone
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Username, email, password, first name, and last name are required' });
    }

    // Regular admins can only create 'admin' or 'moderator' roles
    let assignedRole = role || 'admin';
    if (req.user.role !== 'super_admin' && assignedRole === 'super_admin') {
      assignedRole = 'admin';
    }

    const admin = new Admin({
      username,
      email,
      password,
      role: assignedRole,
      profile: {
        firstName,
        lastName,
        phone
      }
    });

    const savedAdmin = await admin.save();
    res.status(201).json({
      id: savedAdmin._id,
      username: savedAdmin.username,
      email: savedAdmin.email,
      role: savedAdmin.role,
      fullName: savedAdmin.fullName,
      profile: savedAdmin.profile,
      isActive: savedAdmin.isActive,
      createdAt: savedAdmin.createdAt
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(400).json({ message: 'Error creating admin', error: error.message });
  }
});

// Delete admin (admin and above, cannot delete self)
router.delete('/admins/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const adminId = req.params.id;
    
    // Cannot delete self
    if (adminId === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const adminToDelete = await Admin.findById(adminId);
    if (!adminToDelete) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Regular admins cannot delete super_admins
    if (req.user.role !== 'super_admin' && adminToDelete.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete super admin accounts' });
    }

    await Admin.findByIdAndDelete(adminId);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user 
  });
});

// Create initial admin (for testing - remove in production)
router.post('/create-initial-admin', async (req, res) => {
  try {
    // Check if any admin exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin accounts already exist' });
    }

    // Create initial admin
    const admin = new Admin({
      username: 'admin',
      email: 'admin@sahasuyana.com',
      password: 'admin123',
      role: 'super_admin',
      profile: {
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+94123456789'
      }
    });

    const savedAdmin = await admin.save();
    res.status(201).json({
      message: 'Initial admin created successfully',
      admin: {
        id: savedAdmin._id,
        username: savedAdmin.username,
        email: savedAdmin.email,
        role: savedAdmin.role,
        fullName: savedAdmin.fullName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating initial admin', error: error.message });
  }
});

module.exports = router;
