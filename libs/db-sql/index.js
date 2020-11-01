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
  postProcessResponse: (result, queryContext) => {

    if (result.rows) {

      return result.rows.length < 2 ? result.rows.shift() || null : result.rows;
    }
    else if (Array.isArray(result)) {

      return result.length < 2 ? result.shift() || null : result;
    }
    else {

      return result;
    }
  },
});

module.exports = knex;
