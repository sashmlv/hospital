'use strict';

const ServiceError = require('../libs/service.error');

/**
 * Make error caller
 * @param {object} errors
 * @return {function} Return function for call errors
 */
module.exports = function makeErrorCaller(errors) {

  return function (code, data) {

    if (!errors[code]) {

      throw new ServiceError({
        message: 'Error not found',
        code: 'MAKE_ERROR_CALLER',
        data: code,
      });
    }

    errors[code].data = data;
    return errors[code];
  };
};

