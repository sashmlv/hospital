'use strict';

const ServiceError = require('../../libs/service.error'),
  makeErrorCaller = require('../../modules/make.error.caller'),
  {APP} = require('../../libs/config'),
  {RECEPTION_DURATION} = APP;

const errors = {

  RECEPTION_DURATION: new ServiceError({
    message: 'Please provide reseption time equal to reception duration: ' + RECEPTION_DURATION,
    code: 'RECEPTION_DURATION',
  }),
  RESEPTION_INTERVAL: new ServiceError({
    message: 'Please provide reseptions interval, which can be divided by reception duration: ' + RECEPTION_DURATION,
    code: 'RESEPTION_INTERVAL',
  }),
  RECEPTION_NOT_FOUND: new ServiceError({
    message: 'Reception not found',
    code: 'RECEPTION_NOT_FOUND',
  }),
  RECEPTION_TAKEN: new ServiceError({
    message: 'Reception already taken',
    code: 'RECEPTION_TAKEN',
  }),
};

module.exports = makeErrorCaller(errors);
