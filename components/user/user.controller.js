'use strict';

const rm = require('./user.model'),
  sanitize = require('./user.sanitize');

class UserController {

  async getUsers(args={}) {

    args = sanitize(args);

    const {limit = 100, page = 1,} = args;

    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;

    const result =  await rm.getUsers({limit, offset: args.offset, record_status: 'active',});

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

    const result = await rm.create({
      role_id: roleId,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
      record_status: 'active',
    });

    return result;
  }

  async getUser(args={}) {

    args = sanitize(args, 'userId',);

    const {userId,} = args;

    const result = await rm.getUser({id: userId, record_status: 'active',});

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

    const result = await rm.update({
      id: userId,
      role_id: roleId,
      firstname,
      middlename,
      lastname,
      gender,
      age,
      phone,
      record_status: 'active',
    });

    return result;
  }

  async delete(args={}) {

    args = sanitize(args, 'userId',);

    const {userId,} = args;

    const result = await rm.delete({id: userId, record_status: 'deleted',});

    return result;
  }
}

module.exports = new UserController();
