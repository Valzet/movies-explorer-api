const router = require('express').Router();
const { postMovieValidation, deleteMovieValidation } = require('../middlewares/validation');
const { getMovie, postMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovie);
router.post('/', postMovieValidation, postMovie);
router.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports = router;
