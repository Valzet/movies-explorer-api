const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Movie.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } if (!card.owner.equals(req.user._id)) {
        res.status(403).send({ message: 'Попытка удалить чужую карточку' });
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
