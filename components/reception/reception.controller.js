'use strict';

const rm = require('./reception.model'),
  {
    differenceInMinutes,
    format,
    addMinutes,
  } = require('date-fns'),
  re = require('./reception.error'),
  sanitize = require('./reception.sanitize'),
  {APP} = require('../../libs/config'),
  {RECEPTION_DURATION} = APP;

class ReceptionController {

  async getReceptions(args={}) {

    args = sanitize(args);

    const {limit = 100, page = 1,} = args;

    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;

    const result = await rm.getReceptions({limit, offset: args.offset, record_status: 'active',});

    return result;
  };

  async createOrUpdate(args={}) {

    args = sanitize(args, 'doctorId', 'date', 'startTime', 'endTime');

    const {
      doctorId,
      patientId = null,
      date,
      startTime,
      endTime,
    } = args;

    const diff = differenceInMinutes(
      new Date(`${date} ${endTime}`),
      new Date(`${date} ${startTime}`)
    );

    if (diff !== RECEPTION_DURATION) {

      throw re('RECEPTION_DURATION', {
        startTime,
        endTime,
        difference: diff,
      });
    }

    const result = {
      id: await rm.createOrUpdate({
        doctor_id: doctorId,
        patient_id: patientId,
        date,
        start_time: startTime,
        end_time: endTime,
        record_status: 'active',
      })
    };

    return result;
  }

  async getReception(args={}) {

    args = sanitize(args, 'receptionId');

    const {receptionId,} = args;

    const result = await rm.getReception({id: receptionId, record_status: 'active',});

    return result;
  }

  async delete(args={}) {

    args = sanitize(args, 'receptionId');

    const {receptionId,} = args;

    const result = {
      id: await rm.delete({id: receptionId, record_status: 'deleted',})
    };

    return result;
  }

  async createOrUpdateReceptionsInterval(args={}) {

    args = sanitize(args, 'doctorId', 'date', 'startInterval', 'endInterval');

    const {
      doctorId,
      patientId = null,
      date,
      startInterval,
      endInterval,
    } = args;

    const diff = differenceInMinutes(
      new Date(`${date} ${endInterval}`),
      new Date(`${date} ${startInterval}`)
    );

    if (diff % RECEPTION_DURATION !== 0) {

      throw re('RESEPTION_INTERVAL', {
        startInterval,
        endInterval,
      });
    }

    const intervals = [];

    let start = new Date(`${date} ${startInterval}`),
      end = new Date(`${date} ${endInterval}`);

    while(start < end) {

      intervals.push({
        start_time: format(start, 'HH:mm:ss'),
        end_time: format(start = addMinutes(start, RECEPTION_DURATION), 'HH:mm:ss'),
      });
    }

    const result = {
      ids: await rm.createOrUpdateMany({
        doctor_id: doctorId,
        patient_id: patientId,
        date,
        start_interval: startInterval,
        end_interval: endInterval,
        intervals,
        record_status: 'active',
      })
    };

    return result;
  }

  async receptionTake(args={}) {

    args = sanitize(args, 'receptionId', 'patientId');

    const {
      receptionId,
      patientId,
    } = args;

    const result = await rm.updateByPatient({
      id: receptionId,
      patient_id: patientId,
      record_status: 'active',
    });

    return result;
  }
}

module.exports = new ReceptionController();
