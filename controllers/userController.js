const User = require('../models/userModel');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

const filterObj = (target, ...allowedFields) => {
  const obj = {};
  Object.keys(target).forEach((key) => {
    if (allowedFields.includes(key)) obj[key] = target[key];
  });
  return obj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) 패스워드 수정하러 들어온 사람 쫒아냄
  if (req.body.password || req.body.passwordConfirm) return next(AppError);

  // 2) 유저를 찾음 & 업데이트
  const filteredObj = filterObj(req.body, 'name', 'role');

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { ...filteredObj },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });

  //
});

exports.getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'router is not defined yet',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'router is not defined yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'router is not defined yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'router is not defined yet',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'router is not defined yet',
  });
};
