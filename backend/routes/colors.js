const express = require('express');
const { Color } = require('../models/models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public: anyone can browse the palette
router.get('/', async (req, res) => {
  const colors = await Color.find().sort({ category: 1, name: 1 });
  res.json(colors);
});

// Admin only: manage palette
router.post('/', auth(), adminOnly, async (req, res) => {
  const color = await Color.create(req.body);
  res.status(201).json(color);
});

router.put('/:id', auth(), adminOnly, async (req, res) => {
  const color = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(color);
});

router.delete('/:id', auth(), adminOnly, async (req, res) => {
  await Color.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
