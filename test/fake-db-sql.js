'use strict';

module.exports = function makeFakeDb() {

  const db = {
    setStorage: function setStorage(storage) {
      this.storage = storage;
      this.__proto__.storage = this.storage;
      return this;
    },
    select: function select(...args) {
      this.storage.select = [...args];
      return this;
    },
    from: function from(...args) {
      this.storage.from = [...args];
      return this;
    },
    orderBy: function from(...args) {
      this.storage.orderBy = [...args];
      return this;
    },
    limit: function from(...args) {
      this.storage.limit = [...args];
      return this;
    },
    offset: function offset(...args) {
      this.storage.offset = [...args];
      return this;
    },
    update: function update(...args) {
      this.storage.update = [...args];
      return this;
    },
    insert: function insert(...args) {
      this.storage.insert = [...args];
      return this;
    },
    into: function into(...args) {
      this.storage.into = [...args];
      return this;
    },
    returning: function returning(...args) {
      this.storage.returning = [...args];
      return this;
    },
    where: function where(...args) {
      this.storage.where = [...args];
      return this;
    },
    del: function del(...args) {
      this.storage.del = [...args];
      return this;
    },
    raw: function raw(...args) {
      this.storage.raw = [...args];
      return this;
    },
    with: function wth(...args) {
      this.storage.with = [...args];
      return this;
    },
  };

  function createFakeDb() {

    return (...args) => {

      this.storage.model = [...args];
      return this;
    };
  }

  const fakeDb = createFakeDb.apply(db);
  fakeDb.__proto__ = db;

  return fakeDb;
};
