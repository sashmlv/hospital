'use strict';

const ServiceError = require('../lib/error'),
  getClass = required('./get.class'),
  sanitizers = required('./sanitizers');

class Sanitize {

  /**
   * Sanitize fields
   * @param {string} model - which model data
   * @param {object} data
   * @param {string|string[]} required - field names which required
   * @return {object} Returns sanitized data
   */
  sanitize (model, data, ...required) {

    if (!sanitizers[model]) {

      throw new ServiceError({
        message: 'Model not found: ' + model,
        data: {model},
      });
    }

    if (required && typeof required === 'string') {

      required = [required];
    }

    const strData = this.stringify(data),
      keys = Object.keys(strData);

    let key, val, empty, valid;

    for (let i = 0; i < keys.length; i++) {

      key = keys[i];
      val = strData[key];

      empty = required && required.includes(key) && (val === undefined || val === 'undefined');

      if (empty) {

        throw new ServiceError({
          message: 'Field required: ' + key,
          data: {[key]: val},
        });
      }

      if (!sanitizers[model][key]) {

        throw new ServiceError({
          message: 'Field is not allowed: ' + key,
          data: {[key]: val},
        });
      }

      valid = sanitizers[model][key](val);

      if (!valid) {

        throw new ServiceError({
          message: 'Field not valid: ' + key,
          data: {[key]: val},
        });
      }
    }

    return strData;
  }

  /**
   * Stringify values
   * @param {object} data
   * @param {boolean} modify - modify incoming object
   * @param {number} limit - steps limit
   * @param {number} count - current step
   * @return {object} Returns stringified object
   **/
  stringify(data, modify = false, limit = 100, count = 0) {

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

        target[i] = this.stringify(data[i], limit, ++count);
      }
    }
    else if (getClass(data) === 'object') {

      target = target || {};

      const keys = Object.keys(data);

      for (let i = 0; i < keys.length; i++) {

        target[keys[i]] = this.stringify(data[keys[i]], limit, ++count);
      }
    }
    else {

      target = String(data);
    }

    return target;
  };
};

module.exports = new Sanitize();