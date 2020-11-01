'use strict';

const {makeSanitize} = require('../../modules'),
  {
    isInt,
    isDate,
  } = require('validator'),
  time = /^[01][0-9]|2[0-3]:[0-5][0-9]:[0-5][0-9]$/;

module.exports = makeSanitize({

  receptionId: {
    validate: v => isInt(v, {min: 1}),
  },
  page: {
    validate: v => isInt(v, {min: 1}),
  },
  limit: {
    validate: v => isInt(v),
  },
  doctorId: {
    validate: v => isInt(v, {min: 1}),
  },
  patientId: {
    validate: v => isInt(v, {min: 1}),
  },
  date: {
    validate: isDate,
  },
  startTime: {
    validate: v => time.test(v),
  },
  endTime: {
    validate: v => time.test(v),
  },
  startInterval: {
    validate: v => time.test(v),
  },
  endInterval: {
    validate: v => time.test(v),
  },
});
