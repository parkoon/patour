const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB is connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is runngin on ${PORT}`));
