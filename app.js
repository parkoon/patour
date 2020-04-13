const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'dev-data/data/tours-simple.json'),
    'utf-8'
  )
);

app.get('/api/v1/tours', (req, res) => {
  res.json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.listen(PORT, () => console.log(`Server is runngin on ${PORT}`));
