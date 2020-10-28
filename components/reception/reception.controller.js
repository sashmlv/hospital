'use strict';

const rm = require('./reception.model');

class ReceptionController {

  async getReceptions(args) {

    const {limit = 100, page = 1,} = args;
    args.page = args.page > 0 ? args.page : 1;
    args.offset = (args.page - 1) * args.limit;
    return await rm.getReceptions({offset: args.offset, limit});
  };

  async create(args) {

    const {
      doctor_id,
      date,
      start_time,
      end_time,
    } = args;

    return {
      id: (await rm.create({
        doctor_id,
        date,
        start_time,
        end_time,
      })).shift()
    };
  }

  async getReception(args) {

    const {receptionId,} = args;
    return await rm.getReception({receptionId});
  }

  async update(args) {

    const {
      receptionId,
      doctor_id,
      date,
      start_time,
      end_time,
    } = args;
    return {
      id: (await rm.update({
        receptionId,
        doctor_id,
        date,
        start_time,
        end_time,
      })).shift()
    };
  }

  async delete(args) {

    const {receptionId,} = args;
    return {
      id: (await rm.delete({receptionId})).shift()
    };
  }
}

module.exports = new ReceptionController();