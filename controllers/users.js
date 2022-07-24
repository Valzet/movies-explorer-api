const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Ошибка валидации'));
      }
      return next(err);
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then(() => {
      res.status(200).send({ name, about });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
      }
      return next(err);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return Promise.all([bcrypt.compare(password, user.password), user]);
    })
    .then(([isPasswordCorrect, user]) => {
      if (!isPasswordCorrect) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
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
        next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
      } if (err.code === 11000) {
        return res.status(409).send({ message: 'Данный email уже зарегистрирован ' });
      }
      return next(err);
    });
};
