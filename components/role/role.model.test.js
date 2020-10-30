'use strict';

const test = require('ava'),
  sinon = require('sinon');

let model,
  select,
  from,
  orderBy,
  limit,
  offset,
  insert,
  returning,
  update,
  where,
  del;

const dbCmd = arg => (model = arg, dbCmd);

dbCmd.select = sinon.spy(arg => (select = arg, dbCmd));
dbCmd.from = sinon.spy(arg => (from = arg, dbCmd));
dbCmd.orderBy = sinon.spy(arg => (orderBy = arg, dbCmd));
dbCmd.limit = sinon.spy(arg => (limit = arg, dbCmd));
dbCmd.offset = sinon.spy(arg => (offset = arg, dbCmd));
dbCmd.insert = sinon.spy(arg => (insert = arg, dbCmd));
dbCmd.returning = sinon.spy(arg => (returning = arg, dbCmd));
dbCmd.update = sinon.spy(arg => (update = arg, dbCmd));
dbCmd.where = sinon.spy(arg => (where = arg, dbCmd));
dbCmd.del = sinon.spy(arg => (del = arg, dbCmd));

/* replace 'db' cache for './role.model' */
delete require.cache[require.resolve('../../libs/db-sql')];
require.cache[require.resolve('../../libs/db-sql')] = {
  exports: dbCmd,
};

const rm = require('./role.model');

test.afterEach(t => {

  model = undefined;
  select = undefined;
  from = undefined;
  orderBy = undefined;
  limit = undefined;
  offset = undefined;
  insert = undefined;
  returning = undefined;
  update = undefined;
  where = undefined;
  del = undefined;

  dbCmd.select.resetHistory();
  dbCmd.from.resetHistory();
  dbCmd.orderBy.resetHistory();
  dbCmd.limit.resetHistory();
  dbCmd.offset.resetHistory();
  dbCmd.insert.resetHistory();
  dbCmd.returning.resetHistory();
  dbCmd.update.resetHistory();
  dbCmd.where.resetHistory();
  dbCmd.del.resetHistory();
});

test(`role.model.getRoles`, async t => {

  await rm.getRoles({limit: 10, offset: 10});
  t.deepEqual(select, '*');
  t.deepEqual(from, 'roles');
  t.deepEqual(orderBy, 'id');
  t.deepEqual(limit, 10);
  t.deepEqual(offset, 10);
});

test(`role.model.create`, async t => {

  await rm.create({name: 'name'});
  t.deepEqual(model, 'roles');
  t.deepEqual(insert, {name: 'name'});
  t.deepEqual(returning, 'id');
});

test(`role.model.getRole`, async t => {

  await rm.getRole({id: 1});
  t.deepEqual(select, '*');
  t.deepEqual(from, 'roles');
  t.deepEqual(where, {id: 1});
});

test(`role.model.update`, async t => {

  await rm.update({id: 1, name: 'name'});
  t.deepEqual(model, 'roles');
  t.deepEqual(update, {name: 'name'});
  t.deepEqual(where, {id: 1});
  t.deepEqual(returning, 'id');
});

test(`role.model.delete`, async t => {

  await rm.delete({id: 1});
  t.deepEqual(model, 'roles');
  t.deepEqual(del, undefined);
  t.deepEqual(where, {id: 1});
  t.deepEqual(returning, 'id');
});
