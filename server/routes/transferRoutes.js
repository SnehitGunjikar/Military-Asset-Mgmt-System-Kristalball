const express = require('express');
const auth = require('../middleware/authMiddleware');
const requireRoles = require('../middleware/roleMiddleware');
const Transfer = require('../models/Transfer');

const router = express.Router();
const Base = require('../models/Base');
const Asset = require('../models/Asset');

async function ensureBaseByName(name) {
  if (!name) return null;
  let base = await Base.findOne({ name });
  if (!base) base = await Base.create({ name, location: 'Unknown' });
  return base;
}

async function ensureAssetByName(name, base) {
  if (!name) return null;
  let asset = await Asset.findOne({ name, ...(base ? { base: base._id } : {}) });
  if (!asset) asset = await Asset.create({ name, type: 'Other', base: base?._id, quantity: 0 });
  return asset;
}

router.get('/', auth, async (req, res) => {
  try {
    const { baseId, startDate, endDate } = req.query;
    const filter = {};
    if (startDate || endDate) {
      filter.transferDate = {};
      if (startDate) filter.transferDate.$gte = new Date(startDate);
      if (endDate) filter.transferDate.$lte = new Date(endDate);
    }
    const transfers = await Transfer.find(filter)
      .populate('asset fromBase toBase initiatedBy')
      .sort('-transferDate');
    const result = baseId
      ? transfers.filter(t => String(t.fromBase?._id) === baseId || String(t.toBase?._id) === baseId)
      : transfers;
    const flat = result.map(t => ({
      id: t._id,
      asset: t.asset?.name || String(t.asset),
      fromBase: t.fromBase?.name || String(t.fromBase),
      toBase: t.toBase?.name || String(t.toBase),
      quantity: t.quantity,
      transferDate: t.transferDate,
      initiatedBy: t.initiatedBy?.name || String(t.initiatedBy),
    }));
    res.json(flat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, requireRoles(['Admin', 'LogisticsOfficer']), async (req, res) => {
  try {
    const { fromBase: fromName, toBase: toName, asset: assetName, quantity, transferDate, notes } = req.body;
    const fromBase = await ensureBaseByName(fromName);
    const toBase = await ensureBaseByName(toName);
    const asset = await ensureAssetByName(assetName, fromBase);
    const transfer = await Transfer.create({
      asset: asset?._id,
      fromBase: fromBase?._id,
      toBase: toBase?._id,
      quantity,
      transferDate,
      initiatedBy: req.user.id,
      notes,
    });
    res.status(201).json({
      id: transfer._id,
      asset: asset?.name || assetName,
      fromBase: fromBase?.name || fromName,
      toBase: toBase?.name || toName,
      quantity: transfer.quantity,
      transferDate: transfer.transferDate,
      initiatedBy: req.user?.name || req.user?.email,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, requireRoles(['Admin', 'LogisticsOfficer']), async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!transfer) return res.status(404).json({ message: 'Not found' });
    res.json(transfer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, requireRoles(['Admin']), async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(req.params.id);
    if (!transfer) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;