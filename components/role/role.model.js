'use strict';

const db = require('../../lib/db-sql');

class RoleModel {

  async getRoles(args) {

    const {offset, limit,} = args;
    return await db
      .select('*')
      .from('roles')
      .orderBy('id')
      .limit(limit)
      .offset(offset);
  }

  async create(args) {

    const {name,} = args;
    return await db('roles').insert({name}).returning('id');
  }

  async getRole(args) {

    const {id,} = args;
    return await db.select('*').from('roles').where({id});
  }

  async update(args) {

    const {id, name,} = args;
    return await db('roles').update({name,}).where({id}).returning('id');
  }

  async delete(args) {

    const {id,} = args;
    return await db('roles').del().where({id}).returning('id');
  }
}

module.exports = new RoleModel();
