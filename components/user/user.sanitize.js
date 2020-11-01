'use strict';

const {makeSanitize} = require('../../modules'),
  {
    isLength,
    isInt,
    isMobilePhone,
    escape: esc,
  } = require('validator');

module.exports = makeSanitize({

  userId: {
    validate: v => isInt(v, {min: 1}),
  },
  page: {
    validate: v => isInt(v, {min: 1}),
  },
  limit: {
    validate: v => isInt(v),
  },
  roleId: {
    validate: v => isInt(v, {min: 1}),
  },
  firstname: {
    validate: v => isLength(v, {min: 1, max: 50}),
    sanitize: esc,
  },
  middlename: {
    validate: v => isLength(v, {min: 1, max: 50}),
    sanitize: esc,
  },
  lastname: {
    validate: v => isLength(v, {min: 1, max: 50}),
    sanitize: esc,
  },
  gender: {
    validate: v => ['male', 'female'].includes(v),
  },
  age: {
    validate: v => isInt(v, {min: 1, max: 200}),
  },
  phone: {
    validate: v => isMobilePhone(v, 'ru-RU'),
    sanitize: esc,
  },
});
