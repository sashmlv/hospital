'use strict';

const ServiceError = require('../libs/service.error'),
  snakeToCamel = require('./snake.to.camel');

const errors = {

  23503: err => new ServiceError({
    message: 'Value is not present in table',
    code: 'NOT_PRESENT',
    data: getErrData(err),
  }),

  23505: err => new ServiceError({
    message: 'Value already exists',
    code: 'ALREADY_EXISTS',
    data: getErrData(err),
  }),
};

/**
 * Get error data
 * @param {object} err - original error
 * @return {object} Return error data
 */
function getErrData(err) {

  if (err.detail) {

    const match = err.detail.match(/\((.+)\)=\((.+)\)/);

    if(match[1] && match[2]) {

      return {[snakeToCamel(match[1])]: match[2]};
    }
  }

  return null;
}

module.exports = errors;
