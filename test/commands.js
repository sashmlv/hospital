'use strict';

const db = require('../libs/db-sql'),
  {
    DB
  } = require('../libs/config'),
  argv = process.argv.slice();

argv.splice(0, 2);

const ok = DB && DB.DATABASE && DB.DATABASE.includes('test');

if (!ok) {

  throw new Error('Database name does not contain word "test", please check database params');
}

const commands = [
  {
    cmd: 'npm',
    arg: ['run', 'db:test:up'],
  },
  { /* wait until db has started */
    cmd: _=> new Promise(res => setTimeout(res, 3000)),
    opt: {

      spawn: false,
    }
  },
  { /* clear db */
    cmd: async _=> await db.raw(`
DO $$ DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END; $$`),
    opt: {

      spawn: false,
    }
  },
  {
    cmd: 'npm',
    arg: ['run', 'migration:up'],
  },
  { /* run tests */
    cmd: `ava ${argv.join(' ')}`,
  },
  {
    cmd: 'npm',
    arg: ['run', 'db:test:down'],
    opt: {

      always: true,
    }
  }
];

module.exports = commands;
