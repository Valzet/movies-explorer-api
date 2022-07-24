const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');

const {
  getMovie, postMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovie);
router.post('/movies', postMovie);
router.delete('/movies/_id', deleteMovie);

module.exports = router;
