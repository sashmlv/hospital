'use strict';

const pino = require('pino'),
  {
    PROD,
    LOG,
  } = require('./config'),
  log = LOG.ENABLED ? pino({

    level: LOG.LEVEL,
    prettyPrint: PROD ?
      false :
      {
        colorize: true,
        errorProps: '*',
      },
  }) : {

    info: _=>_,
    error: _=>_,
    warn: _=>_,
    debug: _=>_,
  };

process.on('unhandledRejection', err => log.error(err))
  .on('uncaughtException', err => log.error(err));

module.exports = log;
