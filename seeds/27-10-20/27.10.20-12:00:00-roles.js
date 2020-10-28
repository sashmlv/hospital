'use strict';

const tableExists = require('../../modules/table.exists');

exports.seed = async function(db) {

  const exists = await tableExists('users');

  if (!exists) {

    return;
  }

  await db.raw("INSERT INTO roles (name) VALUES ('doctor'), ('patient')");
};
