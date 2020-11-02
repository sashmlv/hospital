'use strict';

const express = require('express'),
  app = express(),
  ServiceError = require('./libs/service.error'),
  config = require('./libs/config'),
  log = require('./libs/logger'),
  router = require('./libs/router'),
  {errors} = require('./modules'),
  notFound = new ServiceError({
    message: 'Not found',
    code: 'NOT_FOUND',
    status: 404,
  }),
  defaultError = new ServiceError({
    message: 'Service error',
    code: 'SERVICE_ERROR',
    status: 500,
  });

module.exports = (async _=> {

  app.use(express.json());
  app.use(await router);

  /* success */
  app.use((req, res, next) => {

    const result = res.locals.result;

    if (!result) {

      return next(notFound);
    };

    const response = {
      status: result.status || 200,
      data: result.data,
      success:  true,
    };

    return res.status(response.status).json(response);
  });

  /* error */
  app.use((err, req, res, next) => {

    if (err.code && errors[err.code]) {

      err = errors[err.code](err);
    }

    log.error(err);

    if (err.name !== 'ServiceError' ) {

      err = defaultError;
    }

    const response = {
      message: err.message || 'Service error',
      code: err.code || 'SERVICE_ERROR',
      status: err.status || 500,
      data: err.data && (err.data.length === 1) ? err.data[0] : err.data,
      success: false,
    };

    if (res.headersSent) {

      return next(response);
    }

    return res.status(response.status).json(response);
  });

  return app;
})();