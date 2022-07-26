const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const limiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const NotFoundError = require('./errors/not-found-err');
const errorHandler = require('./middlewares/errorHandler');
const { NOTFOUND_ERROR } = require('./utils/errorMessages');

const { PORT = 3000, DATABASE = 'mongodb://localhost:27017/moviesdb' } = process.env;
mongoose.connect(DATABASE);
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
router(app);
app.use('*', (req, res, next) => next(new NotFoundError(NOTFOUND_ERROR)));
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
