'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  {
    role,
    reception,
    user,
  } = require('./sanitizers');

test(`role`, t => {

  /* roleId */
  let err = t.throws(_=> role.roleId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(role.roleId.validate(''), false);
  t.deepEqual(role.roleId.validate('a'), false);
  t.deepEqual(role.roleId.validate('0'), false);
  t.deepEqual(role.roleId.validate('1'), true);

  /* page */
  err = t.throws(_=> role.page.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(role.page.validate(''), false);
  t.deepEqual(role.page.validate('a'), false);
  t.deepEqual(role.page.validate('0'), false);
  t.deepEqual(role.page.validate('1'), true);

  /* limit */
  err = t.throws(_=> role.limit.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(role.limit.validate(''), false);
  t.deepEqual(role.limit.validate('a'), false);
  t.deepEqual(role.limit.validate('0'), true);
  t.deepEqual(role.limit.validate('1'), true);

  /* name */
  err = t.throws(_=> role.name.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(role.name.validate(''), false);
  t.deepEqual(role.name.validate('a'), true);
  t.deepEqual(role.name.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), true);
  t.deepEqual(role.name.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), false);
});

test(`reception`, t => {

  /* receptionId */
  let err = t.throws(_=> reception.receptionId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(reception.receptionId.validate(''), false);
  t.deepEqual(reception.receptionId.validate('a'), false);
  t.deepEqual(reception.receptionId.validate('0'), false);
  t.deepEqual(reception.receptionId.validate('1'), true);

  /* page */
  err = t.throws(_=> reception.page.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(reception.page.validate(''), false);
  t.deepEqual(reception.page.validate('a'), false);
  t.deepEqual(reception.page.validate('0'), false);
  t.deepEqual(reception.page.validate('1'), true);

  /* limit */
  err = t.throws(_=> reception.limit.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(reception.limit.validate(''), false);
  t.deepEqual(reception.limit.validate('a'), false);
  t.deepEqual(reception.limit.validate('0'), true);
  t.deepEqual(reception.limit.validate('1'), true);

  /* doctorId */
  err = t.throws(_=> reception.doctorId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(reception.doctorId.validate(''), false);
  t.deepEqual(reception.doctorId.validate('a'), false);
  t.deepEqual(reception.doctorId.validate('0'), false);
  t.deepEqual(reception.doctorId.validate('1'), true);

  /* patientId */
  err = t.throws(_=> reception.patientId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(reception.patientId.validate(''), false);
  t.deepEqual(reception.patientId.validate('a'), false);
  t.deepEqual(reception.patientId.validate('0'), false);
  t.deepEqual(reception.patientId.validate('1'), true);

  /* date */
  t.deepEqual(reception.date.validate(), false);
  t.deepEqual(reception.date.validate(1), false);
  t.deepEqual(reception.date.validate('20-12-01'), false);
  t.deepEqual(reception.date.validate('2020-13-01'), false);
  t.deepEqual(reception.date.validate('2020-12-32'), false);
  t.deepEqual(reception.date.validate('2020-12-01'), true);

  /* startTime */
  t.deepEqual(reception.startTime.validate(), false);
  t.deepEqual(reception.startTime.validate(1), false);
  t.deepEqual(reception.startTime.validate('0:0:0'), false);
  t.deepEqual(reception.startTime.validate('1:00:00'), false);
  t.deepEqual(reception.startTime.validate('24:00:00'), false);
  t.deepEqual(reception.startTime.validate('24:60:60'), false);
  t.deepEqual(reception.startTime.validate('00:00:00'), true);
  t.deepEqual(reception.startTime.validate('15:15:15'), true);
  t.deepEqual(reception.startTime.validate('23:59:59'), true);

  /* endTime */
  t.deepEqual(reception.endTime.validate(), false);
  t.deepEqual(reception.endTime.validate(1), false);
  t.deepEqual(reception.endTime.validate('0:0:0'), false);
  t.deepEqual(reception.endTime.validate('1:00:00'), false);
  t.deepEqual(reception.endTime.validate('24:00:00'), false);
  t.deepEqual(reception.endTime.validate('24:60:60'), false);
  t.deepEqual(reception.endTime.validate('00:00:00'), true);
  t.deepEqual(reception.endTime.validate('15:15:15'), true);
  t.deepEqual(reception.endTime.validate('23:59:59'), true);

  /* startInterval */
  t.deepEqual(reception.startInterval.validate(), false);
  t.deepEqual(reception.startInterval.validate(1), false);
  t.deepEqual(reception.startInterval.validate('0:0:0'), false);
  t.deepEqual(reception.startInterval.validate('1:00:00'), false);
  t.deepEqual(reception.startInterval.validate('24:00:00'), false);
  t.deepEqual(reception.startInterval.validate('24:60:60'), false);
  t.deepEqual(reception.startInterval.validate('00:00:00'), true);
  t.deepEqual(reception.startInterval.validate('15:15:15'), true);
  t.deepEqual(reception.startInterval.validate('23:59:59'), true);

  /* endInterval */
  t.deepEqual(reception.endInterval.validate(), false);
  t.deepEqual(reception.endInterval.validate(1), false);
  t.deepEqual(reception.endInterval.validate('0:0:0'), false);
  t.deepEqual(reception.endInterval.validate('1:00:00'), false);
  t.deepEqual(reception.endInterval.validate('24:00:00'), false);
  t.deepEqual(reception.endInterval.validate('24:60:60'), false);
  t.deepEqual(reception.endInterval.validate('00:00:00'), true);
  t.deepEqual(reception.endInterval.validate('15:15:15'), true);
  t.deepEqual(reception.endInterval.validate('23:59:59'), true);
});

test(`user`, t => {

  /* userId */
  let err = t.throws(_=> user.userId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(user.userId.validate(''), false);
  t.deepEqual(user.userId.validate('a'), false);
  t.deepEqual(user.userId.validate('0'), false);
  t.deepEqual(user.userId.validate('1'), true);

  /* page */
  err = t.throws(_=> user.page.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(user.page.validate(''), false);
  t.deepEqual(user.page.validate('a'), false);
  t.deepEqual(user.page.validate('0'), false);
  t.deepEqual(user.page.validate('1'), true);

  /* limit */
  err = t.throws(_=> user.limit.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(user.limit.validate(''), false);
  t.deepEqual(user.limit.validate('a'), false);
  t.deepEqual(user.limit.validate('0'), true);
  t.deepEqual(user.limit.validate('1'), true);

  /* roleId */
  err = t.throws(_=> user.roleId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(user.roleId.validate(''), false);
  t.deepEqual(user.roleId.validate('a'), false);
  t.deepEqual(user.roleId.validate('0'), false);
  t.deepEqual(user.roleId.validate('1'), true);

  /* firstname */
  err = t.throws(_=> user.firstname.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(user.firstname.validate(''), false);
  t.deepEqual(user.firstname.validate('a'), true);
  t.deepEqual(user.firstname.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), true);
  t.deepEqual(user.firstname.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), false);

  /* middlename */
  err = t.throws(_=> user.middlename.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(user.middlename.validate(''), false);
  t.deepEqual(user.middlename.validate('a'), true);
  t.deepEqual(user.middlename.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), true);
  t.deepEqual(user.middlename.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), false);

  /* lastname */
  err = t.throws(_=> user.lastname.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(user.lastname.validate(''), false);
  t.deepEqual(user.lastname.validate('a'), true);
  t.deepEqual(user.lastname.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), true);
  t.deepEqual(user.lastname.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), false);

  /* gender */
  t.deepEqual(user.gender.validate(), false);
  t.deepEqual(user.gender.validate(''), false);
  t.deepEqual(user.gender.validate('something'), false);
  t.deepEqual(user.gender.validate('male'), true);
  t.deepEqual(user.gender.validate('female'), true);

  /* age */
  err = t.throws(_=> user.age.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(user.age.validate(''), false);
  t.deepEqual(user.age.validate('a'), false);
  t.deepEqual(user.age.validate('0'), false);
  t.deepEqual(user.age.validate('201'), false);
  t.deepEqual(user.age.validate('1'), true);
  t.deepEqual(user.age.validate('200'), true);

  /* phone */
  err = t.throws(_=> user.phone.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(user.phone.validate(''), false);
  t.deepEqual(user.phone.validate('11-22-33'), false);
  t.deepEqual(user.phone.validate('111-22-33'), false);
  t.deepEqual(user.phone.validate('+7(900)1112233'), false);
  t.deepEqual(user.phone.validate('8(900)1112233'), false);
  t.deepEqual(user.phone.validate('+7(900)111-22-33'), false);
  t.deepEqual(user.phone.validate('8(900)111-22-33'), false);
  t.deepEqual(user.phone.validate('69001112233'), false);
  t.deepEqual(user.phone.validate('99001112233'), false);
  t.deepEqual(user.phone.validate('88001112233'), false);
  t.deepEqual(user.phone.validate('79001112233'), true);
  t.deepEqual(user.phone.validate('+79001112233'), true);
  t.deepEqual(user.phone.validate('89001112233'), true);
});
