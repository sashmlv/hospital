'use strict';

const db = require('../../lib/db-sql');

class ReceptionModel {

  async getReceptions(args) {

    const {offset, limit,} = args;
    return await db.select('*').from('receptions').limit(limit).offset(offset);
  }

  async create(args) {

    const {
      doctor_id,
      date,
      start_time,
      end_time,
    } = args;
    return await db('receptions').insert({
      doctor_id,
      date,
      start_time,
      end_time,
    }).returning('id');
  }

  async getReception(args) {

    const {receptionId,} = args;
    return await db.select('*').from('receptions').where({id: receptionId});
  }

  async update(args) {

    const {
      receptionId,
      doctor_id,
      date,
      start_time,
      end_time,
    } = args;
    return await db('receptions').update({
      doctor_id,
      date,
      start_time,
      end_time,
    }).where({id: receptionId}).returning('id');
  }

  async delete(args) {

    const {receptionId,} = args;
    return await db('receptions').del().where({id: receptionId}).returning('id');
  }
}

module.exports = new ReceptionModel();
