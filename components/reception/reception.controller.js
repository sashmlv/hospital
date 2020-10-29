'use strict';

const rm = require('./reception.model'),
  moment = require('moment'),
  {duration} = moment,
  ServiceError = require('../../lib/error'),
  {validate} = require('../../modules/validate'),
  {APP} = require('../../lib/config'),
  {RECEPTION_DURATION} = APP;

class ReceptionController {

  async getReceptions(args) {

    validate('reception', args, 'page', 'limit',);

    const {limit = 100, page = 1,} = args;

    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;
    return await rm.getReceptions({offset: args.offset, limit});
  };

  async createOrUpdate(args) {

    validate('reception', args, 'doctorId,', 'date,', 'startTime', 'endTime',);

    const {
      doctorId,
      patientId = null,
      date,
      startTime,
      endTime,
    } = args;

    const diff = duration(
      moment(moment(new Date(`${date} ${endTime}`)))
        .diff(new Date(`${date} ${startTime}`)),
    ).asMinutes();

    if (diff !== RECEPTION_DURATION) {

      throw new ServiceError({
        message: 'Please provide reseption time equal to reception duration: ' + RECEPTION_DURATION,
        data: {
          startTime,
          endTime,
          ...(Number.isInteger(diff) ? {difference: diff} : {}),
        }
      });
    }

    return {
      id: (await rm.createOrUpdate({
        doctor_id: doctorId,
        patient_id: patientId,
        date,
        start_time: startTime,
        end_time: endTime,
      })).shift()
    };
  }

  async getReception(args) {

    validate('reception', args, 'receptionId',);

    const {receptionId,} = args;

    return await rm.getReception({receptionId});
  }

  async delete(args) {

    validate('reception', args, 'receptionId',);

    const {receptionId,} = args;

    return {
      id: (await rm.delete({id: receptionId})).shift()
    };
  }

  async createOrUpdateReceptionsInterval(args) {

    validate('reception', args, 'doctorId', 'date', 'startInterval', 'endInterval',);

    const {
      doctorId,
      patientId = null,
      date,
      startInterval,
      endInterval,
    } = args;

    const diff = duration(
      moment(moment(new Date(`${date} ${endInterval}`)))
        .diff(new Date(`${date} ${startInterval}`)),
    ).asMinutes();

    if (diff % RECEPTION_DURATION !== 0) {

      throw new ServiceError({
        message: 'Please provide reseptions interval, which can be divided by reception duration: ' + RECEPTION_DURATION,
        data: {startInterval, endInterval,}
      });
    }

    const intervals = [];

    let start = moment(new Date(`${date} ${startInterval}`)),
      end = moment(new Date(`${date} ${endInterval}`));

    while(start < end) {

      intervals.push({
        start_time: start.format('HH:mm:ss'),
        end_time: (start = start.add(RECEPTION_DURATION, 'minutes')).format('HH:mm:ss'),
      });
    }

    return {
      ids: await rm.createOrUpdateMany({
        doctor_id: doctorId,
        patient_id: patientId,
        date,
        start_interval: startInterval,
        end_interval: endInterval,
        intervals,
      })
    };
  }

  async receptionTake(args) {

    validate('reception', args, 'receptionId', 'patientId',);

    const {
      receptionId,
      patientId,
    } = args;

    return await rm.updateByPatient({
      id: receptionId,
      patient_id: patientId,
    });
  }
}

module.exports = new ReceptionController();