'use strict';

const rm = require('./role.model'),
  {sanitize} = require('../../modules');

class RoleController {

  async getRoles(args={}) {

    args = sanitize('role', args,);

    const {limit = 100, page = 1,} = args;

    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;
    return await rm.getRoles({limit, offset: args.offset,});
  };

  async create(args={}) {

    args = sanitize('role', args, 'name',);

    const {name,} = args;

    return {
      id: (await rm.create({name})).shift()
    };
  }

  async getRole(args={}) {

    args = sanitize('role', args, 'roleId',);

    const {roleId,} = args;

    return await rm.getRole({id: roleId});
  }

  async update(args={}) {

    args = sanitize('role', args, 'roleId', 'name',);

    const {
      roleId,
      name,
    } = args;

    return {
      id: (await rm.update({id: roleId, name,})).shift()
    };
  }

  async delete(args={}) {

    args = sanitize('role', args, 'roleId',);

    const {roleId,} = args;

    return {
      id: (await rm.delete({id: roleId})).shift()
    };
  }
}

module.exports = new RoleController();
