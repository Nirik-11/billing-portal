const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

const router = express.Router();

// GET /api/users - admin only: list all users
router.get('/', auth, allowRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load users', error: err.message });
  }
});

// PATCH /api/users/:id/role - admin only: change a user's role
router.patch('/:id/role', auth, allowRoles('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'manager', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role', error: err.message });
  }
});

module.exports = router;
