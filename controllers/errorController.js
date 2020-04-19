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

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // PRODUCTION 과 DEVELOPMENT 에러응답 구분
  if (process.env.NODE_ENV === 'development') {
    errorResDev(res, err);
  } else {
    errorResProd(res, err);
  }
};
