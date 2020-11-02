'use strict';

const test = require('ava'),
  makeFakeDb = require('../../test/fake-db-sql'),
  fakeDb = makeFakeDb(),
  storage = {};

fakeDb.setStorage(storage);

/* replace 'db' cache for './role.model' */
delete require.cache[require.resolve('../../libs/db-sql')];
require.cache[require.resolve('../../libs/db-sql')] = {
  exports: fakeDb,
};

const rm = require('./role.model');

test(`role.model.getRoles`, async t => {

  await rm.getRoles({limit: 10, offset: 10});
  t.deepEqual(storage.select.shift(), '*');
  t.deepEqual(storage.from.shift(), 'roles');
  t.deepEqual(storage.orderBy.shift(), 'id');
  t.deepEqual(storage.limit.shift(), 10);
  t.deepEqual(storage.offset.shift(), 10);
});

test(`role.model.create`, async t => {

  await rm.create({name: 'name'});
  t.deepEqual(storage.model.shift(), 'roles');
  t.deepEqual(storage.insert.shift().name, 'name');
  t.deepEqual(storage.returning.shift(), '*');
});

test(`role.model.getRole`, async t => {

  await rm.getRole({id: 1});
  t.deepEqual(storage.select.shift(), '*');
  t.deepEqual(storage.from.shift(), 'roles');
  t.deepEqual(storage.where.shift().id, 1);
});

test(`role.model.update`, async t => {

  await rm.update({id: 1, name: 'name'});
  t.deepEqual(storage.model.shift(), 'roles');
  t.deepEqual(storage.update.shift(), {name: 'name'});
  t.deepEqual(storage.where.shift().id, 1);
  t.deepEqual(storage.returning.shift(), '*');
});

test(`role.model.delete`, async t => {

  await rm.delete({id: 1});
  t.deepEqual(storage.model.shift(), 'roles');
  t.deepEqual(storage.update.shift().hasOwnProperty('record_status'), true);
  t.deepEqual(storage.where.shift().id, 1);
  t.deepEqual(storage.returning.shift(), '*');
});
