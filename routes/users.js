const router = require('express').Router();
const { profileValidation } = require('../middlewares/validation');
const { getUser, patchUser } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', profileValidation, patchUser);

module.exports = router;
