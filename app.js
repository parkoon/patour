const express = require('express');
const app = express();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    foo: 'bar',
  });
});

app.listen(PORT, () => console.log(`Server is runngin on ${PORT}`));
