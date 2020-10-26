'use strict';

const pino = require('pino'),
  {
    PROD,
    LOG,
  } = require('./config'),
  {ServiceError} = require('./error'),
  log = pino({

    level: LOG.LEVEL,
    prettyPrint: PROD ? {} : { colorize: true },
  });

module.exports = {

  log,
  info: e => log.info(e),
  warn: e => log.warn(e),
  error: e => log.error(e),
};