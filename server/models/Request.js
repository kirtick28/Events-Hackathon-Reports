const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  type: { type: String, enum: ['hod-event', 'team-invite'], required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For team invites
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // For HOD requests
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // For HOD requests
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Request', requestSchema);
