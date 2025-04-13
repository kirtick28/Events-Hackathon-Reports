// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  storageName: { type: String, required: true }, // Unique S3 key
  bucket: { type: String, required: true },
  url: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
