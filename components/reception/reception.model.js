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
      patient_id = null,
      date,
      start_time,
      end_time,
    } = args;

    return (await db.raw(`
WITH cte AS (DELETE FROM receptions WHERE start_time <= ? AND end_time > ? OR start_time < ? AND end_time >= ?)
INSERT INTO receptions (doctor_id, patient_id, date, start_time, end_time) VALUES (?, ?, ?, ?, ?) RETURNING id`,
      [
        start_time,
        start_time,
        end_time,
        end_time,
        doctor_id,
        patient_id,
        date,
        start_time,
        end_time,
      ]
    )).rows;
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
      patient_id = null,
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

    return await db.with('cte', db.raw('DELETE FROM receptions WHERE start_time <= ? AND end_time > ? OR start_time < ? AND end_time >= ?',
      [
        start_interval,
        start_interval,
        end_interval,
        end_interval,
      ])
    ).insert(newRecords).into('receptions').returning('id');
  }

  async updateByPatient(args) {

    const {
      id,
      patient_id,
    } = args;

    const record = (await db.raw(
      'WITH cte AS (UPDATE receptions SET patient_id = ? WHERE id = ? AND patient_id IS NULL) SELECT * FROM receptions WHERE id = ?',
      [patient_id, id, id,]
    )).rows.shift(),
      taken = record && record.patient_id && (record.patient_id !== patient_id);

    if (taken) {

      throw new ServiceError({
        message: 'Reception already taken',
        data: {id: record.id}
      });
    }
    else if (!record) {

      throw new ServiceError({
        message: 'Reception not found',
        data: {id}
      });
    }

    record.patient_id = +patient_id;
    return [record];
  }
}

module.exports = new ReceptionModel();
