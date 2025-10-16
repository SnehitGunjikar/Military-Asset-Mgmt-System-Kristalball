const express = require('express');
const auth = require('../middleware/authMiddleware');
const requireRoles = require('../middleware/roleMiddleware');
const Base = require('../models/Base');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const bases = await Base.find().sort('name');
    res.json(bases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const base = await Base.findById(req.params.id);
    if (!base) return res.status(404).json({ message: 'Not found' });
    res.json(base);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, requireRoles(['Admin']), async (req, res) => {
  try {
    const base = await Base.create(req.body);
    res.status(201).json(base);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, requireRoles(['Admin']), async (req, res) => {
  try {
    const base = await Base.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!base) return res.status(404).json({ message: 'Not found' });
    res.json(base);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, requireRoles(['Admin']), async (req, res) => {
  try {
    const base = await Base.findByIdAndDelete(req.params.id);
    if (!base) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;