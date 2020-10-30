'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  rc = require('./role.controller'),
  rm = require('./role.model');

const spy = sinon.spy((...args) => [...args]);
rm.getRoles = spy;
rm.create = spy;
rm.getRole = spy;
rm.update = spy;
rm.delete = spy;

test.afterEach(t => spy.resetHistory());

test( `RoleController.getRoles`, async t => {

  let [args] = await rc.getRoles();
  t.deepEqual(+args.limit, 100);
  t.deepEqual(+args.offset, 0);
  t.deepEqual(rm.getRoles.callCount, 1);

  [args] = await rc.getRoles({limit: 10, page: 2});
  t.deepEqual(+args.limit, 10);
  t.deepEqual(+args.offset, 10);
  t.deepEqual(rm.getRoles.callCount, 2);
});

test( `RoleController.create`, async t => {

  let args = await rc.create({name: 'name'});
  t.deepEqual(rm.create.callCount, 1);
  t.truthy(args.id);
});

test( `RoleController.getRole`, async t => {

  let [args] = await rc.getRole({roleId: 1});
  t.deepEqual(rm.getRole.callCount, 1);
  t.deepEqual(+args.id, 1);
});

test( `RoleController.update`, async t => {

  let args = await rc.update({roleId: 1, name: 'name'});
  t.deepEqual(rm.getRole.callCount, 1);
  t.truthy(args.id);
});

test( `RoleController.delete`, async t => {

  let args = await rc.delete({roleId: 1});
  t.deepEqual(rm.delete.callCount, 1);
  t.truthy(args.id);
});
