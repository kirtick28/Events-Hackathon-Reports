const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned staff
  status: {
    type: String,
    enum: ['pending', 'approved', 'registered', 'verified'],
    default: 'pending'
  },
  proofs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }], // Reference to File model
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Team', teamSchema);
