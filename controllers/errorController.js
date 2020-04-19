module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(400).json({
    status: err.statusCode,
    message: err.message,
  });
};
