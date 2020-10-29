'use strict';

const {
  isLength,
  isInt,
  isDate,
  isMobilePhone,
} = require('validator'),
  time = /^\d{2}:\d{2}:\d{2}$/;

const sanitizers = {

  role: {
    roleId: {
      validate: v => isInt(v, {min: 1}),
      sanitize: '',
    },
    page: v => isInt(v, {min: 1}),
    limit: v => isInt(v),
    name: v => isLength(v, {min:0, max: 50}),
  },
  reception: {
    receptionId: v => isInt(v, {min: 1}),
    page: v => isInt(v, {min: 1}),
    limit: v => isInt(v),
    doctorId: v => isInt(v, {min: 1}),
    patientId: v => isInt(v, {min: 1}),
    date: isDate,
    startTime: v => time.test(v),
    endTime: v => time.test(v),
  },
  user: {
    userId: v => isInt(v, {min: 1}),
    page: v => isInt(v, {min: 1}),
    limit: v => isInt(v),
    roleId: v => isInt(v, {min: 1}),
    firstname: v => isLength(v, {min:0, max: 50}),
    middlename: v => isLength(v, {min:0, max: 50}),
    lastname: v => isLength(v, {min:0, max: 50}),
    gender: v => ['male', 'female'].includes(v),
    age: v => isInt(v, {min: 1, max: 200}),
    phone: v => isMobilePhone(v, 'ru-RU'),
  },
};

module.exports = sanitizers;