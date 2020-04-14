const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

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

const getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'router is not defined yet',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'router is not defined yet',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'router is not defined yet',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'router is not defined yet',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'router is not defined yet',
  });
};

// app.patch('/api/v1/tours/:id', udpateTour);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.get('/api/v1/tours', getTours);
// app.delete('/api/v1/tours/:id', deleteTour);

const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/:id').delete(deleteTour).get(getTour).patch(udpateTour);
tourRouter.route('/').post(createTour).get(getTours);

userRouter.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);
userRouter.route('/').post(createUser).get(getUsers);

module.exports = app;
