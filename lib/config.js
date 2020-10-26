'use strict';

const dotenv = require('dotenv'),
  path = require('path'),
  fs = require('fs'),
  ServiceError = require('./error'),
  ROOT = path.resolve(`${__dirname}/..`);

if (!fs.existsSync(`${ROOT}/.env`)) {

  throw new ServiceError('Config not found');
};

const result = dotenv.config({path: `${ROOT}/.env`}),
  env = process.env;

if (result.error) {

  throw result.error;
}

module.exports = {

  DEBUG: env.DEBUG,
  ROOT,
  NODE_ENV: env.NODE_ENV,
  PROD: env.NODE_ENV === 'production',
  DEV: env.NODE_ENV === 'development',
  SERVER: {

    HOST: env.HOST,
    PORT: env.PORT,
  },
  DB: {

    CLIENT: 'pg',
    VERSION: '12',
    HOST: env.DB_HOST,
    USER: env.DB_USER,
    PASSWORD: env.DB_PASSWORD,
    DATABASE: env.DB_NAME,
    DEBUG: env.DB_DEBUG,
  },
  LOG: {

    LEVEL: env.LOG_LEVEL,
    PRETTY: env.LOG_PRETTY,
  },
};
