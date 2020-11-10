'use strict';

const test = require('ava'),
  rom = require('../role/role.model'),
  usm = require('./user.model');

test(`user.model.create`, async t => {

  let role = await rom.create({name: 'role', record_status: 'active'});

  t.deepEqual(role.id, 1);
  t.deepEqual(role.name, 'role');
  t.deepEqual(role.record_status, 'active');

  let user = await usm.create({

    role_id: 1,
    firstname: 'firstname1',
    middlename: 'middlename1',
    lastname: 'lastname1',
    gender: 'male',
    age: 30,
    phone: '+79001112233',
    record_status: 'active'
  });

  t.deepEqual(user.id, 1);
  t.deepEqual(user.role_id, 1);
  t.deepEqual(user.firstname, 'firstname1');
  t.deepEqual(user.middlename, 'middlename1');
  t.deepEqual(user.lastname, 'lastname1');
  t.deepEqual(user.gender, 'male');
  t.deepEqual(user.age, 30);
  t.deepEqual(user.phone, '+79001112233');
  t.deepEqual(user.record_status, 'active');

  user = await usm.create({

    role_id: 1,
    firstname: 'firstname2',
    middlename: 'middlename2',
    lastname: 'lastname2',
    gender: 'male',
    age: 30,
    phone: '+79001112233',
    record_status: 'active'
  });

  t.deepEqual(user.firstname, 'firstname2');

  user = await usm.create({

    role_id: 1,
    firstname: 'firstname3',
    middlename: 'middlename3',
    lastname: 'lastname3',
    gender: 'male',
    age: 30,
    phone: '+79001112233',
    record_status: 'active'
  });

  t.deepEqual(user.firstname, 'firstname3');

  let err = await t.throwsAsync(_=> usm.create({
    role_id: 2,
    firstname: 'firstname',
    middlename: 'middlename',
    lastname: 'lastname',
    gender: 'male',
    age: 30,
    phone: '+79001112233',
    record_status: 'active'
  }));

  t.deepEqual(err.code, '23503'); // role not present in table
});

test(`user.model.getUsers`, async t => {

  let user = await usm.getUsers({limit: 10, offset: 0, record_status: 'active'});

  t.deepEqual(user.length, 3);
  t.deepEqual(user[0].firstname, 'firstname1');
  t.deepEqual(user[1].firstname, 'firstname2');
  t.deepEqual(user[2].firstname, 'firstname3');

  user = await usm.getUsers({limit: 1, offset: 1, record_status: 'active'});

  t.deepEqual(user.firstname, 'firstname2');
});

test(`user.model.getUser`, async t => {

  let user = await usm.getUser({id: 1, record_status: 'active'});

  t.deepEqual(user.id, 1);
  t.deepEqual(user.firstname, 'firstname1');
});

test(`user.model.update`, async t => {

  let user = await usm.update({id: 1, firstname: 'new firstname', record_status: 'active'});

  t.deepEqual(user.id, 1);
  t.deepEqual(user.firstname, 'new firstname');
  t.deepEqual(user.record_status, 'active');

  user = await usm.getUser({id: 1, record_status: 'active'});

  t.deepEqual(user.id, 1);
  t.deepEqual(user.firstname, 'new firstname');
});

test(`user.model.delete`, async t => {

  let user = await usm.delete({id: 1, record_status: 'active'});

  t.deepEqual(user.id, 1);
  t.deepEqual(user.firstname, 'new firstname');

  user = await usm.getUser({id: 1, record_status: 'deleted'});

  t.deepEqual(user, null);
});
