'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  sanitizers = require('./sanitizers'),
  stringify = require('./stringify'),
  stf = sinon.spy(stringify),
  vld = sinon.spy(_=> true),
  snt = sinon.spy();

/* replace 'stringify' cache for '../modules/sanitize' */
delete require.cache[require.resolve('./stringify')];
require.cache[require.resolve('./stringify')] = {
  exports: stf,
};

const sanitize = require('../modules/sanitize');

sanitizers.role.name.validate = vld;
sanitizers.role.name.sanitize = snt;

test.afterEach(t => {

  stf.resetHistory();
  vld.resetHistory();
  snt.resetHistory();
});

test(`sanitize nothing`, t => {

  t.deepEqual(sanitize('abc', null), null);
});

test(`no model`, t => {

  const error = t.throws(_=> sanitize('something', {}));
  t.deepEqual(error.code, 'SERVICE_ERROR');
  t.deepEqual(error.data.model, 'something');
});

test(`stringify called`, t => {

  sanitize('role', {name: 123});
  t.deepEqual(stf.callCount, 1);
});

test(`field not allowed`, t => {

  const error = t.throws(_=> sanitize('role', {abc: 'abc'}));
  t.deepEqual(error.code, 'SERVICE_ERROR');
  t.deepEqual(error.data.name, undefined);
});

test(`field required`, t => {

  const error = t.throws(_=> sanitize('role', {name: undefined}, 'name'));
  t.deepEqual(error.code, 'SERVICE_ERROR');
  t.deepEqual(error.data.name, undefined);
});

test(`validate, sanitize called`, t => {

  sanitize('role', {name: 'name'});
  t.deepEqual(vld.callCount, 1);
  t.deepEqual(snt.callCount, 1);
});
