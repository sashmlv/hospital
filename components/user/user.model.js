'use strict';

const db = require('../../libs/db-sql');

class UserModel {

  async getUsers(args) {

    const {limit, offset, record_status,} = args;

    const result = await db
      .select('*')
      .from('users')
      .where({record_status,})
      .orderBy('id')
      .limit(limit)
      .offset(offset);

    return result;
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
      record_status,
    } = args;

    const result = await db('users').insert({
      role_id,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
      record_status,
    }).returning('id');

    return result;
  }

  async getUser(args) {

    const {id, record_status,} = args;

    const result = await db.select('*').from('users').where({id, record_status,});

    return result;
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
      record_status,
    } = args;

    const result = await db('users').update({
      role_id,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
      record_status,
    }).where({id}).returning('id');

    return result;
  }

  async delete(args) {

    const {id, record_status,} = args;

    const result = await db('users').update({record_status,}).where({id}).returning('id');

    return result;
  }
}

module.exports = new UserModel();
