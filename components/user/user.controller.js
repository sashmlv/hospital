'use strict';

const rm = require('./user.model');

class UserController {

  async getUsers(args) {

    const {limit = 100, page = 1,} = args;
    args.page = args.page > 0 ? args.page : 1;
    args.offset = (args.page - 1) * args.limit;
    return await rm.getUsers({offset: args.offset, limit});
  };

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
    return {
      id: (await rm.create({
        role_id,
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
    return await rm.getUser({userId});
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
    return {
      id: (await rm.update({
        userId,
        role_id,
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
      id: (await rm.delete({userId})).shift()
    };
  }
}

module.exports = new UserController();