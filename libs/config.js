'use strict';

const dotenv = require('dotenv'),
  path = require('path'),
  fs = require('fs'),
  ServiceError = require('./service.error'),
  ROOT = path.resolve(`${__dirname}/..`);

if (!fs.existsSync(`${ROOT}/.env`)) {

  throw new ServiceError('Config not found');
};

const result = dotenv.config({path: `${ROOT}/.env`}),
  env = process.env;

if (result.error) {

  throw result.error;
}

const PROD = env.NODE_ENV === 'production',
  DEV = env.NODE_ENV === 'development',
  TEST = env.NODE_ENV === 'test',
  TEST_DEV = env.NODE_ENV === 'test-dev';

const config = {

  DEBUG: env.DEBUG,
  ROOT,
  NODE_ENV: env.NODE_ENV,
  PROD,
  DEV,
  TEST,
  TEST_DEV,
  SERVER: {

    HOST: env.HOST,
    PORT: env.PORT,
  },
  DB: {

    CLIENT: env.DB_CLIENT,
    VERSION: env.DB_VERSION,
    HOST: TEST || TEST_DEV ? env.DB_TEST_HOST : env.DB_HOST,
    PORT: TEST || TEST_DEV ? env.DB_TEST_PORT : env.DB_PORT,
    USER: TEST || TEST_DEV ? env.DB_TEST_USER : env.DB_USER,
    PASSWORD: TEST || TEST_DEV ? env.DB_TEST_PASSWORD : env.DB_PASSWORD,
    DATABASE: TEST || TEST_DEV? env.DB_TEST_NAME : env.DB_NAME,
    DEBUG: TEST || TEST_DEV ? false : env.DB_DEBUG === 'true',
  },
  LOG: {

    ENABLED: true,
    LEVEL: env.LOG_LEVEL,
    PRETTY: env.LOG_PRETTY,
  },
  APP: {
    RECEPTION_DURATION: 30, // min
  }
};

module.exports = config;
