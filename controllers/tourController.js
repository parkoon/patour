const Tour = require('../models/tourModel');
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

exports.getTours = async (req, res) => {
  const queryObj = req.query;
  const excludedFields = ['pages', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);
  try {
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // 쿼리가 객체로 들어오니, 위 방식보다 아래 방식이 더 효율적!
    const tours = await Tour.find(req.query);
    res.json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      error: err,
    });
  }
};
exports.getTour = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findById(id);
    res.json({
      status: 'success',
      request_at: req.requestTime,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      error: err,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      error: err,
    });
  }
};
exports.udpateTour = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      error: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      error: err,
    });
  }
};
