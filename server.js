const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is runngin on ${PORT}`));
