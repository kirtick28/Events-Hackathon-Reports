const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "CSE"
  description: { type: String }, // optional human‑readable
  category: {
    type: String,
    enum: ['student', 'non-student'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Department', departmentSchema);
