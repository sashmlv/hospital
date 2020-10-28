'use strict';

const db = require('../../lib/db-sql');

class UserModel {

  async getUsers(args) {

    const {offset, limit,} = args;
    return await db.select('*').from('users').limit(limit).offset(offset);
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

    const {userId,} = args;
    return await db.select('*').from('users').where({id: userId});
  }

  async update(args) {

    const {
      userId,
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
    }).where({id: userId}).returning('id');
  }

  async delete(args) {

    const {userId,} = args;
    return await db('users').del().where({id: userId}).returning('id');
  }
}

module.exports = new UserModel();
