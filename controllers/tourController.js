const Tour = require('../models/tourModel');
const APIFeatures = require('../helpers/apiFeatures');
const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
// const fs = require('fs');
// const path = require('path');

// const tours = JSON.parse(
//   fs.readFileSync(
//     path.join(__dirname, '../dev-data/data/tours-simple.json'),
//     'utf-8'
//   )
// );

// exports.checkId = (req, res, next, val) => {
//   const tour = tours.find((t) => t.id === val * 1);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'failure',
//       error: 'tour not found',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   const required = ['name', 'price'];
//   required.forEach((field) => {
//     if (!req.body[field]) {
//       console.log(req.body[field]);
//       return res
//         .status(400)
//         .json({ status: 'failure', message: 'Missing name or price' });
//     }
//   });

//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.fields = 'name,price,ratingsAverage';
  req.query.sort = 'price,-ratingsAverage';

  next();
};

exports.getTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginante();
  const tours = await features.query;

  res.json({
    status: 'success',
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findById(id).populate('reviews');

  if (!tour)
    return next(new AppError(`Tour not found with that id (${id})`, 404));

  res.json({
    status: 'success',
    request_at: req.requestTime,
    data: {
      tour,
    },
  });
});
exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});
exports.udpateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour)
    return next(new AppError(`Tour not found with that id (${id})`, 404));

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour)
    return next(new AppError(`Tour not found with that id (${id})`, 404));

  res.status(204).json({
    status: 'success',
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    {
      $match: {
        _id: { $ne: 'easy' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
