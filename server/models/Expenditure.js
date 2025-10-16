const mongoose = require('mongoose');

const ExpenditureSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, required: true },
    dateExpended: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expenditure', ExpenditureSchema);