const express = require('express');
const router = express.Router();
const upload = require('../config/s3Config');
const File = require('../models/File');
const { authenticate } = require('../middlewares/authMiddleware');

// Upload file to S3
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newFile = new File({
      originalName: req.file.originalname,
      storageName: req.file.key,
      bucket: req.file.bucket,
      url: req.file.location,
      uploadedBy: req.user._id
    });

    await newFile.save();
    res.json(newFile);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
