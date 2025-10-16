const mongoose = require('mongoose');

const assetTypes = ['Weapon', 'Vehicle', 'Equipment', 'Ammunition', 'Medical', 'Other'];

const AssetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: assetTypes, required: true },
    base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Asset', AssetSchema);