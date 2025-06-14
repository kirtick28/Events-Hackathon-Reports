const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: function () {
        return this.status !== 'draft';
      },
      trim: true
    },
    type: {
      type: String,
      enum: [
        'hackathon',
        'workshop',
        'internship',
        'seminar',
        'webinar',
        'competition',
        'conference',
        'other'
      ],
      required: function () {
        return this.status !== 'draft';
      }
    },
    customType: {
      type: String,
      trim: true,
      required: function () {
        return this.type === 'other' && this.status !== 'draft';
      }
    },
    scope: {
      type: String,
      enum: [
        'department',
        'college',
        'inter-college',
        'national',
        'international'
      ],
      required: function () {
        return this.status !== 'draft';
      }
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: function () {
        return this.scope === 'department' && this.status !== 'draft';
      }
    },
    requiresMentor: { type: Boolean, default: false },
    eligibility: {
      teamSize: {
        min: { type: Number, min: 1, default: 1 },
        max: { type: Number, min: 1, default: 1 }
      },
      departments: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Department', trim: true }
      ],
      years: [{ type: Number, min: 1, max: 5 }],
      description: { type: String, trim: true }
    },
    externalLink: { type: String, trim: true },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      required: function () {
        return this.status !== 'draft';
      },
      trim: true
    },
    detailedDescription: { type: String, trim: true },
    images: [{ type: String }],
    startDate: {
      type: Date,
      required: function () {
        return this.status !== 'draft';
      }
    },
    endDate: {
      type: Date,
      required: function () {
        return this.status !== 'draft';
      },
      validate: {
        validator: function (value) {
          // Only validate if not draft and both dates exist
          if (this.status === 'draft' || !this.startDate || !value) return true;
          return value > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    registrationDeadline: { type: Date },
    location: {
      type: String,
      required: function () {
        return !this.isOnline && this.status !== 'draft';
      },
      trim: true
    },
    isOnline: { type: Boolean, default: false },
    onlineLink: {
      type: String,
      required: function () {
        return this.isOnline && this.status !== 'draft';
      },
      trim: true
    },
    rounds: [
      {
        title: {
          type: String,
          required: function () {
            return this.parent().status !== 'draft';
          },
          trim: true
        },
        description: {
          type: String,
          required: function () {
            return this.parent().status !== 'draft';
          },
          trim: true
        },
        startDate: {
          type: Date,
          required: function () {
            return this.parent().status !== 'draft';
          }
        },
        endDate: {
          type: Date,
          required: function () {
            return this.parent().status !== 'draft';
          }
        }
      }
    ],
    rules: [{ type: String, trim: true }],
    prizes: [
      {
        position: {
          type: String,
          required: function () {
            return this.parent().status !== 'draft';
          },
          trim: true
        },
        reward: {
          type: String,
          required: function () {
            return this.parent().status !== 'draft';
          },
          trim: true
        },
        description: { type: String, trim: true }
      }
    ],
    contacts: [
      {
        name: {
          type: String,
          required: function () {
            return this.parent().status !== 'draft';
          },
          trim: true
        },
        email: {
          type: String,
          required: function () {
            return this.parent().status !== 'draft';
          },
          trim: true,
          match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
          ]
        },
        phone: {
          type: String,
          trim: true,
          match: [/^[0-9]{10}$/, 'Please fill a valid phone number']
        },
        role: { type: String, trim: true }
      }
    ],
    attachments: [
      {
        name: {
          type: String,
          required: function () {
            return this.parent().status !== 'draft';
          },
          trim: true
        },
        url: {
          type: String,
          required: function () {
            return this.parent().status !== 'draft';
          },
          trim: true
        }
      }
    ],
    tags: [{ type: String, trim: true }],
    registrationCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    maxParticipants: { type: Number, min: 1 }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add virtual property for event status
eventSchema.virtual('eventStatus').get(function () {
  const now = new Date();
  if (now < this.startDate) return 'upcoming';
  if (now <= this.endDate) return 'ongoing';
  return 'completed';
});

// Add virtual property for registration status
eventSchema.virtual('isRegistrationOpen').get(function () {
  if (this.registrationStatus === 'closed') return false;
  const now = new Date();
  return now <= (this.registrationDeadline || this.startDate);
});

eventSchema.virtual('registrationStatus').get(function () {
  const now = new Date();
  const deadline = this.registrationDeadline || this.startDate;
  return now <= deadline ? 'open' : 'closed';
});

eventSchema.virtual('isPast').get(function () {
  return this.endDate < new Date();
});

eventSchema.virtual('isUpcoming').get(function () {
  return this.startDate > new Date();
});

eventSchema.virtual('isOngoing').get(function () {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

module.exports = mongoose.model('Event', eventSchema);
