'use strict';

const {
  SERVER,
  NODE_ENV,
} = require('./libs/config'),
  {
    HOST, PORT
  } = SERVER,
  log = require('./libs/logger'),
  ServiceError = require('./libs/service.error');

module.exports = (async _=> {

  try {

    const app = await require('./app'),
      server = require('http').createServer(app);

    server.on('error', err => log.error(err));

    server.listen(
      PORT,
      HOST,
      _=> log.info( `Server listening: http://${HOST}:${PORT}, NODE_ENV: ${NODE_ENV}`)
    );

    return server;
  }
  catch(err) {

    log.error(err);
  }

  return undefined;
})();