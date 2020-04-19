const express = require('express');
const morgan = require('morgan');
const path = require('path');

const AppError = require('./helpers/appError');
const globalErrorHander = require('./controllers/errorController');

const app = express();

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// 1) MIDDLEWARES
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHander);

module.exports = app;
