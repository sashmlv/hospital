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

process.on('unhandledRejection', err => log.error(err))
  .on('uncaughtException', err => log.error(err));

module.exports = {

  log,
  info: e => log.info(e),
  warn: e => log.warn(e),
  error: e => log.error(e),
  debug: e => log.debug(e),
};