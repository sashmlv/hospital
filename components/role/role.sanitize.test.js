'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  mod = require('../../modules');

mod.makeSanitize = _=>_;

const sanitizer = require('./role.sanitize');

test(`role sanitize`, t => {

  /* roleId */
  let err = t.throws(_=> sanitizer.roleId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.roleId.validate(''), false);
  t.deepEqual(sanitizer.roleId.validate('a'), false);
  t.deepEqual(sanitizer.roleId.validate('0'), false);
  t.deepEqual(sanitizer.roleId.validate('1'), true);

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

  /* name */
  err = t.throws(_=> sanitizer.name.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.name.validate(''), false);
  t.deepEqual(sanitizer.name.validate('a'), true);
  t.deepEqual(sanitizer.name.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), true);
  t.deepEqual(sanitizer.name.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), false);
});
