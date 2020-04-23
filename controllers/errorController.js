const AppError = require('../helpers/appError');

const errorResDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      err: err,
      stack: err.stack,
      status: err.statusCode,
      message: err.message
    });
  }
  // RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: err.message
  });
};

const errorResProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operation 에러 일 경우
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message
      });

      // Programming 에러 일 경우
    }
    // 1) 로깅
    console.error('ERROR !!', err);

    // 2) 에러 메세지 전송
    return res.status(500).json({
      status: 'error',
      message: 'Someting went very wrong!'
    });
  }

  // RENDERED WEBSITE
  // Operation 에러 일 경우
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message
    });

    // Programming 에러 일 경우
  }

  // 1) 로깅
  console.error('ERROR !!', err);

  // RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: 'Please try again later'
  });
};

const handleDBCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDBDucplicatedFieldError = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicated field error, check your value ${value}`;
  return new AppError(message, 400);
};

const handleDBValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = err =>
  new AppError(`Invalid Token. Please log in again!`, 401);

const handleJWTExpiredError = () =>
  new AppError(`Your token has expired! Please log in again`, 401);

module.exports = (err, req, res, next) => {
  console.log(err.name, err.message);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err, message: err.message, name: err.name };

  // Mongo DB Error Exception
  // 1) ID Cast Error
  if (error.name === 'CastError') error = handleDBCastError(error);

  // 2) Duplicated Fields
  if (error.code === 110000) error = handleDBDucplicatedFieldError(error);

  // 3) Validation Error
  if (error.name === 'ValidationError') error = handleDBValidationError(error);

  // 4) JWT Invalid & Expired Token
  if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

  // PRODUCTION 과 DEVELOPMENT 에러응답 구분
  if (process.env.NODE_ENV === 'development') {
    errorResDev(err, req, res);
  } else {
    errorResProd(error, req, res);
  }
};
