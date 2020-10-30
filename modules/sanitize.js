'use strict';

const ServiceError = require('../libs/error'),
  stringify = require('./stringify'),
  sanitizers = require('./sanitizers');

/**
 * Sanitize fields
 * @param {string} model - which model data
 * @param {object} data
 * @param {string|string[]} required - field names which required
 * @return {object} Returns sanitized data
 */
function sanitize(model, data, ...required) {

  if (!data) {

    return data;
  }

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

module.exports = sanitize;
