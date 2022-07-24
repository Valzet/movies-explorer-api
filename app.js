const express = require('express');

const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');

const NotFoundError = require('./errors/not-found-err');

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

router(app);

app.use('*', (req, res, next) => next(new NotFoundError('Такой страницы не существует.')));
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка на стороне сервера' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
