'use strict';

const ServiceError = require('../lib/error'),
  getClass = require('./get.class');

/**
 * Stringify values
 * @param {object} data
 * @param {boolean} modify - modify incoming object
 * @param {number} limit - steps limit
 * @param {number} count - current step
 * @return {object} Returns stringified object
 */
function stringify(data, modify = false, limit = 100, count = 0) {

  let target;

  if (modify) {

    target = data;
  }

  if (count > limit || !limit) {

    throw new ServiceError({
      message: 'Too big object provided',
    });
  }

  if (Array.isArray(data)) {

    target = target || [];

    for (let i = 0; i < data.length; i++) {

      target[i] = stringify(data[i], limit, ++count);
    }
  }
  else if (getClass(data) === 'object') {

    target = target || {};

    const keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {

      target[keys[i]] = stringify(data[keys[i]], limit, ++count);
    }
  }
  else {

    target = String(data);
  }

  return target;
};

module.exports = stringify;