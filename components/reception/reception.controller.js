'use strict';

const rm = require('./reception.model'),
  moment = require('moment'),
  {duration} = moment,
  ServiceError = require('../../lib/error'),
  {APP} = require('../../lib/config'),
  {RECEPTION_DURATION} = APP;

class ReceptionController {

  async getReceptions(args) {

    const {limit = 100, page = 1,} = args;
    args.page = page > 0 ? page : 1;
    args.offset = (page - 1) * limit;
    return await rm.getReceptions({offset: args.offset, limit});
  };

  async createOrUpdate(args) {

    const {
      doctorId,
      patientId,
      date,
      startTime,
      endTime,
    } = args,
      isTime = startTime && endTime;

    if (isTime) {

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
    }

    return {
      id: (await rm.createOrUpdate({
        doctor_id: doctorId,
        patient_id: patientId,
        date,
        ...(isTime ? {start_time: startTime} : {}),
        ...(isTime ? {end_time: endTime} : {}),
      })).shift()
    };
  }

  async getReception(args) {

    const {receptionId,} = args;
    return await rm.getReception({receptionId});
  }

  async delete(args) {

    const {receptionId,} = args;
    return {
      id: (await rm.delete({id: receptionId})).shift()
    };
  }

  async createOrUpdateReceptionsInterval(args) {

    const {
      method,
      doctorId,
      patientId,
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
        method,
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