const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // 2) Check if user exist && password is correct
  // password를 모델 생성할 때 감췄으므로, 필요할 때 select를 추가로 해줘야한다.
  const user = await User.findOne({ email }).select('+password');
  const isCorrect = await user.correctPassword(password);

  if (!user || !isCorrect)
    return next(new AppError('Incorrect email or password', 401));

  // 3) If everyting ok, send otken to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
