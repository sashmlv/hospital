'use strict';

const snakeToCamel = require('./snake.to.camel');

/**
 * Get error
 * @param {object} err - original error
 * @param {object} newErr - new error data
 * @return {object} Return error
 */
function getErr(err, newErr) {

  if (err.detail) {

    const match = err.detail.match(/\((.+)\)=\((.+)\)/);

    if(match[1] && match[2]) {

      err.data = {[snakeToCamel(match[1])]: match[2]};
    }
  }
  return newErr ? Object.assign(err, newErr) : err;
}

const errors = {

  23503: err => getErr(err, {
    message: 'Value is not present in table',
    code: 'NOT_PRESENT',
    status: 400,
  }),
};

module.exports = errors;
