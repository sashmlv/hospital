'use strict';

const express = require('express'),
  app = express(),
  ServiceError = require('./lib/error'),
  config = require('./lib/config'),
  log = require('./lib/logger'),
  router = require('./lib/router'),
  notFound = new ServiceError({
    message: 'Not found',
    code: 'NOT_FOUND',
    status: '404',
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
      data: result.data && (result.data.length === 1) ? result.data[0] : result.data,
      success:  true,
    };

    return res.status(response.status).json(response);
  });

  /* error */
  app.use((err, req, res, next) => {

    const response = {
      message: err.message || 'Service error',
      code: err.code || 'SERVICE_ERROR',
      status: err.status || 500,
      data: err.data && (err.data.length === 1) ? err.data[0] : err.data,
      success: false,
    };

    log.error(err);

    if (res.headersSent) {

      return next(response);
    }

    return res.status(response.status).json(response);
  });

  return app;
})();