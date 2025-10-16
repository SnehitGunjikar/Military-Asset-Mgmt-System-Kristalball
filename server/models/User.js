const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const roles = ['Admin', 'BaseCommander', 'LogisticsOfficer', 'Viewer'];

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /[^@\s]+@[^@\s]+\.[^@\s]+/,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: roles, default: 'Viewer' },
    base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);