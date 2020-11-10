'use strict';

const log = require('../libs/logger'),
  execute = require('./execute'),
  commands = require('./commands'),
  {
    TEST,
  } = require('../libs/config');

if (!TEST) {

  throw new Error('Please run test environment');
}

(async () => {

  let isErr = false;

  for (let i = 0; i < commands.length; i ++) {

    try {

      const {cmd, arg, opt = {}} = commands[i];

      opt.stdio = opt.hasOwnProperty('stdio') ? opt.stdio : 'inherit';
      opt.shell = opt.hasOwnProperty('shell') ? opt.shell : true;
      opt.spawn = opt.hasOwnProperty('spawn') ? opt.spawn : true;

      const {always, spawn} = opt;

      const str = `${cmd}${arg ? (' ' + arg.join(' ')) : ''}${opt ? (' | ' + JSON.stringify(opt)) : ''}`;

      log.info(str);

      if (!isErr || always) {

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
