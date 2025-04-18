const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.message === 'Invalid file type') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
