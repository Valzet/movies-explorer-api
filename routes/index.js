const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { loginValidation, authValidation } = require('../middlewares/validation');

module.exports = (app) => {
  app.post('/signin', loginValidation, login);
  app.post('/signup', authValidation, createUser);
  app.use(auth);
  app.use('/', userRouter);
  app.use('/', movieRouter);
};
