const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
    quantity: { type: Number, required: true, min: 1 },
    assignedTo: { type: String, required: true, trim: true },
    assignmentDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', AssignmentSchema);