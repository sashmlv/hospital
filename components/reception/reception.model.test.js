'use strict';

const test = require('ava'),
  makeFakeDb = require('../../test/fake-db-sql'),
  fakeDb = makeFakeDb(),
  storage = {};

fakeDb.setStorage(storage);

/* replace 'db' cache for './reception.model' */
delete require.cache[require.resolve('../../libs/db-sql')];
require.cache[require.resolve('../../libs/db-sql')] = {
  exports: fakeDb,
};

const rm = require('./reception.model');

test(`reception.model.getReceptions`, async t => {

  await rm.getReceptions({limit: 10, offset: 10});

  t.deepEqual(storage.select.shift(), '*');
  t.deepEqual(storage.from.shift(), 'receptions');
  t.deepEqual(storage.orderBy.shift(), 'id');
  t.deepEqual(storage.limit.shift(), 10);
  t.deepEqual(storage.offset.shift(), 10);
});

test(`reception.model.createOrUpdate`, async t => {

  await rm.createOrUpdate({
    doctor_id: '1',
    date: '2020-01-01',
    start_time: '06:00:00',
    end_time: '06:50:00',
    record_status: 'active',
  });

  t.deepEqual(storage.raw.shift(), `
WITH cte AS (DELETE FROM receptions WHERE start_time <= ? AND end_time > ? OR start_time < ? AND end_time >= ?)
INSERT INTO receptions (doctor_id, patient_id, date, start_time, end_time, record_status) VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
);

  t.deepEqual(storage.raw.shift(), [
    'deleted',
    '1',
    '06:00:00',
    '06:00:00',
    '06:50:00',
    '06:50:00',
    '1',
    null,
    '2020-01-01',
    '06:00:00',
    '06:50:00',
    'active',
  ]);
});

test(`reception.model.getReception`, async t => {

  await rm.getReception({id: 1});

  t.deepEqual(storage.select.shift(), '*');
  t.deepEqual(storage.from.shift(), 'receptions');
  t.deepEqual(storage.where.shift().id, 1);
});

test(`reception.model.delete`, async t => {

  await rm.delete({id: 1});

  t.deepEqual(storage.model.shift(), 'receptions');
  t.deepEqual(storage.update.shift().hasOwnProperty('record_status'), true);
  t.deepEqual(storage.where.shift().id, 1);
  t.deepEqual(storage.returning.shift(), 'id');
});

test(`reception.model.createOrUpdateMany`, async t => {

  await rm.createOrUpdateMany({
    doctor_id: '1',
    date: '2020-01-01',
    start_interval: '06:00:00',
    end_interval: '06:50:00',
    intervals: [{
      start_time: '06:00:00',
      end_time: '06:30:00',
    }],
  });
  t.deepEqual(storage.with.shift(), 'cte');
  t.deepEqual(storage.raw, [
    'UPDATE receptions SET record_status = ? WHERE doctor_id = ? AND start_time <= ? AND end_time > ? OR start_time < ? AND end_time >= ?',
    [
      'deleted',
      '1',
      '06:00:00',
      '06:00:00',
      '06:50:00',
      '06:50:00',
    ]
  ]);
  t.deepEqual(storage.insert.shift(), [{
    doctor_id: '1',
    patient_id: null,
    date: '2020-01-01',
    start_time: '06:00:00',
    end_time: '06:30:00',
    record_status: 'active',
  }]);
  t.deepEqual(storage.into.shift(), 'receptions');
  t.deepEqual(storage.returning.shift(), 'id');
});

test(`reception.model.updateByPatient`, async t => {

  await rm.updateByPatient({
    id: '1',
    patient_id: '2',
    record_status: 'active',
  });

  t.deepEqual(storage.raw, [
    'WITH cte AS (UPDATE receptions SET patient_id = ? WHERE id = ? AND patient_id IS NULL AND record_status = ?) SELECT * FROM receptions WHERE id = ? AND record_status = ?',
    ['2', '1', 'active', '1', 'active',]
  ]);

  fakeDb.raw = _=> ({id: 1, patient_id: 3});

  let err = await t.throwsAsync(rm.updateByPatient({
    id: 1,
    patient_id: '2',
    record_status: 'active',
  }));

  t.deepEqual(err.code, 'RECEPTION_TAKEN');
  t.deepEqual(err.data, {id: 1});

  fakeDb.raw = _=> (null);

  err = await t.throwsAsync(rm.updateByPatient({
    id: 1,
    patient_id: '2',
    record_status: 'active',
  }));

  t.deepEqual(err.code, 'RECEPTION_NOT_FOUND');
  t.deepEqual(err.data, {id: 1});
});
