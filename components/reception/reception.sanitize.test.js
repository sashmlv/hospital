'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  mod = require('../../modules');

mod.makeSanitize = _=>_;

const sanitizer = require('./reception.sanitize');

test(`reception sanitize`, t => {

  /* receptionId */
  let err = t.throws(_=> sanitizer.receptionId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.receptionId.validate(''), false);
  t.deepEqual(sanitizer.receptionId.validate('a'), false);
  t.deepEqual(sanitizer.receptionId.validate('0'), false);
  t.deepEqual(sanitizer.receptionId.validate('1'), true);

  /* page */
  err = t.throws(_=> sanitizer.page.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.page.validate(''), false);
  t.deepEqual(sanitizer.page.validate('a'), false);
  t.deepEqual(sanitizer.page.validate('0'), false);
  t.deepEqual(sanitizer.page.validate('1'), true);

  /* limit */
  err = t.throws(_=> sanitizer.limit.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.limit.validate(''), false);
  t.deepEqual(sanitizer.limit.validate('a'), false);
  t.deepEqual(sanitizer.limit.validate('0'), true);
  t.deepEqual(sanitizer.limit.validate('1'), true);

  /* doctorId */
  err = t.throws(_=> sanitizer.doctorId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.doctorId.validate(''), false);
  t.deepEqual(sanitizer.doctorId.validate('a'), false);
  t.deepEqual(sanitizer.doctorId.validate('0'), false);
  t.deepEqual(sanitizer.doctorId.validate('1'), true);

  /* patientId */
  err = t.throws(_=> sanitizer.patientId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.patientId.validate(''), false);
  t.deepEqual(sanitizer.patientId.validate('a'), false);
  t.deepEqual(sanitizer.patientId.validate('0'), false);
  t.deepEqual(sanitizer.patientId.validate('1'), true);

  /* date */
  t.deepEqual(sanitizer.date.validate(), false);
  t.deepEqual(sanitizer.date.validate(1), false);
  t.deepEqual(sanitizer.date.validate('20-12-01'), false);
  t.deepEqual(sanitizer.date.validate('2020-13-01'), false);
  t.deepEqual(sanitizer.date.validate('2020-12-32'), false);
  t.deepEqual(sanitizer.date.validate('2020-12-01'), true);

  /* startTime */
  t.deepEqual(sanitizer.startTime.validate(), false);
  t.deepEqual(sanitizer.startTime.validate(1), false);
  t.deepEqual(sanitizer.startTime.validate('0:0:0'), false);
  t.deepEqual(sanitizer.startTime.validate('1:00:00'), false);
  t.deepEqual(sanitizer.startTime.validate('24:00:00'), false);
  t.deepEqual(sanitizer.startTime.validate('24:60:60'), false);
  t.deepEqual(sanitizer.startTime.validate('00:00:00'), true);
  t.deepEqual(sanitizer.startTime.validate('15:15:15'), true);
  t.deepEqual(sanitizer.startTime.validate('23:59:59'), true);

  /* endTime */
  t.deepEqual(sanitizer.endTime.validate(), false);
  t.deepEqual(sanitizer.endTime.validate(1), false);
  t.deepEqual(sanitizer.endTime.validate('0:0:0'), false);
  t.deepEqual(sanitizer.endTime.validate('1:00:00'), false);
  t.deepEqual(sanitizer.endTime.validate('24:00:00'), false);
  t.deepEqual(sanitizer.endTime.validate('24:60:60'), false);
  t.deepEqual(sanitizer.endTime.validate('00:00:00'), true);
  t.deepEqual(sanitizer.endTime.validate('15:15:15'), true);
  t.deepEqual(sanitizer.endTime.validate('23:59:59'), true);

  /* startInterval */
  t.deepEqual(sanitizer.startInterval.validate(), false);
  t.deepEqual(sanitizer.startInterval.validate(1), false);
  t.deepEqual(sanitizer.startInterval.validate('0:0:0'), false);
  t.deepEqual(sanitizer.startInterval.validate('1:00:00'), false);
  t.deepEqual(sanitizer.startInterval.validate('24:00:00'), false);
  t.deepEqual(sanitizer.startInterval.validate('24:60:60'), false);
  t.deepEqual(sanitizer.startInterval.validate('00:00:00'), true);
  t.deepEqual(sanitizer.startInterval.validate('15:15:15'), true);
  t.deepEqual(sanitizer.startInterval.validate('23:59:59'), true);

  /* endInterval */
  t.deepEqual(sanitizer.endInterval.validate(), false);
  t.deepEqual(sanitizer.endInterval.validate(1), false);
  t.deepEqual(sanitizer.endInterval.validate('0:0:0'), false);
  t.deepEqual(sanitizer.endInterval.validate('1:00:00'), false);
  t.deepEqual(sanitizer.endInterval.validate('24:00:00'), false);
  t.deepEqual(sanitizer.endInterval.validate('24:60:60'), false);
  t.deepEqual(sanitizer.endInterval.validate('00:00:00'), true);
  t.deepEqual(sanitizer.endInterval.validate('15:15:15'), true);
  t.deepEqual(sanitizer.endInterval.validate('23:59:59'), true);
});
