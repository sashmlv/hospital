'use strict';

class ServiceError extends Error {

  constructor(args) {

    super();

    if (typeof args === 'string') {

      args = {message: args};
    }

    const {
      message,
      code,
      status,
      data,
    } = args;

    this.name = 'ServiceError';
    this.message = message || 'Service error';
    this.code = code || 'SERVICE_ERROR';
    this.status = status || 400;
    this.data = data;

    if (Error.captureStackTrace) {

      Error.captureStackTrace(this, this.constructor);
    }
    else {

      this.stack = (new Error()).stack;
    }
  }
}

module.exports = ServiceError;