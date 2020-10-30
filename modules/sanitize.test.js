'use strict';

const test = require('ava'),
  sinon = require('sinon'),
  sanitize = require('../modules/sanitize');

test(`sanitize nothing`, t => {

  t.deepEqual(sanitize('abc', null), null);
});

test(`no model`, t => {

  const error = t.throws(_=> sanitize('some', {}));
  t.deepEqual(error.code, 'SERVICE_ERROR');
  t.deepEqual(error.data.model, 'some');
});

test(`stringified`, t => {

  const data = sanitize('role', {name: 123});
  t.deepEqual(data.name, '123');
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

test(`validating`, t => {

  const error = t.throws(_=> sanitize('role', {name: ''}, 'name'));
  t.deepEqual(error.code, 'SERVICE_ERROR');
  t.deepEqual(error.data.name, '');
});

test(`sanitizing`, t => {

  const data = sanitize('role', {name: '<>&/"'}, 'name');
  t.deepEqual(data.name, '&lt;&gt;&amp;&#x2F;&quot;');
});
