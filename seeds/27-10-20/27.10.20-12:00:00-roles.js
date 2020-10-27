'use strict';

const tableExists = require('../../modules/table.exists');

exports.seed = async function(db) {

  const exitsts = await tableExists('users');

  if (!exitsts) {

    return;
  }

  await db.raw("INSERT INTO roles (name) VALUES ('doctor'), ('patient')");
};
