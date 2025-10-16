const express = require('express');
const auth = require('../middleware/authMiddleware');
const requireRoles = require('../middleware/roleMiddleware');
const Asset = require('../models/Asset');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { baseId, type } = req.query;
    const filter = {};
    if (baseId) filter.base = baseId;
    if (type) filter.type = type;
    const assets = await Asset.find(filter).populate('base').sort('name');
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('base');
    if (!asset) return res.status(404).json({ message: 'Not found' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, requireRoles(['Admin', 'LogisticsOfficer']), async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, requireRoles(['Admin', 'LogisticsOfficer']), async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!asset) return res.status(404).json({ message: 'Not found' });
    res.json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, requireRoles(['Admin']), async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;