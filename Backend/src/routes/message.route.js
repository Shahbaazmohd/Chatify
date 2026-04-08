const express = require('express');
const router = express.Router();

const Message = require('../models/message.model');
const auth = require('../middleware/auth');

// GET all messages
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().populate('user', 'username').sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new message
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message text is required' });

    const message = await Message.create({ user: req.user._id, text });
    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
