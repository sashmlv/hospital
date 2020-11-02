'use strict';

const tableExists = require('../../modules/table.exists');

exports.up = async function(db) {

  const exists = await tableExists('roles');

  if (exists) {

    return;
  }

  await db.raw('CREATE TABLE IF NOT EXISTS roles()');

  await db.schema.table('roles', table => {

    table.increments('id');
    table.string('name', 255).unique().notNullable();
    table.enum('record_status', ['draft', 'active', 'deleted']).notNullable().default('draft');
    table.index('record_status');
  });
};

exports.down = async function( db ) {

  await db.schema.raw( 'DROP TABLE IF EXISTS roles CASCADE' );
};
