const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    fromBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    toBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    quantity: { type: Number, required: true, min: 1 },
    transferDate: { type: Date, required: true },
    initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transfer', TransferSchema);