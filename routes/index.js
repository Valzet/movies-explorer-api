const { Joi, celebrate } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

module.exports = (app) => {
  app.post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), login);
  app.post('/signup', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }), createUser);
  app.use(auth);
  app.use('/users/', userRouter);
  app.use('/movies/', movieRouter);
};
