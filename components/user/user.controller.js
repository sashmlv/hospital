'use strict';

const rm = require('./user.model'),
  ServiceError = require('../../lib/error'),
  sanitize = require('../../modules/sanitize');

class UserController {

  async getUsers(args) {

    args = sanitize('user', args,);

    const {limit = 100, page = 1,} = args;

    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;
    return await rm.getUsers({offset: args.offset, limit});
  };

  async create(args) {

    args = sanitize('user', args, 'roleId', 'firstname', 'middlename', 'lastname', 'gender', 'age', 'phone',);

    const {
      roleId,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
    } = args;

    return {
      id: (await rm.create({
        role_id: roleId,
        firstname,
        middlename,
        lastname,
        gender,
        age,
        phone,
      })).shift()
    };
  }

  async getUser(args) {

    args = sanitize('user', args, 'userId',);

    const {userId,} = args;

    return await rm.getUser({id: userId});
  }

  async update(args) {

    args = sanitize('user', args, 'userId',);

    const {
      userId,
      roleId,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
    } = args;

    return {
      id: (await rm.update({
        id: userId,
        role_id: roleId,
        firstname,
        middlename,
        lastname,
        gender,
        age,
        phone,
      })).shift()
    };
  }

  async delete(args) {

    args = sanitize('user', args, 'userId',);

    const {userId,} = args;

    return {
      id: (await rm.delete({id: userId})).shift()
    };
  }
}

module.exports = new UserController();
