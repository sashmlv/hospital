'use strict';

const db = require('../../lib/db-sql');

class RoleModel {

  async getRoles(args) {

    const {offset, limit,} = args;
    return await db.select('*').from('roles').limit(limit).offset(offset);
  }

  async create(args) {

    const {name,} = args;
    return await db('roles').insert({name}).returning('id');
  }

  async getRole(args) {

    const {roleId,} = args;
    return await db.select('*').from('roles').where({id: roleId});
  }

  async update(args) {

    const {roleId, name,} = args;
    return await db('roles').update({name,}).where({id: roleId}).returning('id');
  }

  async delete(args) {

    const {roleId,} = args;
    return await db('roles').del().where({id: roleId}).returning('id');
  }
}

module.exports = new RoleModel();
