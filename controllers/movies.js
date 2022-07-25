const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getMovie = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.postMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при создании фильма.'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      } if (!card.owner.equals(req.user._id)) {
        res.status(403).send({ message: 'Попытка удалить чужой фильм' });
      }
      return card.remove()
        .then(() => res.status(200).send({ message: 'Удалено' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Неверно указан id'));
      }
      return next(err);
    });
};
