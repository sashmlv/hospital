'use strict';

const {makeSanitize} = require('../../modules'),
  {
    isLength,
    isInt,
    escape: esc,
  } = require('validator');

module.exports = makeSanitize({

  roleId: {
    validate: v => isInt(v, {min: 1}),
  },
  page: {
    validate: v => isInt(v, {min: 1}),
  },
  limit: {
    validate: v => isInt(v),
  },
  name: {
    validate: v => isLength(v, {min: 1, max: 50}),
    sanitize: esc,
  },
});
