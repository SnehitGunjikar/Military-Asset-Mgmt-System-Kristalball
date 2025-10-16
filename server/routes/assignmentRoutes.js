const express = require('express');
const auth = require('../middleware/authMiddleware');
const requireRoles = require('../middleware/roleMiddleware');
const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Expenditure = require('../models/Expenditure');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { baseId, startDate, endDate } = req.query;
    const filter = {};
    if (baseId) filter.base = baseId;
    if (startDate || endDate) {
      filter.assignmentDate = {};
      if (startDate) filter.assignmentDate.$gte = new Date(startDate);
      if (endDate) filter.assignmentDate.$lte = new Date(endDate);
    }
    const assignments = await Assignment.find(filter).populate('asset base createdBy').sort('-assignmentDate');
    const flat = assignments.map(a => ({
      id: a._id,
      asset: a.asset?.name || String(a.asset),
      quantity: a.quantity,
      assignedTo: a.assignedTo,
      assignmentDate: a.assignmentDate,
    }));
    res.json(flat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), async (req, res) => {
  try {
    const { asset: assetName, quantity, assignedTo, assignmentDate, notes } = req.body;
    // Derive base from asset if exists
    let asset = await Asset.findOne({ name: assetName });
    if (!asset) {
      asset = await Asset.create({ name: assetName, type: 'Other', quantity: 0 });
    }
    const assignment = await Assignment.create({
      asset: asset._id,
      base: asset.base,
      quantity,
      assignedTo,
      assignmentDate,
      createdBy: req.user.id,
      notes,
    });
    res.status(201).json({
      id: assignment._id,
      asset: asset.name,
      quantity: assignment.quantity,
      assignedTo: assignment.assignedTo,
      assignmentDate: assignment.assignmentDate,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, requireRoles(['Admin', 'BaseCommander']), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, requireRoles(['Admin']), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remaining balance endpoint
router.get('/remaining', auth, async (req, res) => {
  try {
    const { asset: assetName, base: baseName } = req.query;
    let asset;
    if (assetName) asset = await Asset.findOne({ name: assetName });
    if (!asset) return res.json({ remaining: null });

    let baseId = null;
    if (baseName) {
      const baseDoc = await require('../models/Base').findOne({ name: baseName });
      baseId = baseDoc?._id || null;
    }

    const baseObj = baseId ? new mongoose.Types.ObjectId(baseId) : null;
    const starting = baseObj && asset.base && String(asset.base) === String(baseId) ? asset.quantity : asset.quantity || 0;

    const [purchases, transfersIn, transfersOut, assignments, expenditures] = await Promise.all([
      Purchase.aggregate([
        { $match: { asset: asset._id, ...(baseObj ? { base: baseObj } : {}) } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Transfer.aggregate([
        { $match: { asset: asset._id, ...(baseObj ? { toBase: baseObj } : {}) } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Transfer.aggregate([
        { $match: { asset: asset._id, ...(baseObj ? { fromBase: baseObj } : {}) } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Assignment.aggregate([
        { $match: { asset: asset._id, ...(baseObj ? { base: baseObj } : {}) } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Expenditure.aggregate([
        { $match: { asset: asset._id, ...(baseObj ? { base: baseObj } : {}) } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
    ]);

    const sum = g => (g[0]?.total || 0);
    const remaining = starting + sum(purchases) + sum(transfersIn) - sum(transfersOut) - sum(assignments) - sum(expenditures);
    res.json({ remaining });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;