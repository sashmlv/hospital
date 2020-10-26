'use strict';

const dotenv = require('dotenv'),
  path = require('path'),
  fs = require('fs'),
  ServiceError = require('./error'),
  ROOT = path.resolve(`${__dirname}/..`);

if (!fs.existsSync(`${ROOT}/.env`)) {

  throw new ServiceError('Config not found');
};

const result = dotenv.config({path: `${ROOT}/.env`});

if (result.error) {

  throw result.error;
}

module.exports = {

  DEBUG: process.env.DEBUG,
  ROOT,
  NODE_ENV: process.env.NODE_ENV,
  PROD: process.env.NODE_ENV === 'production',
  DEV: process.env.NODE_ENV === 'development',
  SERVER: {

    HOST: process.env.HOST,
    PORT: process.env.PORT,
  },
  DB: {

    CLIENT: 'pg',
    VERSION: '12',
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_NAME,
    DEBUG: process.env.DB_DEBUG,
  },
  LOG: {

    LEVEL: process.env.LOG_LEVEL,
    PRETTY: process.env.LOG_PRETTY,
  },
};
