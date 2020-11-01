'use strict';

const db = require('../../libs/db-sql');

class RoleModel {

  async getRoles(args) {

    const {limit, offset,} = args;

    const result = await db
      .select('*')
      .from('roles')
      .orderBy('id')
      .limit(limit)
      .offset(offset);

    return result;
  }

  async create(args) {

    const {name,} = args;

    const result = await db('roles').insert({name}).returning('id');

    return result;
  }

  async getRole(args) {

    const {id,} = args;

    const result = await db.select('*').from('roles').where({id});

    return result;
  }

  async update(args) {

    const {id, name,} = args;

    const result = await db('roles').update({name,}).where({id}).returning('id');

    return result;
  }

  async delete(args) {

    const {id,} = args;

    const result = await db('roles').del().where({id}).returning('id');

    return result;
  }
}

module.exports = new RoleModel();
