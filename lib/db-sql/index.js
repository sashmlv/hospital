'use strict';

const {DB} = require( '../config' ),
  log = require( '../logger' ),
  Knex = require( './knex' );

const knex = Knex({

  client: DB.CLIENT,
  version: DB.VERSION,
  debug: DB.DEBUG,
  connection: {

    host: DB.HOST,
    user: DB.USER,
    password: DB.PASSWORD,
    database: DB.DATABASE,
  },
  log: {

    warn: e => log.warn(e),
    error: e => log.error(e),
    debug: e => log.debug(e),
  },
});

module.exports = knex;
