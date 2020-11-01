'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  mod = require('../../modules');

mod.makeSanitize = _=>_;

const sanitizer = require('./user.sanitize');

test(`user sanitize`, t => {

  /* userId */
  let err = t.throws(_=> sanitizer.userId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.userId.validate(''), false);
  t.deepEqual(sanitizer.userId.validate('a'), false);
  t.deepEqual(sanitizer.userId.validate('0'), false);
  t.deepEqual(sanitizer.userId.validate('1'), true);

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

  /* roleId */
  err = t.throws(_=> sanitizer.roleId.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.roleId.validate(''), false);
  t.deepEqual(sanitizer.roleId.validate('a'), false);
  t.deepEqual(sanitizer.roleId.validate('0'), false);
  t.deepEqual(sanitizer.roleId.validate('1'), true);

  /* firstname */
  err = t.throws(_=> sanitizer.firstname.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.firstname.validate(''), false);
  t.deepEqual(sanitizer.firstname.validate('a'), true);
  t.deepEqual(sanitizer.firstname.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), true);
  t.deepEqual(sanitizer.firstname.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), false);

  /* middlename */
  err = t.throws(_=> sanitizer.middlename.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.middlename.validate(''), false);
  t.deepEqual(sanitizer.middlename.validate('a'), true);
  t.deepEqual(sanitizer.middlename.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), true);
  t.deepEqual(sanitizer.middlename.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), false);

  /* lastname */
  err = t.throws(_=> sanitizer.lastname.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.lastname.validate(''), false);
  t.deepEqual(sanitizer.lastname.validate('a'), true);
  t.deepEqual(sanitizer.lastname.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), true);
  t.deepEqual(sanitizer.lastname.validate('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'), false);

  /* gender */
  t.deepEqual(sanitizer.gender.validate(), false);
  t.deepEqual(sanitizer.gender.validate(''), false);
  t.deepEqual(sanitizer.gender.validate('something'), false);
  t.deepEqual(sanitizer.gender.validate('male'), true);
  t.deepEqual(sanitizer.gender.validate('female'), true);

  /* age */
  err = t.throws(_=> sanitizer.age.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.age.validate(''), false);
  t.deepEqual(sanitizer.age.validate('a'), false);
  t.deepEqual(sanitizer.age.validate('0'), false);
  t.deepEqual(sanitizer.age.validate('201'), false);
  t.deepEqual(sanitizer.age.validate('1'), true);
  t.deepEqual(sanitizer.age.validate('200'), true);

  /* phone */
  err = t.throws(_=> sanitizer.phone.validate());
  t.deepEqual(err.message, 'Expected string but received a undefined.');
  t.deepEqual(sanitizer.phone.validate(''), false);
  t.deepEqual(sanitizer.phone.validate('11-22-33'), false);
  t.deepEqual(sanitizer.phone.validate('111-22-33'), false);
  t.deepEqual(sanitizer.phone.validate('+7(900)1112233'), false);
  t.deepEqual(sanitizer.phone.validate('8(900)1112233'), false);
  t.deepEqual(sanitizer.phone.validate('+7(900)111-22-33'), false);
  t.deepEqual(sanitizer.phone.validate('8(900)111-22-33'), false);
  t.deepEqual(sanitizer.phone.validate('69001112233'), false);
  t.deepEqual(sanitizer.phone.validate('99001112233'), false);
  t.deepEqual(sanitizer.phone.validate('88001112233'), false);
  t.deepEqual(sanitizer.phone.validate('79001112233'), true);
  t.deepEqual(sanitizer.phone.validate('+79001112233'), true);
  t.deepEqual(sanitizer.phone.validate('89001112233'), true);
});
