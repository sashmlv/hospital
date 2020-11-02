'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  uc = require('./user.controller'),
  um = require('./user.model'),
  spy = sinon.spy((...args) => [...args]);

um.getUsers = spy;
um.create = spy;
um.getUser = spy;
um.update = spy;
um.delete = spy;

test.afterEach(t => spy.resetHistory());

test(`user.controller.getUsers`, async t => {

  let [args] = await uc.getUsers();
  t.deepEqual(+args.limit, 100);
  t.deepEqual(+args.offset, 0);
  t.deepEqual(um.getUsers.callCount, 1);

  [args] = await uc.getUsers({limit: 10, page: 2});
  t.deepEqual(+args.limit, 10);
  t.deepEqual(+args.offset, 10);
  t.deepEqual(um.getUsers.callCount, 2);
});

test(`user.controller.create`, async t => {

  let data = await uc.create({ // success
    roleId: '1',
    firstname: 'firstname',
    middlename: 'middlename',
    lastname: 'lastname',
    gender: 'male',
    age: '10',
    phone: '+79001112233',
  });
  t.deepEqual(um.create.callCount, 1);
  t.truthy(data.id);

  let err = await t.throwsAsync(uc.create({
    firstname: 'firstname',
    middlename: 'middlename',
    lastname: 'lastname',
    gender: 'male',
    age: '10',
    phone: '+79001112233',
  }));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {roleId: undefined});

  err = await t.throwsAsync(uc.create({
    roleId: '1',
    middlename: 'middlename',
    lastname: 'lastname',
    gender: 'male',
    age: '10',
    phone: '+79001112233',
  }));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {firstname: undefined});

  err = await t.throwsAsync(uc.create({
    roleId: '1',
    firstname: 'firstname',
    lastname: 'lastname',
    gender: 'male',
    age: '10',
    phone: '+79001112233',
  }));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {middlename: undefined});

  err = await t.throwsAsync(uc.create({
    roleId: '1',
    firstname: 'firstname',
    middlename: 'middlename',
    gender: 'male',
    age: '10',
    phone: '+79001112233',
  }));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {lastname: undefined});

  err = await t.throwsAsync(uc.create({
    roleId: '1',
    firstname: 'firstname',
    middlename: 'middlename',
    lastname: 'lastname',
    age: '10',
    phone: '+79001112233',
  }));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {gender: undefined});

  err = await t.throwsAsync(uc.create({
    roleId: '1',
    firstname: 'firstname',
    middlename: 'middlename',
    lastname: 'lastname',
    gender: 'male',
    phone: '+79001112233',
  }));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {age: undefined});

  err = await t.throwsAsync(uc.create({
    roleId: '1',
    firstname: 'firstname',
    middlename: 'middlename',
    lastname: 'lastname',
    gender: 'male',
    age: '10',
  }));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {phone: undefined});
});

test(`user.controller.getUser`, async t => {

  let [data] = await uc.getUser({userId: 1});
  t.deepEqual(um.getUser.callCount, 1);
  t.deepEqual(+data.id, 1);

  let err = await t.throwsAsync(uc.getUser({}));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {userId: undefined});
});

test(`user.controller.update`, async t => {

  let data = await uc.update({userId: 1, firstname: 'firstname'});
  t.deepEqual(um.getUser.callCount, 1);
  t.truthy(data.id);

  let err = await t.throwsAsync(uc.update({}));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {userId: undefined});
});

test(`user.controller.delete`, async t => {

  let data = await uc.delete({userId: 1});
  t.deepEqual(um.delete.callCount, 1);
  t.truthy(data.id);

  let err = await t.throwsAsync(uc.delete({}));
  t.deepEqual(err.code, 'FIELD_REQUIRED');
  t.deepEqual(err.data, {userId: undefined});
});
