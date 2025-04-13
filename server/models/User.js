const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['superadmin', 'principal', 'innovation', 'hod', 'staff', 'student'],
    required: true
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  year: { type: Number },
  isActive: { type: Boolean, default: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
