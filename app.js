const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const PORT = process.env.PORT || 4000;

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'dev-data/data/tours-simple.json'),
    'utf-8'
  )
);

const getTours = (req, res) => {
  res.json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};
const getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((t) => t.id === id * 1);
  if (!tour) {
    return res.status(404).json({
      status: 'failure',
      error: 'tour not found',
    });
  }
  res.json({
    status: 'success',
    request_at: req.requestTime,
    data: {
      tour,
    },
  });
};
const createTour = (req, res) => {
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
const udpateTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((t) => t.id === id * 1);
  if (!tour) {
    return res.status(404).json({
      status: 'failure',
      error: 'tour not found',
    });
  }
  res.json({
    status: 'success',
    tour: 'updated tour....',
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((t) => t.id === id * 1);
  if (!tour) {
    return res.status(404).json({
      status: 'failure',
      error: 'tour not found',
    });
  }
  res.status(204).json({
    status: 'success',
  });
};

// app.patch('/api/v1/tours/:id', udpateTour);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.get('/api/v1/tours', getTours);
// app.delete('/api/v1/tours/:id', deleteTour);

app
  .route('/api/v1/tours/:id')
  .delete(deleteTour)
  .get(getTour)
  .patch(udpateTour);
app.route('/api/v1/tours').post(createTour).get(getTours);

app.listen(PORT, () => console.log(`Server is runngin on ${PORT}`));
