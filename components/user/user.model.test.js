'use strict';

const test = require('ava'),
  makeFakeDb = require('../../test/fake-db-sql'),
  fakeDb = makeFakeDb(),
  storage = {};

fakeDb.setStorage(storage);

/* replace 'db' cache for './user.model' */
delete require.cache[require.resolve('../../libs/db-sql')];
require.cache[require.resolve('../../libs/db-sql')] = {
  exports: fakeDb,
};

const um = require('./user.model');

test(`user.model.getUsers`, async t => {

  await um.getUsers({limit: 10, offset: 10});
  t.deepEqual(storage.select.shift(), '*');
  t.deepEqual(storage.from.shift(), 'users');
  t.deepEqual(storage.orderBy.shift(), 'id');
  t.deepEqual(storage.limit.shift(), 10);
  t.deepEqual(storage.offset.shift(), 10);
});

test(`user.model.create`, async t => {

  await um.create({firstname: 'firstname'});
  t.deepEqual(storage.model.shift(), 'users');
  t.deepEqual(storage.insert.shift().firstname, 'firstname');
  t.deepEqual(storage.returning.shift(), 'id');
});

test(`user.model.getUser`, async t => {

  await um.getUser({id: 1});
  t.deepEqual(storage.select.shift(), '*');
  t.deepEqual(storage.from.shift(), 'users');
  t.deepEqual(storage.where.shift().id, 1);
});

test(`user.model.update`, async t => {

  await um.update({id: 1, firstname: 'firstname'});
  t.deepEqual(storage.model.shift(), 'users');
  t.deepEqual(storage.update.shift().firstname, 'firstname');
  t.deepEqual(storage.where.shift(), {id: 1});
  t.deepEqual(storage.returning.shift(), 'id');
});

test(`user.model.delete`, async t => {

  await um.delete({id: 1});
  t.deepEqual(storage.model.shift(), 'users');
  t.deepEqual(storage.update.shift().hasOwnProperty('record_status'), true);
  t.deepEqual(storage.where.shift(), {id: 1});
  t.deepEqual(storage.returning.shift(), 'id');
});
