'use strict';

const ServiceError = require('../lib/error'),
  getClass = require('./get.class'),
  sanitizers = require('./sanitizers');

/**
 * Sanitize fields
 * @param {string} model - which model data
 * @param {object} data
 * @param {string|string[]} required - field names which required
 * @return {object} Returns sanitized data
 */
function sanitize(model, data, ...required) {

  if (!sanitizers[model]) {

    throw new ServiceError({
      message: 'Model not found: ' + model,
      data: {model},
    });
  }

  if (required && typeof required === 'string') {

    required = [required];
  }

  const strData = stringify(data),
    keys = Object.keys(strData),
    emptyKey = required.find(key => !keys.includes(key) || strData[key] === 'undefined' || strData[key] === undefined);

  let key, val, valid;

  if (emptyKey) {

    throw new ServiceError({
      message: 'Field required: ' + emptyKey,
      data: {[emptyKey]: data[emptyKey]},
    });
  }

  for (let i = 0; i < keys.length; i++) {

    key = keys[i];
    val = strData[key];

    if (!sanitizers[model][key]) {

      throw new ServiceError({
        message: 'Field is not allowed: ' + key,
        data: {[key]: data[key]},
      });
    }

    if (sanitizers[model][key].validate) {

      valid = sanitizers[model][key].validate(val);

      if (!valid) {

        throw new ServiceError({
          message: 'Field not valid: ' + key,
          data: {[key]: data[key]},
        });
      }
    }

    if (sanitizers[model][key].sanitize) {

      strData[key] = sanitizers[model][key].sanitize(val);
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

module.exports = {
  sanitize,
  stringify,
};
