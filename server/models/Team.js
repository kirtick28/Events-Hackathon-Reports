const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending'
        },
        invitedAt: { type: Date, default: Date.now },
        respondedAt: { type: Date }
      }
    ],
    mentor: {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
      invitedAt: { type: Date },
      respondedAt: { type: Date }
    },
    status: {
      type: String,
      enum: ['forming', 'ready', 'registered', 'verified'],
      default: 'forming'
    },
    proofs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Virtual to check if team is ready for registration
teamSchema.virtual('isReadyForRegistration').get(function () {
  const allMembersAccepted = this.members.every(
    (member) => member.status === 'accepted'
  );
  const mentorReady = !this.mentor.user || this.mentor.status === 'accepted';
  return allMembersAccepted && mentorReady;
});

// Index to ensure one student can only be in one team per event
teamSchema.index({ 'members.user': 1, event: 1 });
teamSchema.index({ 'mentor.user': 1, event: 1 });

module.exports = mongoose.model('Team', teamSchema);
