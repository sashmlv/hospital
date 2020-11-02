'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  rc = require('./role.controller'),
  rm = require('./role.model'),
  spy = sinon.spy((...args) => [...args]);

rm.getRoles = spy;
rm.create = spy;
rm.getRole = spy;
rm.update = spy;
rm.delete = spy;

test.afterEach(t => spy.resetHistory());

test(`role.controller.getRoles`, async t => {

  let [data] = await rc.getRoles();
  t.deepEqual(+data.limit, 100);
  t.deepEqual(+data.offset, 0);
  t.deepEqual(rm.getRoles.callCount, 1);

  [data] = await rc.getRoles({limit: 10, page: 2});
  t.deepEqual(+data.limit, 10);
  t.deepEqual(+data.offset, 10);
  t.deepEqual(rm.getRoles.callCount, 2);
});

test(`role.controller.create`, async t => {

  let data = await rc.create({name: 'name'});
  t.deepEqual(rm.create.callCount, 1);
  t.truthy(data.id);

  let err = await t.throwsAsync(rc.create({}));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {name: undefined});
});

test(`role.controller.getRole`, async t => {

  let [data] = await rc.getRole({roleId: 1});
  t.deepEqual(rm.getRole.callCount, 1);
  t.deepEqual(+data.id, 1);

  let err = await t.throwsAsync(rc.getRole({}));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {roleId: undefined});
});

test(`role.controller.update`, async t => {

  let data = await rc.update({roleId: 1, name: 'name'});
  t.deepEqual(rm.getRole.callCount, 1);
  t.truthy(data.id);

  let err = await t.throwsAsync(rc.update({name: 'name'}));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {roleId: undefined});

  err = await t.throwsAsync(rc.update({roleId: 1}));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {name: undefined});
});

test(`role.controller.delete`, async t => {

  let data = await rc.delete({roleId: 1});
  t.deepEqual(rm.delete.callCount, 1);
  t.truthy(data.id);

  let err = await t.throwsAsync(rc.delete({}));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {roleId: undefined});
});
