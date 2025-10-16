const express = require('express');
const auth = require('../middleware/authMiddleware');
const requireRoles = require('../middleware/roleMiddleware');
const Purchase = require('../models/Purchase');

const router = express.Router();

const Base = require('../models/Base');
const Asset = require('../models/Asset');
const mongoose = require('mongoose');

async function ensureBaseByName(name) {
  if (!name) return null;
  let base = await Base.findOne({ name });
  if (!base) base = await Base.create({ name, location: 'Unknown' });
  return base;
}

async function ensureAssetByName(name, base) {
  if (!name) return null;
  let asset = await Asset.findOne({ name, ...(base ? { base: base._id } : {}) });
  if (!asset) asset = await Asset.create({ name, type: 'Other', base: base?._id || new mongoose.Types.ObjectId(), quantity: 0 });
  return asset;
}

router.get('/', auth, async (req, res) => {
  try {
    const { baseId, startDate, endDate } = req.query;
    const filter = {};
    if (baseId) filter.base = baseId;
    if (startDate || endDate) {
      filter.purchaseDate = {};
      if (startDate) filter.purchaseDate.$gte = new Date(startDate);
      if (endDate) filter.purchaseDate.$lte = new Date(endDate);
    }
    const purchases = await Purchase.find(filter).populate('asset base addedBy').sort('-purchaseDate');
    const flat = purchases.map(p => ({
      id: p._id,
      asset: p.asset?.name || String(p.asset),
      base: p.base?.name || String(p.base),
      quantity: p.quantity,
      purchaseDate: p.purchaseDate,
      addedBy: p.addedBy?.name || String(p.addedBy),
    }));
    res.json(flat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, requireRoles(['Admin', 'LogisticsOfficer']), async (req, res) => {
  try {
    const { asset: assetName, base: baseName, quantity, purchaseDate, notes } = req.body;
    const base = await ensureBaseByName(baseName);
    const asset = await ensureAssetByName(assetName, base);
    const purchase = await Purchase.create({
      asset: asset?._id,
      base: base?._id,
      quantity,
      purchaseDate,
      addedBy: req.user.id,
      notes,
    });
    res.status(201).json({
      id: purchase._id,
      asset: asset?.name || assetName,
      base: base?.name || baseName,
      quantity: purchase.quantity,
      purchaseDate: purchase.purchaseDate,
      addedBy: req.user?.name || req.user?.email,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, requireRoles(['Admin', 'LogisticsOfficer']), async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!purchase) return res.status(404).json({ message: 'Not found' });
    res.json(purchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, requireRoles(['Admin']), async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;