'use strict';

const tableExists = require('../../modules/table.exists');

exports.up = async function(db) {

  const exists = await tableExists('users');

  if (exists) {

    return;
  }

  await db.raw('CREATE TABLE IF NOT EXISTS users()');

  await db.schema.table('users', table => {

    table.increments('id');
    table.integer('role_id').notNullable();
    table.string('firstname', 255).notNullable();
    table.string('middlename', 255).notNullable();
    table.string('lastname', 255).notNullable();
    table.enum('gender', ['male', 'female']).notNullable();
    table.smallint('age').unsigned().notNullable();
    table.string('phone', 255 ).notNullable();
  });

  await db.schema.table('users', table => {

     table.foreign('role_id').references('id').inTable('roles');
  });
};

exports.down = async function( db ) {

  await db.schema.raw( 'DROP TABLE IF EXISTS users CASCADE' );
};
