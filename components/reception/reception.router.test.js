'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  rc = require('./reception.controller'),
  rm = require('./reception.model'),
  request = require('supertest');

process.env.DEBUG = undefined; // disable debug log

const noop = _=>_;

let getReceptions,
  createOrUpdate,
  getReception,
  del,
  createOrUpdateReceptionsInterval,
  receptionTake;

rm.getReceptions = noop;
rm.createOrUpdate = noop;
rm.getReception = noop;
rm.delete = noop;
rm.createOrUpdateMany = noop;
rm.updateByPatient = noop;

rc.getReceptions = sinon.spy(arg => getReceptions = arg);
rc.createOrUpdate = sinon.spy(arg => createOrUpdate = arg);
rc.getReception = sinon.spy(arg => getReception = arg);
rc.delete = sinon.spy(arg => del = arg);
rc.createOrUpdateReceptionsInterval = sinon.spy(arg => createOrUpdateReceptionsInterval = arg);
rc.receptionTake = sinon.spy(arg => receptionTake = arg);

const mod = require('../../modules');
mod.tryExecute = sinon.spy(mod.tryExecute);

let app;
test.before( async t => app = await require('../../app'));
test.afterEach(t => {
  mod.tryExecute.resetHistory();
  getReceptions = undefined;
  createOrUpdate = undefined;
  getReception = undefined;
  del = undefined;
  createOrUpdateReceptionsInterval = undefined;
  receptionTake = undefined;
});

test(`reception.router.getReceptions`, async t => {

  await request(app)
    .get('/receptions?limit=10&page=1')
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getReceptions.callCount, 1);
  t.deepEqual(+getReceptions.limit, 10);
  t.deepEqual(+getReceptions.page, 1);
  t.deepEqual(rc.createOrUpdate.callCount, 0);
  t.deepEqual(rc.getReception.callCount, 0);
  t.deepEqual(rc.delete.callCount, 0);
  t.deepEqual(rc.createOrUpdateReceptionsInterval.callCount, 0);
  t.deepEqual(rc.receptionTake.callCount, 0);
});

test(`reception.router.createOrUpdate`, async t => {

  await request(app)
    .post('/receptions')
    .send({date: '2020-01-01'})
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getReceptions.callCount, 1);
  t.deepEqual(createOrUpdate, {date: '2020-01-01'});
  t.deepEqual(rc.createOrUpdate.callCount, 1);
  t.deepEqual(rc.getReception.callCount, 0);
  t.deepEqual(rc.delete.callCount, 0);
  t.deepEqual(rc.createOrUpdateReceptionsInterval.callCount, 0);
  t.deepEqual(rc.receptionTake.callCount, 0);
});

test(`reception.router.getReception`, async t => {

  await request(app)
    .get('/reception/1')
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getReceptions.callCount, 1);
  t.deepEqual(rc.createOrUpdate.callCount, 1);
  t.deepEqual(rc.getReception.callCount, 1);
  t.deepEqual(+getReception.receptionId, 1);
  t.deepEqual(rc.delete.callCount, 0);
  t.deepEqual(rc.createOrUpdateReceptionsInterval.callCount, 0);
  t.deepEqual(rc.receptionTake.callCount, 0);
});

test(`reception.router.delete`, async t => {

  await request(app)
    .delete('/reception/1')
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getReceptions.callCount, 1);
  t.deepEqual(rc.createOrUpdate.callCount, 1);
  t.deepEqual(rc.getReception.callCount, 1);
  t.deepEqual(rc.delete.callCount, 1);
  t.deepEqual(+del.receptionId, 1);
  t.deepEqual(rc.createOrUpdateReceptionsInterval.callCount, 0);
  t.deepEqual(rc.receptionTake.callCount, 0);
});

test(`reception.router.createOrUpdateReceptionsInterval`, async t => {

  await request(app)
    .post('/receptions/interval')
    .send({startInterval: '06:00:00'})
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getReceptions.callCount, 1);
  t.deepEqual(rc.createOrUpdate.callCount, 1);
  t.deepEqual(rc.getReception.callCount, 1);
  t.deepEqual(rc.delete.callCount, 1);
  t.deepEqual(rc.createOrUpdateReceptionsInterval.callCount, 1);
  t.deepEqual(createOrUpdateReceptionsInterval, {startInterval: '06:00:00'});
  t.deepEqual(rc.receptionTake.callCount, 0);
});

test(`reception.router.receptionTake`, async t => {

  await request(app)
    .put('/reception/take/1')
    .send({startInterval: '06:00:00'})
    .expect('Content-Type', /json/)
    .expect(200);

  t.deepEqual(mod.tryExecute.callCount, 1);
  t.deepEqual(rc.getReceptions.callCount, 1);
  t.deepEqual(rc.createOrUpdate.callCount, 1);
  t.deepEqual(rc.getReception.callCount, 1);
  t.deepEqual(rc.delete.callCount, 1);
  t.deepEqual(rc.createOrUpdateReceptionsInterval.callCount, 1);
  t.deepEqual(rc.receptionTake.callCount, 1);
  t.deepEqual(receptionTake, {receptionId: '1', startInterval: '06:00:00'});
});
