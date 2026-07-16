const express = require('express');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

const router = express.Router();

const PLANS = {
  Free: { price: 0 },
  Pro: { price: 999 },
  Enterprise: { price: 4999 },
};

// GET /api/billing/plans - public list of plans
router.get('/plans', (req, res) => {
  res.json(PLANS);
});

// GET /api/billing/me - current user's plan + invoices
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const invoices = await Invoice.find({ user: req.user.id }).sort({ issuedAt: -1 });
    res.json({ user, invoices });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load billing info', error: err.message });
  }
});

// POST /api/billing/upgrade - any authenticated user changes their own plan
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan' });

    const user = await User.findById(req.user.id);
    user.plan = plan;
    user.planStartedAt = new Date();
    await user.save();

    const invoice = await Invoice.create({
      user: user._id,
      plan,
      amount: PLANS[plan].price,
      status: 'paid', // mock payment — instantly marked paid
    });

    res.json({ user, invoice });
  } catch (err) {
    res.status(500).json({ message: 'Upgrade failed', error: err.message });
  }
});

// GET /api/billing/invoices - admin & manager: view all invoices
router.get('/invoices', auth, allowRoles('admin', 'manager'), async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('user', 'name email role').sort({ issuedAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load invoices', error: err.message });
  }
});

module.exports = router;
