'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  stringify = require('./stringify'),
  stf = sinon.spy(stringify),
  vld = sinon.spy(_=> true),
  snt = sinon.spy(),
  sanitizers = {
    name: {
      validate: vld,
      sanitize: snt,
    },
  };

/* replace 'stringify' cache for './make.sanitize' */
delete require.cache[require.resolve('./stringify')];
require.cache[require.resolve('./stringify')] = {
  exports: stf,
};

const makeSanitize = require('./make.sanitize'),
  sanitize = makeSanitize(sanitizers);

test.afterEach(t => {

  stf.resetHistory();
  vld.resetHistory();
  snt.resetHistory();
});

test(`sanitize something`, t => {

  t.deepEqual(sanitize(null), null);
  t.deepEqual(sanitize([]), []);
  t.deepEqual(sanitize(''), '');
});

test(`stringify called`, t => {

  sanitize({name: 123});
  t.deepEqual(stf.callCount, 1);
});

test(`field not allowed`, t => {

  const err = t.throws(_=> sanitize({abc: 'abc'}));
  t.deepEqual(err.code, 'SERVICE_ERROR');
  t.deepEqual(err.data.name, undefined);
});

test(`field required`, t => {

  const err = t.throws(_=> sanitize({name: undefined}, 'name'));
  t.deepEqual(err.code, 'SERVICE_ERROR');
  t.deepEqual(err.data.name, undefined);
});

test(`validate, sanitize called`, t => {

  sanitize({name: 'name'});
  t.deepEqual(vld.callCount, 1);
  t.deepEqual(snt.callCount, 1);
});
