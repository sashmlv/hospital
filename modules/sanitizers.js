'use strict';

const {
  isLength,
  isInt,
  isDate,
  isMobilePhone,
  escape,
} = require('validator'),
  time = /^\d{2}:\d{2}:\d{2}$/;

const sanitizers = {

  role: {
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
      sanitize: escape,
    },
  },
  reception: {
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
  },
  user: {
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
      sanitize: escape,
    },
    middlename: {
      validate: v => isLength(v, {min: 1, max: 50}),
      sanitize: escape,
    },
    lastname: {
      validate: v => isLength(v, {min: 1, max: 50}),
      sanitize: escape,
    },
    gender: {
      validate: v => ['male', 'female'].includes(v),
    },
    age: {
      validate: v => isInt(v, {min: 1, max: 200}),
    },
    phone: {
      validate: v => isMobilePhone(v, 'ru-RU'),
      sanitize: escape,
    },
  },
};

module.exports = sanitizers;
