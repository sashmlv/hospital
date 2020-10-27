'use strict';

const rm = require('./role.model');

class RoleController {

  async getRoles(args) {

    const {limit = 100, page = 1,} = args;
    args.page = args.page > 0 ? args.page : 1;
    args.offset = (args.page - 1) * args.limit;
    return await rm.getRoles({offset: args.offset, limit});
  };

  async create(args) {

    const {name,} = args;
    return {
      id: (await rm.create({name})).shift()
    };
  }

  async getRole(args) {

    const {roleId,} = args;
    return await rm.getRole({roleId});
  }

  async update(args) {

    const {
      roleId,
      name,
    } = args;
    return {
      id: (await rm.update({roleId, name,})).shift()
    };
  }

  async delete(args) {

    const {roleId,} = args;
    return {
      id: (await rm.delete({roleId})).shift()
    };
  }
}

module.exports = new RoleController();