const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  INVALID_MOVIE_DATA,
  FORBIDDEN_DELETE_MOVIE,
  INVALID_ID,
  NOTFOUND_MOVIE_ID,
  SUCCSESS_MOVIE_REMOVE,
} = require('../utils/errorMessages');

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
        return next(new ValidationError(INVALID_MOVIE_DATA));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOTFOUND_MOVIE_ID);
      } if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError(FORBIDDEN_DELETE_MOVIE));
      }
      return card.remove()
        .then(() => res.status(200).send({ message: SUCCSESS_MOVIE_REMOVE }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError(INVALID_ID));
      }
      return next(err);
    });
};
