'use strict';

const {DB} = require('../config'),
  log = require('../logger'),
  Knex = require('./knex');

const knex = Knex({

  client: DB.CLIENT,
  version: DB.VERSION,
  debug: DB.DEBUG,
  connection: `postgresql://${DB.USER}:${DB.PASSWORD}@${DB.HOST}:${DB.PORT}/${DB.DATABASE}`,
  log: {

    warn: e => log.warn(e),
    error: e => log.error(e),
    debug: e => log.debug(e),
    deprecate: e => log.warn(e),
  },
  migrations: {

    tableName: 'migrations'
  },
});

module.exports = knex;
