'use strict';

const db = require('../libs/db-sql'),
  argv = process.argv.slice();

argv.splice(0, 2);

const commands = [
  {
    msg: 'Run database',
    cmd: 'npm',
    arg: ['run', 'db:test:up'],
  },
  {
    msg: 'Wait database',
    cmd: _=> new Promise(res => setTimeout(res, 3000)),
    opt: {spawn: false}
  },
  {
    msg: 'Clean database',
    cmd: async _=> await db.raw(`
DO $$ DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END; $$`),
    opt: {spawn: false}
  },
  {
    msg: 'Run migration',
    cmd: 'npm',
    arg: ['run', 'migration:up'],
  },
  {
    msg: 'Run tests',
    cmd: `ava ${argv.join(' ')}`,
  },
  {
    msg: 'Stop database',
    cmd: 'npm',
    arg: ['run', 'db:test:down'],
    opt: {always: true}
  }
];

module.exports = commands;
