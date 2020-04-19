const AppError = require('../helpers/appError');

const errorResDev = (res, err) => {
  res.status(err.statusCode).json({
    err: err,
    stack: err.stack,
    status: err.statusCode,
    message: err.message,
  });
};

const errorResProd = (res, err) => {
  // Operation 에러 일 경우
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });

    // Programming 에러 일 경우
  } else {
    // 1) 로깅
    console.error('ERROR !!', err);

    // 2) 에러 메세지 전송
    res.status(500).json({
      status: 'error',
      message: 'Someting went very wrong!',
    });
  }
};

const handleDBCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDBDucplicatedFieldError = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicated field error, check your value ${value}`;
  return new AppError(message, 400);
};

const handleDBValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };

  // Mongo DB Error Exception
  // 1) ID Cast Error
  if (error.name === 'CastError') error = handleDBCastError(error);

  // 2) Duplicated Fields
  if (error.code === 110000) error = handleDBDucplicatedFieldError(error);

  // 3) Validation Error
  if (error.name === 'ValidationError') error = handleDBValidationError(error);

  // PRODUCTION 과 DEVELOPMENT 에러응답 구분
  if (process.env.NODE_ENV === 'development') {
    errorResDev(res, error);
  } else {
    errorResProd(res, error);
  }
};
