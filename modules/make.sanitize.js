'use strict';

const ServiceError = require('../libs/service.error'),
  stringify = require('./stringify'),
  gc = require('./get.class');

/**
 * Make sanitize function
 * @param {object} sanitizer - object with validate/sanitize functions
 * @return {object} Returns sanitize function
 */
function makeSanitize(sanitizer) {

  /**
   * Function which sanitize fields
   * @param {object} data - object for sanitize
   * @param {string|string[]} required - field names which required
   * @return {object} Returns sanitized data
   */
  return function sanitize(data, ...required) {

    if (gc(data) !== 'object') {

      return data;
    }

    if (required && typeof required === 'string') {

      required = [required];
    }

    const strData = stringify(data),
      keys = Object.keys(strData);

    const emptyKey = required.find(key => !keys.includes(key) || strData[key] === 'undefined' || strData[key] === undefined);

    if (emptyKey) {

      throw new ServiceError({
        message: 'Field required: ' + emptyKey,
        code: 'FIELD_REQUIRED',
        data: {[emptyKey]: data[emptyKey]},
      });
    }

    let key, val, valid;

    for (let i = 0; i < keys.length; i++) {

      key = keys[i];
      val = strData[key];

      if (!sanitizer[key]) {

        throw new ServiceError({
          message: 'Field is not allowed: ' + key,
          code: 'FIELD_NOT_ALLOWED',
          data: {[key]: data[key]},
        });
      }

      if (sanitizer[key].validate) {

        valid = sanitizer[key].validate(val);

        if (!valid) {

          throw new ServiceError({
            message: 'Field not valid: ' + key,
            code: 'FIELD_NOT_VALID',
            data: {[key]: data[key]},
          });
        }
      }

      if (sanitizer[key].sanitize) {

        strData[key] = sanitizer[key].sanitize(val);
      }
    }

    return strData;
  };
}

module.exports = makeSanitize;
