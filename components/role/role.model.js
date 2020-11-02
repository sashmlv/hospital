'use strict';

const db = require('../../libs/db-sql');

class RoleModel {

  async getRoles(args) {

    const {limit, offset, record_status,} = args;

    const result = await db
      .select('*')
      .from('roles')
      .where({record_status,})
      .orderBy('id')
      .limit(limit)
      .offset(offset);

    return result;
  }

  async create(args) {

    const {name, record_status,} = args;

    const result = await db('roles').insert({name, record_status,}).returning('*');

    return result;
  }

  async getRole(args) {

    const {id, record_status,} = args;

    const result = await db.select('*').from('roles').where({id, record_status,});

    return result;
  }

  async update(args) {

    const {id, name, record_status,} = args;

    const result = await db('roles').update({name,}).where({id, record_status,}).returning('*');

    return result;
  }

  async delete(args) {

    const {id, record_status,} = args;

    const result = await db('roles').update({record_status,}).where({id, record_status: 'active',}).returning('*');

    return result;
  }
}

module.exports = new RoleModel();
