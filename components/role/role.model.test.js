'use strict';

const test = require('ava'),
  rm = require('./role.model');

test(`role.model.create`, async t => {

  let data = await rm.create({name: 'name1', record_status: 'active'});

  t.deepEqual(data.id, 1);
  t.deepEqual(data.name, 'name1');
  t.deepEqual(data.record_status, 'active');

  data = await rm.create({name: 'name2', record_status: 'active'});

  t.deepEqual(data.id, 2);
  t.deepEqual(data.name, 'name2');
  t.deepEqual(data.record_status, 'active');

  data = await rm.create({name: 'name3', record_status: 'active'});

  t.deepEqual(data.id, 3);
  t.deepEqual(data.name, 'name3');
  t.deepEqual(data.record_status, 'active');

  let err = await t.throwsAsync(_=> rm.create({name: 'name3', record_status: 'active'}));
  t.deepEqual(err.code, '23505'); // duplicate key

  err = await t.throwsAsync(_=> rm.create({name: 'name3', record_status: 'some'}));
  t.deepEqual(err.code, '23514'); // failing row contains some
});

test(`role.model.getRoles`, async t => {

  let data = await rm.getRoles({limit: 10, offset: 0, record_status: 'active'});

  t.deepEqual(data.length, 3);
  t.deepEqual(data[0].name, 'name1');
  t.deepEqual(data[1].name, 'name2');
  t.deepEqual(data[2].name, 'name3');

  data = await rm.getRoles({limit: 1, offset: 1, record_status: 'active'});

  t.deepEqual(data.name, 'name2');
});

test(`role.model.getRole`, async t => {

  let data = await rm.getRole({id: 1, record_status: 'active'});

  t.deepEqual(data.id, 1);
  t.deepEqual(data.name, 'name1');
});

test(`role.model.update`, async t => {

  let data = await rm.update({id: 1, name: 'no-name', record_status: 'active'});

  t.deepEqual(data.id, 1);
  t.deepEqual(data.name, 'no-name');
  t.deepEqual(data.record_status, 'active');

  data = await rm.getRole({id: 1, record_status: 'active'});

  t.deepEqual(data.id, 1);
  t.deepEqual(data.name, 'no-name');
});

test(`role.model.delete`, async t => {

  let data = await rm.delete({id: 1, record_status: 'active'});

  t.deepEqual(data.id, 1);
  t.deepEqual(data.name, 'no-name');

  data = await rm.getRole({id: 1, record_status: 'deleted'});

  t.deepEqual(data, null);
});
