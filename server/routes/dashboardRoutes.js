const express = require('express');
const auth = require('../middleware/authMiddleware');
const Asset = require('../models/Asset');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');
const Expenditure = require('../models/Expenditure');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { baseId, base, type, equipmentType, startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date('1970-01-01');
    const end = endDate ? new Date(endDate) : new Date();
    let resolvedBaseId = baseId;
    if (!resolvedBaseId && base) {
      const baseDoc = await require('../models/Base').findOne({ name: base });
      resolvedBaseId = baseDoc?._id?.toString();
    }
    const baseFilter = resolvedBaseId ? { base: new mongoose.Types.ObjectId(resolvedBaseId) } : {};
    const typeOrName = equipmentType || type;
    const nameFilter = typeOrName ? { name: typeOrName } : {};
    const assets = await Asset.find({ ...baseFilter, ...nameFilter });
    const assetIds = assets.map(a => a._id);

    const idFilter = assetIds.length ? { asset: { $in: assetIds } } : {};

    const sumAgg = async (Model, dateField, beforeOrEnd) => {
      const dateMatch = beforeOrEnd === 'before' ? { $lt: start } : { $lte: end };
      return Model.aggregate([
        { $match: { ...idFilter, ...(baseId ? baseFilter : {}), ...(dateField ? { [dateField]: dateMatch } : {}) } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]);
    };

    const sum = g => (g[0]?.total || 0);

    const startingTotal = assets.reduce((acc, a) => acc + (a.quantity || 0), 0);

    const [pBefore, tiBefore, toBefore, asBefore, exBefore] = await Promise.all([
      sumAgg(Purchase, 'purchaseDate', 'before'),
      sumAgg(Transfer, 'transferDate', 'before'), // we'll split in/out by base below
      sumAgg(Transfer, 'transferDate', 'before'),
      sumAgg(Assignment, 'assignmentDate', 'before'),
      sumAgg(Expenditure, 'dateExpended', 'before'),
    ]);

    // Transfers need separation; recompute precise in/out
    const [transfersInBefore, transfersOutBefore] = await Promise.all([
      Transfer.aggregate([
        { $match: { ...idFilter, ...(resolvedBaseId ? { toBase: new mongoose.Types.ObjectId(resolvedBaseId) } : {}), transferDate: { $lt: start } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Transfer.aggregate([
        { $match: { ...idFilter, ...(resolvedBaseId ? { fromBase: new mongoose.Types.ObjectId(resolvedBaseId) } : {}), transferDate: { $lt: start } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
    ]);

    const openingBalance = startingTotal + sum(pBefore) + (transfersInBefore[0]?.total || 0) - (transfersOutBefore[0]?.total || 0) - sum(asBefore) - sum(exBefore);

    const [pEnd, asEnd, exEnd, transfersInEnd, transfersOutEnd] = await Promise.all([
      sumAgg(Purchase, 'purchaseDate', 'end'),
      sumAgg(Assignment, 'assignmentDate', 'end'),
      sumAgg(Expenditure, 'dateExpended', 'end'),
      Transfer.aggregate([
        { $match: { ...idFilter, ...(resolvedBaseId ? { toBase: new mongoose.Types.ObjectId(resolvedBaseId) } : {}), transferDate: { $lte: end } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Transfer.aggregate([
        { $match: { ...idFilter, ...(resolvedBaseId ? { fromBase: new mongoose.Types.ObjectId(resolvedBaseId) } : {}), transferDate: { $lte: end } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
    ]);

    const closingBalance = startingTotal + sum(pEnd) + (transfersInEnd[0]?.total || 0) - (transfersOutEnd[0]?.total || 0) - sum(asEnd) - sum(exEnd);
    const netMovement = closingBalance - openingBalance;

    // Assigned and expended in range
    const [assignedInRange, expendedInRange] = await Promise.all([
      Assignment.aggregate([
        { $match: { ...idFilter, ...(baseId ? baseFilter : {}), assignmentDate: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Expenditure.aggregate([
        { $match: { ...idFilter, ...(baseId ? baseFilter : {}), dateExpended: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
    ]);

    res.json({
      openingBalance,
      closingBalance,
      netMovement,
      assignedAssets: assignedInRange[0]?.total || 0,
      expendedAssets: expendedInRange[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;