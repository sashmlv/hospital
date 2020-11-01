'use strict';

const db = require('../../libs/db-sql');

class UserModel {

  async getUsers(args) {

    const {offset, limit,} = args;

    const result = await db
      .select('*')
      .from('users')
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
    } = args;

    const result = await db('users').insert({
      role_id,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
    }).returning('id');

    return result;
  }

  async getUser(args) {

    const {id,} = args;

    const result = await db.select('*').from('users').where({id});

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
    } = args;

    const result = await db('users').update({
      role_id,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
    }).where({id}).returning('id');

    return result;
  }

  async delete(args) {

    const {id,} = args;

    const result = await db('users').del().where({id}).returning('id');

    return result;
  }
}

module.exports = new UserModel();
