'use strict';

const pino = require('pino'),
  {
    PROD,
    LOG,
  } = require('./config'),
  log = pino({

    level: LOG.LEVEL,
    prettyPrint: PROD ? {} : { colorize: true },
  });

process.on('unhandledRejection', err => log.error(err))
  .on('uncaughtException', err => log.error(err));

module.exports = log;
