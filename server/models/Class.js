const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "A", "B"
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  year: { type: Number, required: true }, // 1, 2, 3, 4
  advisors: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Class', classSchema);
