'use strict';

const tableExists = require('../table.exists');

exports.up = async function(db) {

  const exitsts = await tableExists('receptions');

  if (exitsts) {

    return;
  }

  await db.raw('CREATE TABLE IF NOT EXISTS receptions()');

  await db.schema.table('receptions', table => {

    table.increments('id');
    table.integer('user_id').notNullable();
    table.date('date').notNullable();
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
  });

  await db.schema.table('receptions', table => {

     table.foreign('user_id').references('id').inTable('users');
  });
};

exports.down = async function( db ) {

  await db.schema.raw('DROP TABLE IF EXISTS receptions CASCADE');
};
