'use strict';

const tableExists = require('../../modules/table.exists');

exports.up = async function(db) {

  const exists = await tableExists('receptions');

  if (exists) {

    return;
  }

  await db.raw('CREATE TABLE IF NOT EXISTS receptions()');

  await db.schema.table('receptions', table => {

    table.increments('id');
    table.integer('doctor_id').notNullable();
    table.integer('patient_id').nullable();
    table.date('date').notNullable();
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.enum('record_status', ['draft', 'active', 'deleted']).notNullable().default('draft');
    table.index('record_status');
  });

  await db.schema.table('receptions', table => {

    table.foreign('doctor_id').references('id').inTable('users');
    table.foreign('patient_id').references('id').inTable('users');
  });
};

exports.down = async function( db ) {

  await db.schema.raw('DROP TABLE IF EXISTS receptions CASCADE');
};
