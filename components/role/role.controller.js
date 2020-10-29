'use strict';

const rm = require('./role.model'),
  {sanitize} = require('../../modules/sanitize');

class RoleController {

  async getRoles(args) {

    validate('role', args, 'page', 'limit',);

    const {limit = 100, page = 1,} = args;

    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;
    return await rm.getRoles({offset: args.offset, limit});
  };

  async create(args) {

    validate('role', args, 'name',);

    const {name,} = args;

    return {
      id: (await rm.create({name})).shift()
    };
  }

  async getRole(args) {

    validate('role', args, 'roleId',);

    const {roleId,} = args;

    return await rm.getRole({id: roleId});
  }

  async update(args) {

    validate('role', args, 'roleId', 'name',);

    const {
      roleId,
      name,
    } = args;

    return {
      id: (await rm.update({id: roleId, name,})).shift()
    };
  }

  async delete(args) {

    validate('role', args, 'roleId',);

    const {roleId,} = args;

    return {
      id: (await rm.delete({id: roleId})).shift()
    };
  }
}

module.exports = new RoleController();