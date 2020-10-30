'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  rc = require('./role.controller'),
  rm = require('./role.model'),
  request = require('supertest');

process.env.DEBUG = undefined; // disable debug log

const noop = _=>_;

let getRoles,
  create,
  getRole,
  update,
  del;

rm.getRoles = noop;
rm.create = noop;
rm.getRole = noop;
rm.update = noop;
rm.delete = noop;

rc.getRoles = sinon.spy(arg => getRoles = arg);
rc.create = sinon.spy(arg => create = arg);
rc.getRole = sinon.spy(arg => getRole = arg);
rc.update = sinon.spy(arg => update = arg);
rc.delete = sinon.spy(arg => del = arg);

const mod = require('../../modules');
mod.tryExecute = sinon.spy(mod.tryExecute);

let app;
test.before( async t => app = await require('../../app'));
test.afterEach(t => {
  mod.tryExecute.resetHistory();
  getRoles = undefined;
  create = undefined;
  getRole = undefined;
  update = undefined;
  del = undefined;
});

test(`role.router.getRoles`, async t => {

  await request(app)
    .get('/roles?limit=10&page=1')
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getRoles.callCount, 1);
  t.deepEqual(+getRoles.limit, 10);
  t.deepEqual(+getRoles.page, 1);
  t.deepEqual(rc.create.callCount, 0);
  t.deepEqual(rc.getRole.callCount, 0);
  t.deepEqual(rc.update.callCount, 0);
  t.deepEqual(rc.delete.callCount, 0);
});

test(`role.router.create`, async t => {

  await request(app)
    .post('/roles')
    .send({name: 'name'})
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getRoles.callCount, 1);
  t.deepEqual(create, {name: 'name'});
  t.deepEqual(rc.create.callCount, 1);
  t.deepEqual(rc.getRole.callCount, 0);
  t.deepEqual(rc.update.callCount, 0);
  t.deepEqual(rc.delete.callCount, 0);
});

test(`role.router.getRole`, async t => {

  await request(app)
    .get('/role/1')
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getRoles.callCount, 1);
  t.deepEqual(rc.create.callCount, 1);
  t.deepEqual(rc.getRole.callCount, 1);
  t.deepEqual(+getRole.roleId, 1);
  t.deepEqual(rc.update.callCount, 0);
  t.deepEqual(rc.delete.callCount, 0);
});

test(`role.router.update`, async t => {

  await request(app)
    .put('/role/1')
    .send({name: 'name'})
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getRoles.callCount, 1);
  t.deepEqual(rc.create.callCount, 1);
  t.deepEqual(rc.getRole.callCount, 1);
  t.deepEqual(rc.update.callCount, 1);
  t.deepEqual(+update.roleId, 1);
  t.deepEqual(update.name, 'name');
  t.deepEqual(rc.delete.callCount, 0);
});

test(`role.router.delete`, async t => {

  await request(app)
    .delete('/role/1')
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getRoles.callCount, 1);
  t.deepEqual(rc.create.callCount, 1);
  t.deepEqual(rc.getRole.callCount, 1);
  t.deepEqual(rc.update.callCount, 1);
  t.deepEqual(rc.delete.callCount, 1);
  t.deepEqual(+del.roleId, 1);
});
