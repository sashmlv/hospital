'use strict';

const rm = require('./role.model');

class RoleController {

  async getRoles(args) {

    const {limit = 100, page = 1,} = args;
    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;
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
    return await rm.getRole({id: roleId});
  }

  async update(args) {

    const {
      roleId,
      name,
    } = args;
    return {
      id: (await rm.update({id: roleId, name,})).shift()
    };
  }

  async delete(args) {

    const {roleId,} = args;
    return {
      id: (await rm.delete({id: roleId})).shift()
    };
  }
}

module.exports = new RoleController();