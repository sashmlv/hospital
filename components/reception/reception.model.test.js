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
  });

  t.deepEqual(storage.raw.shift(), `
WITH cte AS (DELETE FROM receptions WHERE start_time <= ? AND end_time > ? OR start_time < ? AND end_time >= ?)
INSERT INTO receptions (doctor_id, patient_id, date, start_time, end_time) VALUES (?, ?, ?, ?, ?) RETURNING id`
);

  t.deepEqual(storage.raw.shift(), [
    '06:00:00',
    '06:00:00',
    '06:50:00',
    '06:50:00',
    '1',
    null,
    '2020-01-01',
    '06:00:00',
    '06:50:00',
  ]);
});

test(`reception.model.getReception`, async t => {

  await rm.getReception({id: 1});

  t.deepEqual(storage.select.shift(), '*');
  t.deepEqual(storage.from.shift(), 'receptions');
  t.deepEqual(storage.where.shift(), {id: 1});
});

test(`reception.model.delete`, async t => {

  await rm.delete({id: 1});

  t.deepEqual(storage.model.shift(), 'receptions');
  t.deepEqual(storage.del.shift(), undefined);
  t.deepEqual(storage.where.shift(), {id: 1});
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
    'DELETE FROM receptions WHERE start_time <= ? AND end_time > ? OR start_time < ? AND end_time >= ?',
    [
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
  }]);
  t.deepEqual(storage.into.shift(), 'receptions');
  t.deepEqual(storage.returning.shift(), 'id');
});

test(`reception.model.updateByPatient`, async t => {

  await rm.updateByPatient({
    id: '1',
    patient_id: '2',
  });

  t.deepEqual(storage.raw, [
    'WITH cte AS (UPDATE receptions SET patient_id = ? WHERE id = ? AND patient_id IS NULL) SELECT * FROM receptions WHERE id = ?',
    ['2', '1', '1',]
  ]);

  fakeDb.raw = _=> ({id: 10, patient_id: 3});

  let err = await t.throwsAsync(rm.updateByPatient({
    id: '1',
    patient_id: '2',
  }));

  t.deepEqual(err.code, 'SERVICE_ERROR'); // already taken
  t.deepEqual(err.data, {id: 10});

  fakeDb.raw = _=> (null);

  t.deepEqual(err.code, 'SERVICE_ERROR'); // not found
  t.deepEqual(err.data, {id: 10});
});
