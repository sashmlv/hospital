'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  rc = require('./reception.controller'),
  rm = require('./reception.model'),
  {APP} = require('../../libs/config');

rm.getReceptions = sinon.spy((...args) => [...args]);
rm.createOrUpdate = sinon.spy((...args) => [...args]);
rm.getReception = sinon.spy((...args) => [...args]);
rm.delete = sinon.spy((...args) => [...args]);
rm.createOrUpdateMany = sinon.spy((...args) => [...args]);
rm.updateByPatient = sinon.spy((...args) => [...args]);

test(`reception.controller.getReceptions`, async t => {

  let [data] = await rc.getReceptions();
  t.deepEqual(+data.limit, 100);
  t.deepEqual(+data.offset, 0);
  t.deepEqual(rm.getReceptions.callCount, 1);

  [data] = await rc.getReceptions({limit: 10, page: 2});
  t.deepEqual(+data.limit, 10);
  t.deepEqual(+data.offset, 10);
  t.deepEqual(rm.getReceptions.callCount, 2);
});

test(`reception.controller.createOrUpdate`, async t => {

  let err = await t.throwsAsync(rc.createOrUpdate({ // bad duration
    doctorId: '1',
    date: '2020-01-01',
    startTime: '06:00:00',
    endTime: '06:50:00',
  }));

  t.deepEqual(err.code, 'SERVICE_ERROR');
  t.deepEqual(err.data.startTime, '06:00:00');
  t.deepEqual(err.data.endTime, '06:50:00');
  t.deepEqual(err.data.difference, 50);

  let data = await rc.createOrUpdate({ // success
    doctorId: '1',
    date: '2020-01-01',
    startTime: '06:00:00',
    endTime: `06:${APP.RECEPTION_DURATION}:00`,
  });
  t.deepEqual(rm.createOrUpdate.callCount, 1);
  t.truthy(data.id);

  err = await t.throwsAsync(rc.createOrUpdate({ // doctorId required
    date: '2020-01-01',
    startTime: '06:00:00',
    endTime: `06:${APP.RECEPTION_DURATION}:00`,
  }));
  t.deepEqual(err.code, 'SERVICE_ERROR');

  err = await t.throwsAsync(rc.createOrUpdate({ // date required
    doctorId: '1',
    startTime: '06:00:00',
    endTime: `06:${APP.RECEPTION_DURATION}:00`,
  }));
  t.deepEqual(err.code, 'SERVICE_ERROR');

  err = await t.throwsAsync(rc.createOrUpdate({ // startTime required
    doctorId: '1',
    date: '2020-01-01',
    endTime: `06:${APP.RECEPTION_DURATION}:00`,
  }));
  t.deepEqual(err.code, 'SERVICE_ERROR');

  err = await t.throwsAsync(rc.createOrUpdate({ // endTime required
    doctorId: '1',
    date: '2020-01-01',
    startTime: '06:00:00',
  }));
  t.deepEqual(err.code, 'SERVICE_ERROR');
});

test(`reception.controller.getReception`, async t => {

  let [data] = await rc.getReception({receptionId: 1}); // success
  t.deepEqual(rm.getReception.callCount, 1);
  t.deepEqual(+data.id, 1);

  let err = await t.throwsAsync(rc.getReception({})); // receptionId required
  t.deepEqual(err.code, 'SERVICE_ERROR');
});

test(`reception.controller.delete`, async t => {

  let data = await rc.delete({receptionId: 1}); // success
  t.deepEqual(rm.delete.callCount, 1);
  t.truthy(data.id);

  let err = await t.throwsAsync(rc.delete({})); // receptionId required
  t.deepEqual(err.code, 'SERVICE_ERROR');
});

test(`reception.controller.createOrUpdateReceptionsInterval`, async t => {

  let err = await t.throwsAsync(rc.createOrUpdateReceptionsInterval({ // bad duration interval
    doctorId: '1',
    date: '2020-01-01',
    startInterval: '06:00:00',
    endInterval: '06:50:00',
  }));

  t.deepEqual(err.code, 'SERVICE_ERROR');
  t.deepEqual(err.data.startInterval, '06:00:00');
  t.deepEqual(err.data.endInterval, '06:50:00');

  let data = await rc.createOrUpdateReceptionsInterval({ // success
    doctorId: '1',
    date: '2020-01-01',
    startInterval: '06:00:00',
    endInterval: `07:${APP.RECEPTION_DURATION}:00`,
  });

  t.deepEqual(rm.createOrUpdateMany.callCount, 1);
  t.truthy(data.ids);
  t.deepEqual(data.ids[0].doctor_id, '1');
  t.deepEqual(data.ids[0].patient_id, null);
  t.deepEqual(data.ids[0].date, '2020-01-01');
  t.deepEqual(data.ids[0].start_interval, '06:00:00');
  t.deepEqual(data.ids[0].end_interval,`07:${APP.RECEPTION_DURATION}:00`);
  t.deepEqual(data.ids[0].intervals.length, 3);

  err = await t.throwsAsync(rc.createOrUpdateReceptionsInterval({ // doctorId required
    date: '2020-01-01',
    startInterval: '06:00:00',
    endInterval: `07:${APP.RECEPTION_DURATION}:00`,
  }));
  t.deepEqual(err.code, 'SERVICE_ERROR');

  err = await t.throwsAsync(rc.createOrUpdateReceptionsInterval({ // date required
    doctorId: '1',
    startInterval: '06:00:00',
    endInterval: `07:${APP.RECEPTION_DURATION}:00`,
  }));
  t.deepEqual(err.code, 'SERVICE_ERROR');

  err = await t.throwsAsync(rc.createOrUpdateReceptionsInterval({ // startInterval required
    doctorId: '1',
    date: '2020-01-01',
    endInterval: `07:${APP.RECEPTION_DURATION}:00`,
  }));
  t.deepEqual(err.code, 'SERVICE_ERROR');

  err = await t.throwsAsync(rc.createOrUpdateReceptionsInterval({ // endInterval required
    doctorId: '1',
    date: '2020-01-01',
    startInterval: '06:00:00',
  }));
  t.deepEqual(err.code, 'SERVICE_ERROR');
});

test(`reception.controller.receptionTake`, async t => {

  let [data] = await rc.receptionTake({ // success
    receptionId: '1',
    patientId: '1',
  });

  t.deepEqual(rm.updateByPatient.callCount, 1);
  t.deepEqual(data.id, '1');
  t.deepEqual(data.patient_id, '1');

  let err = await t.throwsAsync(rc.receptionTake({ // receptionId required
    patientId: '1',
  }));
  t.deepEqual(err.code, 'SERVICE_ERROR');

  err = await t.throwsAsync(rc.receptionTake({ // patientId required
    receptionId: '1',
  }));
  t.deepEqual(err.code, 'SERVICE_ERROR');
});
