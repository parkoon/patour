const Review = require('../models/reviewModel');
const catchAsync = require('../helpers/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  const results = reviews.length;

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
    results,
  });
});
exports.createReviews = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
