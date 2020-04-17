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
  try {
    console.log(req.query);

    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['pages', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    // 쿼리가 객체로 들어오니, 아래 방식보다 아래 방식이 더 효율적!

    // EXECUTE QUERY
    const tours = await query;

    res.json({
      status: 'success',
      data: {
        tours,
      },
    });

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
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
