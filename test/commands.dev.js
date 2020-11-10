'use strict';

const db = require('../libs/db-sql'),
  argv = process.argv.slice();

argv.splice(0, 2);

const commands = [
  { /* npm run db:test:up */
    msg: 'Check database connection',
    cmd: checkDbConnection,
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
];

async function checkDbConnection() {

  try {

    await db.raw(`SELECT 1`);

  }
  catch (err) {

    if (err.code === 'ECONNREFUSED') {

      throw new Error('No database connection');
    }

    throw err;
  }
}

module.exports = commands;
