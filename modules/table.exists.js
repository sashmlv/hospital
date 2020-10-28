'use strict';

const db = require('../lib/db-sql');

async function tableExists (name) {

  const result = await db.raw(`SELECT EXISTS (SELECT relname FROM pg_class WHERE relname = ?)`, [name]),
    data = result.rows.shift() || {};

  return data.exists;
}

module.exports = tableExists;