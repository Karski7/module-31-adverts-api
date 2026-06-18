const notFoundHandler = (req, res) => {
  res.status(404).send({ message: 'Not found' });
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).send({ message: 'File is too large. Max size is 1MB.' });
  }

  return res.status(error.status || 500).send({
    message: error.message || 'Server error',
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
