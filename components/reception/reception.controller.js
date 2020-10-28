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

    const diff = duration(
      moment(moment(new Date(`${date} ${end_time}`)))
        .diff(new Date(`${date} ${start_time}`)),
    ).asMinutes();

    if (diff !== RECEPTION_DURATION) {

      throw new ServiceError({
        message: 'Please provide reseption time equal to reception duration: ' + RECEPTION_DURATION,
        data: {start_time, end_time, difference: diff,}
      });
    }

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

    const diff = duration(
      moment(moment(new Date(`${date} ${end_time}`)))
        .diff(new Date(`${date} ${start_time}`)),
    ).asMinutes();

    if (diff !== RECEPTION_DURATION) {

      throw new ServiceError({
        message: 'Please provide reseption time equal to reception duration: ' + RECEPTION_DURATION,
        data: {start_time, end_time, difference: diff,}
      });
    }

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

  async createOrUpdateReceptionsInterval(args) {

    const {
      method,
      doctor_id,
      date,
      start_interval,
      end_interval,
    } = args;

    const diff = duration(
      moment(moment(new Date(`${date} ${end_interval}`)))
        .diff(new Date(`${date} ${start_interval}`)),
    ).asMinutes();

    if (diff % RECEPTION_DURATION !== 0) {

      throw new ServiceError({
        message: 'Please provide reseptions interval, which can be divided by reception duration: ' + RECEPTION_DURATION,
        data: {start_interval, end_interval,}
      });
    }

    const intervals = [];

    let start = moment(new Date(`${date} ${start_interval}`)),
      end = moment(new Date(`${date} ${end_interval}`));

    while(start < end) {

      intervals.push({
        start_time: start.format('HH:mm:ss'),
        end_time: (start = start.add(RECEPTION_DURATION, 'minutes')).format('HH:mm:ss'),
      });
    }

    return {
      ids: await rm.createOrUpdateMany({
        method,
        doctor_id,
        date,
        start_interval,
        end_interval,
        intervals,
      })
    };
  }
}

module.exports = new ReceptionController();