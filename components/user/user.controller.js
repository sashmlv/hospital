'use strict';

const rm = require('./user.model'),
  ServiceError = require('../../libs/error'),
  sanitize = require('./user.sanitize');

class UserController {

  async getUsers(args={}) {

    args = sanitize(args);

    const {limit = 100, page = 1,} = args;

    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;

    const result =  await rm.getUsers({offset: args.offset, limit});

    return result;
  };

  async create(args={}) {

    args = sanitize(args, 'roleId', 'firstname', 'middlename', 'lastname', 'gender', 'age', 'phone',);

    const {
      roleId,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
    } = args;

    const result = {
      id: await rm.create({
        role_id: roleId,
        firstname,
        middlename,
        lastname,
        gender,
        age,
        phone,
      })
    };

    return result;
  }

  async getUser(args={}) {

    args = sanitize(args, 'userId',);

    const {userId,} = args;

    const result = await rm.getUser({id: userId});

    return result;
  }

  async update(args={}) {

    args = sanitize(args, 'userId',);

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

    const result = {
      id: await rm.update({
        id: userId,
        role_id: roleId,
        firstname,
        middlename,
        lastname,
        gender,
        age,
        phone,
      })
    };

    return result;
  }

  async delete(args={}) {

    args = sanitize(args, 'userId',);

    const {userId,} = args;

    const result = {
      id: await rm.delete({id: userId})
    };

    return result;
  }
}

module.exports = new UserController();
