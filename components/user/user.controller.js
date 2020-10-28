'use strict';

const rm = require('./user.model');

class UserController {

  async getUsers(args) {

    const {limit = 100, page = 1,} = args;
    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;
    return await rm.getUsers({offset: args.offset, limit});
  };

  async create(args) {

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

    const {userId,} = args;
    return await rm.getUser({id: userId});
  }

  async update(args) {

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

    const {userId,} = args;
    return {
      id: (await rm.delete({id: userId})).shift()
    };
  }
}

module.exports = new UserController();