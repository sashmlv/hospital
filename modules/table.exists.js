'use strict';

const db = require('../libs/db-sql');

async function tableExists (name) {

  const result = await db.raw(`SELECT EXISTS (SELECT relname FROM pg_class WHERE relname = ?)`, [name]);

  return result.exists;
}

module.exports = tableExists;
