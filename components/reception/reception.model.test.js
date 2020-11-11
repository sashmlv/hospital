'use strict';

const test = require('ava'),
  db = require('../../libs/db-sql'),
  rom = require('../role/role.model'),
  usm = require('../user/user.model'),
  rem = require('./reception.model');

test.before(async t => await db.raw(`
TRUNCATE roles RESTART IDENTITY CASCADE;
TRUNCATE users RESTART IDENTITY CASCADE;
TRUNCATE receptions RESTART IDENTITY CASCADE;
`));

/* create */
test(`reception.model.createOrUpdate (create)`, async t => {

  let role = await rom.create({

    name: 'role',
    record_status: 'active',
  });

  t.deepEqual(role.id, 1);

  let user = await usm.create({

    role_id: 1,
    firstname: 'firstname1',
    middlename: 'middlename1',
    lastname: 'lastname1',
    gender: 'male',
    age: 30,
    phone: '+79001112233',
    record_status: 'active',
  });

  t.deepEqual(user.id, 1);

  let reception = await rem.createOrUpdate({

    doctor_id: '1',
    date: '2020-01-01',
    start_time: '06:00:00',
    end_time: '06:30:00',
    record_status: 'active',
  });

  t.deepEqual(reception.id, 1);
  t.deepEqual(reception.doctor_id, 1);
  t.deepEqual(reception.patient_id, null);
  t.deepEqual(reception.date, new Date('2019-12-31T21:00:00.000Z'));
  t.deepEqual(reception.start_time, '06:00:00');
  t.deepEqual(reception.end_time, '06:30:00');
  t.deepEqual(reception.record_status, 'active');

  reception = await rem.createOrUpdate({

    doctor_id: '1',
    date: '2020-01-01',
    start_time: '07:00:00',
    end_time: '07:30:00',
    record_status: 'active',
  });

  t.deepEqual(reception.id, 2);

  reception = await rem.createOrUpdate({

    doctor_id: '1',
    date: '2020-01-01',
    start_time: '08:00:00',
    end_time: '08:30:00',
    record_status: 'active',
  });

  t.deepEqual(reception.id, 3);

  /* doctor_id is not present in table "users" */
  let err = await t.throwsAsync(_=> rem.createOrUpdate({

    doctor_id: '2',
    date: '2020-01-01',
    start_time: '06:00:00',
    end_time: '06:50:00',
    record_status: 'active',
  }));

  t.deepEqual(err.code, '23503');

  /* failing row contains some */
  err = await t.throwsAsync(_=> rem.createOrUpdate({

    doctor_id: '1',
    date: '2020-01-01',
    start_time: '06:00:00',
    end_time: '06:50:00',
    record_status: 'some',
  }));

  t.deepEqual(err.code, '23514');
});

test(`reception.model.getReceptions`, async t => {

  let reception = await rem.getReceptions({

    limit: 10,
    offset: 0,
    record_status: 'active',
  });

  t.deepEqual(reception.length, 3);
  t.deepEqual(reception[0].start_time, '06:00:00');
  t.deepEqual(reception[1].start_time, '07:00:00');
  t.deepEqual(reception[2].start_time, '08:00:00');

  reception = await rem.getReceptions({

    limit: 1,
    offset: 1,
    record_status: 'active',
  });

  t.deepEqual(reception.start_time, '07:00:00');
});

test(`reception.model.getReception`, async t => {

  let reception = await rem.getReception({id: 1, record_status: 'active'});

  t.deepEqual(reception.id, 1);
  t.deepEqual(reception.start_time, '06:00:00');
});

/* update */
test(`reception.model.createOrUpdate (update)`, async t => {

  /* update first reception (with id 1) */
  let reception = await rem.createOrUpdate({

    doctor_id: '1',
    date: '2020-01-01',
    start_time: '06:10:00',
    end_time: '06:40:00',
    record_status: 'active',
  });

  t.deepEqual(reception.start_time, '06:10:00');
  t.deepEqual(reception.end_time, '06:40:00');

  /* replaceed by new */
  reception = await rem.getReception({id: 1, record_status: 'active'});

  t.deepEqual(reception, null);
});

test(`reception.model.delete`, async t => {

  let reception = await rem.delete({id: 2, record_status: 'deleted'});

  t.deepEqual(reception.id, 2);
  t.deepEqual(reception.start_time, '07:00:00');

  reception = await rem.getReception({id: 2, record_status: 'active'});

  t.deepEqual(reception, null);
});

