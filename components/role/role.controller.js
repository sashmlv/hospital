'use strict';

const rm = require('./role.model'),
  rs = require('./role.sanitize');

class RoleController {

  async getRoles(args={}) {

    args = rs(args);

    const {limit = 100, page = 1,} = args;

    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;

    const result = await rm.getRoles({limit, offset: args.offset, record_status: 'active',});

    return result;
  };

  async create(args={}) {

    args = rs(args, 'name');

    const {name,} = args;

    const result = {
      id: await rm.create({name, record_status: 'active',})
    };

    return result;
  }

  async getRole(args={}) {

    args = rs(args, 'roleId');

    const {roleId,} = args;

    const result = await rm.getRole({id: roleId, record_status: 'active',});

    return result;
  }

  async update(args={}) {

    args = rs(args, 'roleId', 'name');

    const {
      roleId,
      name,
    } = args;

    const result = {
      id: await rm.update({id: roleId, name, record_status: 'active',})
    };

    return result;
  }

  async delete(args={}) {

    args = rs(args, 'roleId');

    const {roleId,} = args;

    const result = {
      id: await rm.delete({id: roleId, record_status: 'deleted'})
    };

    return result;
  }
}

module.exports = new RoleController();
