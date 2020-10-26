'use strict';

class ServiceError extends Error {

   constructor(args) {

      super();

      const {
         message,
         code,
         data,
         status,
      } = args;

      this.message = message;
      this.code = code;
      this.status = status;
      this.data = data;

      if (Error.captureStackTrace) {

         Error.captureStackTrace(this, this.constructor);
      }
      else {

         this.stack = (new Error()).stack;
      };
   };
};

module.exports = ServiceError;