test(`reception.model.createOrUpdateMany`, async t => {

  let receptions = await rem.createOrUpdateMany({

    doctor_id: '1',
    date: '2020-01-01',
    start_interval: '06:00:00',
    end_interval: '07:00:00',
    intervals: [
      {
        start_time: '06:00:00',
        end_time: '06:30:00',
      },
      {
        start_time: '06:30:00',
        end_time: '07:00:00',
      },
    ],
  });

  t.deepEqual(receptions.length, 2);
  t.deepEqual(receptions[0].id, 7);
  t.deepEqual(receptions[0].doctor_id, 1);
  t.deepEqual(receptions[0].patient_id, null);
  t.deepEqual(receptions[0].date, new Date('2019-12-31T21:00:00.000Z'));
  t.deepEqual(receptions[0].start_time, '06:00:00');
  t.deepEqual(receptions[0].end_time, '06:30:00');
  t.deepEqual(receptions[0].record_status, 'active');
  t.deepEqual(receptions[1].id, 8);
  t.deepEqual(receptions[1].doctor_id, 1);
  t.deepEqual(receptions[1].patient_id, null);
  t.deepEqual(receptions[1].date, new Date('2019-12-31T21:00:00.000Z'));
  t.deepEqual(receptions[1].start_time, '06:30:00');
  t.deepEqual(receptions[1].end_time, '07:00:00');
  t.deepEqual(receptions[1].record_status, 'active');

  receptions = await rem.createOrUpdateMany({

    doctor_id: '1',
    date: '2020-01-01',
    start_interval: '06:10:00',
    end_interval: '07:10:00',
    intervals: [
      {
        start_time: '06:10:00',
        end_time: '06:40:00',
      },
      {
        start_time: '06:40:00',
        end_time: '07:10:00',
      },
    ],
  });

  t.deepEqual(receptions.length, 2);
  t.deepEqual(receptions[0].id, 9);
  t.deepEqual(receptions[0].doctor_id, 1);
  t.deepEqual(receptions[0].patient_id, null);
  t.deepEqual(receptions[0].date, new Date('2019-12-31T21:00:00.000Z'));
  t.deepEqual(receptions[0].start_time, '06:10:00');
  t.deepEqual(receptions[0].end_time, '06:40:00');
  t.deepEqual(receptions[0].record_status, 'active');
  t.deepEqual(receptions[1].id, 10);
  t.deepEqual(receptions[1].doctor_id, 1);
  t.deepEqual(receptions[1].patient_id, null);
  t.deepEqual(receptions[1].date, new Date('2019-12-31T21:00:00.000Z'));
  t.deepEqual(receptions[1].start_time, '06:40:00');
  t.deepEqual(receptions[1].end_time, '07:10:00');
  t.deepEqual(receptions[1].record_status, 'active');

  /* replaced receptions */
  let reception = await rem.getReception({id: 7, record_status: 'active'});

  t.deepEqual(reception, null);

  reception = await rem.getReception({id: 8, record_status: 'active'});

  t.deepEqual(reception, null);
});

test(`reception.model.updateByPatient`, async t => {

  let reception = await rem.updateByPatient({

    id: '3',
    patient_id: '1',
    record_status: 'active',
  });

  t.deepEqual(reception.id, 3);
  t.deepEqual(reception.doctor_id, 1);
  t.deepEqual(reception.patient_id, 1);
  t.deepEqual(reception.date, new Date('2019-12-31T21:00:00.000Z'));
  t.deepEqual(reception.start_time, '08:00:00');
  t.deepEqual(reception.end_time, '08:30:00');
  t.deepEqual(reception.record_status, 'active');

  let user = await usm.create({

    role_id: 1,
    firstname: 'firstname2',
    middlename: 'middlename2',
    lastname: 'lastname2',
    gender: 'male',
    age: 30,
    phone: '+79001112233',
    record_status: 'active',
  });

  t.deepEqual(user.id, 2);

  let err = await t.throwsAsync(rem.updateByPatient({
    id: '3',
    patient_id: '2',
    record_status: 'active',
  }));

  t.deepEqual(err.code, 'RECEPTION_TAKEN');
  t.deepEqual(err.data, {id: 3});

  err = await t.throwsAsync(rem.updateByPatient({
    id: 1,
    patient_id: '2',
    record_status: 'active',
  }));

  t.deepEqual(err.code, 'RECEPTION_NOT_FOUND');
  t.deepEqual(err.data, {id: 1});
});
