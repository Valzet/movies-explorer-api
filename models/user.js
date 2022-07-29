const mongoose = require('mongoose');
const validator = require('validator');
const { VALIDATION_ERROR } = require('../utils/errorMessages');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: VALIDATION_ERROR,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: ' ',
  },

});

module.exports = mongoose.model('user', userSchema);
