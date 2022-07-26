const { celebrate, Joi } = require('celebrate');

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const authValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const profileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const deleteMovieValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required().length(24),
  }),
});

const postMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/(https?:\/\/)?(www\.)?([A-Za-z0-9]+\.?)*\.[A-Za-z0-9-](\/([\w#.!?:=+&%@\-/])*)?/),
    trailerLink: Joi.string().required().pattern(/(https?:\/\/)?(www\.)?([A-Za-z0-9]+\.?)*\.[A-Za-z0-9-](\/([\w#.!?:=+&%@\-/])*)?/),
    thumbnail: Joi.string().required().pattern(/(https?:\/\/)?(www\.)?([A-Za-z0-9]+\.?)*\.[A-Za-z0-9-](\/([\w#.!?:=+&%@\-/])*)?/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  loginValidation,
  authValidation,
  profileValidation,
  postMovieValidation,
  deleteMovieValidation,
};
