'use strict';

const tableExists = require('../table.exists');

exports.up = async function(db) {

  const exitsts = await tableExists('roles');

  if (exitsts) {

    return;
  }

  await db.raw('CREATE TABLE IF NOT EXISTS roles()');

  await db.schema.table('roles', table => {

    table.increments('id');
    table.string('name', 255).notNullable();
  });
};

exports.down = async function( db ) {

  await db.schema.raw( 'DROP TABLE IF EXISTS roles CASCADE' );
};
