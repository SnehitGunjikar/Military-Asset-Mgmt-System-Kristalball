const express = require('express');
const auth = require('../middleware/authMiddleware');
const requireRoles = require('../middleware/roleMiddleware');
const Expenditure = require('../models/Expenditure');

const router = express.Router();
const Asset = require('../models/Asset');
const Base = require('../models/Base');

router.get('/', auth, async (req, res) => {
  try {
    const { baseId, startDate, endDate } = req.query;
    const filter = {};
    if (baseId) filter.base = baseId;
    if (startDate || endDate) {
      filter.dateExpended = {};
      if (startDate) filter.dateExpended.$gte = new Date(startDate);
      if (endDate) filter.dateExpended.$lte = new Date(endDate);
    }
    const expenditures = await Expenditure.find(filter).populate('asset base createdBy').sort('-dateExpended');
    const flat = expenditures.map(e => ({
      id: e._id,
      asset: e.asset?.name || String(e.asset),
      quantity: e.quantity,
      reason: e.reason,
      date: e.dateExpended,
    }));
    res.json(flat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const { asset: assetName, quantity, reason, date, base: baseName, notes } = req.body;
    let asset = await Asset.findOne({ name: assetName });
    if (!asset) asset = await Asset.create({ name: assetName, type: 'Other', quantity: 0 });
    let base = null;
    if (baseName) {
      base = await Base.findOne({ name: baseName });
      if (!base) base = await Base.create({ name: baseName, location: 'Unknown' });
    }
    const exp = await Expenditure.create({
      asset: asset._id,
      base: base?._id,
      quantity,
      reason,
      dateExpended: date,
      createdBy: req.user.id,
      notes,
    });
    res.status(201).json({ id: exp._id, asset: asset.name, quantity, reason, date });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, requireRoles(['Admin', 'BaseCommander']), async (req, res) => {
  try {
    const exp = await Expenditure.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exp) return res.status(404).json({ message: 'Not found' });
    res.json(exp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, requireRoles(['Admin']), async (req, res) => {
  try {
    const exp = await Expenditure.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;