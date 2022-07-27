const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ConflictError = require('../errors/conflict-err');
const AlreadyExistData = require('../errors/exist-err');
const {
  INVALID_USER_DATA,
  NOTFOUND_USER,
  INVALID_NEW_USER_DATA,
  INVALID_LOGIN_DATA,
  INVALID_EMAIL,

} = require('../utils/errorMessages');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOTFOUND_USER);
      }
      return res.send({ data: user });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError(INVALID_USER_DATA));
      }
      return next(err);
    });
};

module.exports.patchUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
  })
    .then(() => {
      res.status(200).send({ email, name });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(INVALID_USER_DATA));
      }
      if (err.code === 11000) {
        next(new AlreadyExistData(INVALID_EMAIL));
      } else { next(err); }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(INVALID_LOGIN_DATA));
      }
      return Promise.all([bcrypt.compare(password, user.password), user]);
    })
    .then(([isPasswordCorrect, user]) => {
      if (!isPasswordCorrect) {
        return Promise.reject(new Error(INVALID_LOGIN_DATA));
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      return res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(200).send({
        name, email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(INVALID_NEW_USER_DATA));
      }
      if (err.code === 11000) {
        next(new ConflictError(INVALID_EMAIL));
      } else { next(err); }
    });
};
