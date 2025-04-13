const mongoose = require('mongoose');

const pastParticipationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventName: { type: String, required: true }, // Since event may not exist in DB
  type: { type: String, enum: ['hackathon', 'workshop', 'internship'] },
  date: { type: Date },
  proofs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }], // Reference to File model
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Staff advisor
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('PastParticipation', pastParticipationSchema);
