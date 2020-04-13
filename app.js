const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4000;

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dev-data/data/tours.json'), 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  res.json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

app.listen(PORT, () => console.log(`Server is runngin on ${PORT}`));
