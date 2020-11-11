'use strict';

const test = require('ava'),
  db = require('../../libs/db-sql'),
  rom = require('./role.model');

test.before(async t => await db.raw(`
TRUNCATE roles RESTART IDENTITY CASCADE
`));

test(`role.model.create`, async t => {

  let role = await rom.create({name: 'name1', record_status: 'active'});

  t.deepEqual(role.id, 1);
  t.deepEqual(role.name, 'name1');
  t.deepEqual(role.record_status, 'active');

  role = await rom.create({name: 'name2', record_status: 'active'});

  t.deepEqual(role.id, 2);
  t.deepEqual(role.name, 'name2');
  t.deepEqual(role.record_status, 'active');

  role = await rom.create({name: 'name3', record_status: 'active'});

  t.deepEqual(role.id, 3);
  t.deepEqual(role.name, 'name3');
  t.deepEqual(role.record_status, 'active');

  let err = await t.throwsAsync(_=> rom.create({name: 'name3', record_status: 'active'}));
  t.deepEqual(err.code, '23505'); // duplicate key

  err = await t.throwsAsync(_=> rom.create({name: 'name3', record_status: 'some'}));
  t.deepEqual(err.code, '23514'); // failing row contains some
});

test(`role.model.getRoles`, async t => {

  let role = await rom.getRoles({limit: 10, offset: 0, record_status: 'active'});

  t.deepEqual(role.length, 3);
  t.deepEqual(role[0].name, 'name1');
  t.deepEqual(role[1].name, 'name2');
  t.deepEqual(role[2].name, 'name3');

  role = await rom.getRoles({limit: 1, offset: 1, record_status: 'active'});

  t.deepEqual(role.name, 'name2');
});

test(`role.model.getRole`, async t => {

  let role = await rom.getRole({id: 1, record_status: 'active'});

  t.deepEqual(role.id, 1);
  t.deepEqual(role.name, 'name1');
});

test(`role.model.update`, async t => {

  let role = await rom.update({id: 1, name: 'new name', record_status: 'active'});

  t.deepEqual(role.id, 1);
  t.deepEqual(role.name, 'new name');
  t.deepEqual(role.record_status, 'active');

  role = await rom.getRole({id: 1, record_status: 'active'});

  t.deepEqual(role.id, 1);
  t.deepEqual(role.name, 'new name');
});

test(`role.model.delete`, async t => {

  let role = await rom.delete({id: 1, record_status: 'active'});

  t.deepEqual(role.id, 1);
  t.deepEqual(role.name, 'new name');

  role = await rom.getRole({id: 1, record_status: 'deleted'});

  t.deepEqual(role, null);
});
