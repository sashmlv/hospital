'use strict';

const db = require('../../libs/db-sql');

class UserModel {

  async getUsers(args) {

    const {offset, limit,} = args;

    return await db
      .select('*')
      .orderBy('id')
      .from('users')
      .limit(limit)
      .offset(offset);
  }

  async create(args) {

    const {
      role_id,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
    } = args;

    return await db('users').insert({
      role_id,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
    }).returning('id');
  }

  async getUser(args) {

    const {id,} = args;

    return await db.select('*').from('users').where({id});
  }

  async update(args) {

    const {
      id,
      role_id,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
    } = args;

    return await db('users').update({
      role_id,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
    }).where({id}).returning('id');
  }

  async delete(args) {

    const {id,} = args;

    return await db('users').del().where({id}).returning('id');
  }
}

module.exports = new UserModel();
