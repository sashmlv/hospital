'use strict';

const log = require('../libs/logger'),
  execute = require('./execute'),
  {
    DB,
    TEST,
    TEST_DEV,
  } = require('../libs/config');

if (!TEST && !TEST_DEV) {

  throw new Error('Please run test environment');
}

const ok = DB && DB.DATABASE && DB.DATABASE.includes('test');

if (!ok) {

  throw new Error('Database name does not contain word "test", please check database params');
}

const commands = TEST ? require('./commands') :
  TEST_DEV ? require('./commands.dev') :
  undefined;

(async () => {

  let isErr = false;

  for (let i = 0; i < commands.length; i ++) {

    try {

      const {msg, cmd, arg, opt = {}} = commands[i];

      opt.stdio = opt.hasOwnProperty('stdio') ? opt.stdio : 'inherit';
      opt.shell = opt.hasOwnProperty('shell') ? opt.shell : true;
      opt.spawn = opt.hasOwnProperty('spawn') ? opt.spawn : true;

      const {always, spawn} = opt;

      if (!isErr || always) {

        if (msg) {
          log.info(msg);
        }

        if (spawn) {
          await execute(cmd, arg, opt);
        }
        else {
          await cmd(arg);
        }
      }
    }
    catch (err) {

      isErr = true;
      log.error(err);
    };
  };

  if (isErr) {

    process.exit(1);
  }
  else {

    process.exit(0);
  }
})();
