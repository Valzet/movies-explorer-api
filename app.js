require('dotenv').config();

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const limiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const errorHandler = require('./middlewares/errorHandler');
const { NOTFOUND_ERROR } = require('./utils/errorMessages');
const routes = require('./routes');
const MONGO_LOCAL = require('./routes');

const {
  PORT = 3000,
  DATABASE_LINK,
  NODE_ENV,
} = process.env;
mongoose.connect(NODE_ENV !== 'production' ? MONGO_LOCAL : DATABASE_LINK);
app.use(helmet());
app.use(cors());
app.use(requestLogger);
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.use('*', (req, res, next) => next(new NotFoundError(NOTFOUND_ERROR)));
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
