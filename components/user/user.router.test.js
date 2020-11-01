'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  uc = require('./user.controller'),
  um = require('./user.model'),
  request = require('supertest');

process.env.DEBUG = undefined; // disable debug log

const noop = _=>_;

let getUsers,
  create,
  getUser,
  update,
  del;

um.getUsers = noop;
um.create = noop;
um.getUser = noop;
um.update = noop;
um.delete = noop;

uc.getUsers = sinon.spy(arg => getUsers = arg);
uc.create = sinon.spy(arg => create = arg);
uc.getUser = sinon.spy(arg => getUser = arg);
uc.update = sinon.spy(arg => update = arg);
uc.delete = sinon.spy(arg => del = arg);

const mod = require('../../modules');
mod.tryExecute = sinon.spy(mod.tryExecute);

let app;
test.before( async t => app = await require('../../app'));
test.afterEach(t => {
  mod.tryExecute.resetHistory();
  getUsers = undefined;
  create = undefined;
  getUser = undefined;
  update = undefined;
  del = undefined;
});

test(`user.router.getUsers`, async t => {

  await request(app)
    .get('/users?limit=10&page=1')
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(uc.getUsers.callCount, 1);
  t.deepEqual(+getUsers.limit, 10);
  t.deepEqual(+getUsers.page, 1);
  t.deepEqual(uc.create.callCount, 0);
  t.deepEqual(uc.getUser.callCount, 0);
  t.deepEqual(uc.update.callCount, 0);
  t.deepEqual(uc.delete.callCount, 0);
});

test(`user.router.create`, async t => {

  await request(app)
    .post('/users')
    .send({firstname: 'firstname'})
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(uc.getUsers.callCount, 1);
  t.deepEqual(create, {firstname: 'firstname'});
  t.deepEqual(uc.create.callCount, 1);
  t.deepEqual(uc.getUser.callCount, 0);
  t.deepEqual(uc.update.callCount, 0);
  t.deepEqual(uc.delete.callCount, 0);
});

test(`user.router.getUser`, async t => {

  await request(app)
    .get('/user/1')
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(uc.getUsers.callCount, 1);
  t.deepEqual(uc.create.callCount, 1);
  t.deepEqual(uc.getUser.callCount, 1);
  t.deepEqual(+getUser.userId, 1);
  t.deepEqual(uc.update.callCount, 0);
  t.deepEqual(uc.delete.callCount, 0);
});

test(`user.router.update`, async t => {

  await request(app)
    .put('/user/1')
    .send({firstname: 'firstname'})
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(uc.getUsers.callCount, 1);
  t.deepEqual(uc.create.callCount, 1);
  t.deepEqual(uc.getUser.callCount, 1);
  t.deepEqual(uc.update.callCount, 1);
  t.deepEqual(+update.userId, 1);
  t.deepEqual(update.firstname, 'firstname');
  t.deepEqual(uc.delete.callCount, 0);
});

test(`user.router.delete`, async t => {

  await request(app)
    .delete('/user/1')
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(uc.getUsers.callCount, 1);
  t.deepEqual(uc.create.callCount, 1);
  t.deepEqual(uc.getUser.callCount, 1);
  t.deepEqual(uc.update.callCount, 1);
  t.deepEqual(uc.delete.callCount, 1);
  t.deepEqual(+del.userId, 1);
});
