'use strict';

const ServiceError = require('../../libs/service.error'),
  makeErrorCaller = require('../../modules/make.error.caller');

const errors = {
};

module.exports = makeErrorCaller(errors);
