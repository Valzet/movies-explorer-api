const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');

const {
  getUser, patchUser,
} = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', patchUser);

module.exports = router;
