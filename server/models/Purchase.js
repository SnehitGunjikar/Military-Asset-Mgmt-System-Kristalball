const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    quantity: { type: Number, required: true, min: 1 },
    purchaseDate: { type: Date, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', PurchaseSchema);