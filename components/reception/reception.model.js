'use strict';

const db = require('../../libs/db-sql'),
  re = require('./reception.error');

class ReceptionModel {

  async getReceptions(args) {

    const {limit, offset, record_status,} = args;

    const result = await db
      .select('*')
      .from('receptions')
      .where({record_status,})
      .orderBy('id')
      .limit(limit)
      .offset(offset);

    return result;
  }

  async createOrUpdate(args) {

    const {
      doctor_id,
      patient_id = null,
      date,
      start_time,
      end_time,
      record_status,
    } = args;

    const result = await db.raw(`
WITH cte AS (UPDATE receptions SET record_status = ? WHERE doctor_id = ? AND date = ? AND (start_time <= ? AND end_time > ? OR start_time < ? AND end_time >= ?))
INSERT INTO receptions (doctor_id, patient_id, date, start_time, end_time, record_status) VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
      [
        'deleted',
        doctor_id,
        date,
        start_time,
        start_time,
        end_time,
        end_time,
        doctor_id,
        patient_id,
        date,
        start_time,
        end_time,
        record_status,
      ]
    );

    return result;
  }

  async getReception(args) {

    const {id, record_status,} = args;

    const result = await db.select('*').from('receptions').where({id, record_status,});

    return result;
  }

  async delete(args) {

    const {id, record_status,} = args;

    const result = await db('receptions').update({record_status,}).where({id, record_status: 'active',}).returning('*');

    return result;
  }

  async createOrUpdateMany(args) {

    const {
      doctor_id,
      patient_id = null,
      date,
      start_interval,
      end_interval,
      intervals,
      record_status,
    } = args;

    const newRecords = intervals.map(v => ({
      doctor_id,
      patient_id,
      date,
      start_time: v.start_time,
      end_time: v.end_time,
      record_status: 'active',
    }));

    const result = await db.with('cte', db.raw('UPDATE receptions SET record_status = ? WHERE doctor_id = ? AND date = ? AND (start_time <= ? AND end_time > ? OR start_time < ? AND end_time >= ?)',
      [
        'deleted',
        doctor_id,
        date,
        start_interval,
        start_interval,
        end_interval,
        end_interval,
      ])
    ).insert(newRecords).into('receptions').returning('*');

    return result;
  }

  async updateByPatient(args) {

    const {
      id,
      patient_id,
      record_status,
    } = args;

    const record = await db.raw(
      'WITH cte AS (UPDATE receptions SET patient_id = ? WHERE id = ? AND patient_id IS NULL AND record_status = ?) SELECT * FROM receptions WHERE id = ? AND record_status = ?',
      [patient_id, id, record_status, id, record_status,]
    );

    if (!record) {

      throw re('RECEPTION_NOT_FOUND', {id});
    }

    const taken = record && record.patient_id && (record.patient_id !== patient_id);

    if (taken) {

      throw re('RECEPTION_TAKEN', {id: record.id});
    }

    record.patient_id = +patient_id;
    return record;
  }
}

module.exports = new ReceptionModel();
