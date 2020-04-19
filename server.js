const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

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
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB is connected'));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log(`Server is runngin on ${PORT}`)
);

// Unhandled Rejection
// promise 에서 catch로 에러 처리를 하지 않았을 때 방생하는 요류
// ref) https://ko.javascript.info/promise-error-handling
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION: Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
