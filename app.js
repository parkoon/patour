const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
