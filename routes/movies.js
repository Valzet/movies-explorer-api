const router = require('express').Router();
const { postMovieValidation, deleteMovieValidation } = require('../middlewares/validation');
const { getMovie, postMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMovie);
router.post('/movies', postMovieValidation, postMovie);
router.delete('/movies/:movieId', deleteMovieValidation, deleteMovie);

module.exports = router;
