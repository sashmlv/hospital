'use strict';

const db = require('../../lib/db-sql'),
  ServiceError = require('../../lib/error');

class ReceptionModel {

  async getReceptions(args) {

    const {offset, limit,} = args;
    return await db
      .select('*')
      .from('receptions')
      .orderBy('id')
      .limit(limit)
      .offset(offset);
  }

  async createOrUpdate(args) {

    const {
      doctor_id,
      patient_id,
      date,
      start_time,
      end_time,
    } = args;

    /* remove overlapped intervals */
    const oldRecords = await db.select('*').from('receptions').where({doctor_id, date,}),
      remove = [];

    let newRecord = {
        start_time,
        end_time,
      },
      oldRecord,
      overlap;

    for (let i = 0; i < oldRecords.length; i++) {

      oldRecord = oldRecords[i];

      overlap = newRecord.start_time >= oldRecord.start_time && newRecord.start_time < oldRecord.end_time ||
        newRecord.end_time > oldRecord.start_time && newRecord.end_time <= oldRecord.end_time;

      if (overlap && !remove.includes(oldRecord.id)) {

        remove.push(oldRecord.id);
      }
    }

    if (remove.length) {

      await db('receptions').del().whereIn('id', remove);
    }

    return await db('receptions').insert({
      doctor_id,
      patient_id,
      date,
      start_time,
      end_time,
    }).returning('id');
  }

  async getReception(args) {

    const {receptionId,} = args;
    return await db.select('*').from('receptions').where({id: receptionId});
  }

  async delete(args) {

    const {id,} = args;
    return await db('receptions').del().where({id}).returning('id');
  }

  async createOrUpdateMany(args) {

    const {
      method,
      doctor_id,
      patient_id,
      date,
      start_interval,
      end_interval,
      intervals,
    } = args;

    const newRecords = intervals.map(v => ({
      doctor_id,
      patient_id,
      date,
      start_time: v.start_time,
      end_time: v.end_time,
    }));

    let result;

    /* remove overlapped intervals */
    const oldRecords = await db.select('*').from('receptions').where({doctor_id, date,}),
      remove = [];

    let newRecord, oldRecord, overlap;

    for (let i = 0; i < oldRecords.length; i++) {

      oldRecord = oldRecords[i];

      for (let j = 0; j < newRecords.length; j++) {

        newRecord = newRecords[j];

        overlap = newRecord.start_time >= oldRecord.start_time && newRecord.start_time < oldRecord.end_time ||
          newRecord.end_time > oldRecord.start_time && newRecord.end_time <= oldRecord.end_time;

        if (overlap && !remove.includes(oldRecord.id)) {

          remove.push(oldRecord.id);
        }
      }
    }

    if (remove.length) {

      await db('receptions').del().whereIn('id', remove);
    }

    return await db('receptions').insert(newRecords).returning('id');
  }

  async updateByPatient(args) {

    const {
      id,
      patient_id,
    } = args;

    const record = (await db.raw(
      `WITH cte AS (UPDATE receptions SET patient_id = ? WHERE id = ? AND patient_id IS NULL) SELECT * FROM receptions WHERE id = ?`,
      [patient_id, id, id,]
    )).rows.shift(),
      taken = record && record.patient_id && (record.patient_id !== patient_id);

    if (taken) {

      throw new ServiceError({
        message: 'Reseption already taken',
        data: {id: record.id}
      });
    }
    else if (!record) {

      throw new ServiceError({
        message: 'Reseption not found',
        data: {id}
      });
    }

    record.patient_id = patient_id;
    return [record];
  }
}

module.exports = new ReceptionModel();
