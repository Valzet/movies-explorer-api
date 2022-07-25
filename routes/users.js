const router = require('express').Router();
const { profileValidation } = require('../middlewares/validation');
const { getUser, patchUser } = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', profileValidation, patchUser);

module.exports = router;
