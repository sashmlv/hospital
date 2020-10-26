'use strict';

const {
  SERVER,
  NODE_ENV,
} = require('./lib/config'),
  {
    HOST, PORT
  } = SERVER,
  log = require('./lib/logger'),
  ServiceError = require('./lib/error');

process.on('unhandledRejection', err => log.error(err))
  .on('uncaughtException', err => log.error(err));

module.exports = (async _=> {

  try {

    const app = await require('./app'),
      server = require('http').createServer(app);

    server.on('error', err => log.error(err));

    server.listen(
      PORT,
      HOST,
      _=> log.info( `Server listening: ${HOST}:${PORT}, NODE_ENV: ${NODE_ENV}`)
    );

    return server;
  }
  catch(err) {

    log.error(err);
  }

  return undefined;
})();