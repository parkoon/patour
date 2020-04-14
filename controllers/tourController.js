const fs = require('fs');
const path = require('path');

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../dev-data/data/tours-simple.json'),
    'utf-8'
  )
);

exports.checkId = (req, res, next, val) => {
  const tour = tours.find((t) => t.id === val * 1);
  if (!tour) {
    return res.status(404).json({
      status: 'failure',
      error: 'tour not found',
    });
  }
  next();
};

exports.getTours = (req, res) => {
  res.json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};
exports.getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((t) => t.id === id * 1);
  res.json({
    status: 'success',
    request_at: req.requestTime,
    data: {
      tour,
    },
  });
};
exports.createTour = (req, res) => {
  const nextId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: nextId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    path.join(__dirname, 'dev-data/data/tours-simple.json'),
    JSON.stringify(tours),
    (err) => {
      if (err) return res.status(500).json({ status: 'failure', error: err });
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
};
exports.udpateTour = (req, res) => {
  const { id } = req.params;
  res.json({
    status: 'success',
    tour: 'updated tour....',
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
  });
};
