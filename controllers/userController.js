const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');
const factory = require('./factory');

const filterObj = (target, ...allowedFields) => {
  const obj = {};
  Object.keys(target).forEach(key => {
    if (allowedFields.includes(key)) obj[key] = target[key];
  });
  return obj;
};

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

// Store file as a buffer in memory
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  req.file.filename = filename;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${filename}`);

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) 패스워드 수정하러 들어온 사람 쫒아냄
  if (req.body.password || req.body.passwordConfirm) return next(AppError);

  // 2) 유저를 찾음 & 업데이트
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });

  //
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1) 유저를 찾고
  // 2) 찾은 유저의 active 값을 false로 바꿔준다. active 이외의 필드는 제외한다.
  // const filteredObj = filterObj(req.body, 'active');
  // 그냥 지우는 행동 하나기 때문에, 별도로 값을 받지 않고, active를 false로 변경한다
  await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
