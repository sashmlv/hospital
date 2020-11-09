'use strict';

const {spawn} = require('child_process'),
  argv = process.argv.slice();

argv.splice(0, 2);

const commands = [
    {
      cmd: 'npm',
      arg: ['run', 'db:test:up'],
    },
    {
      cmd: 'npm',
      arg: ['run', 'migration:up'],
    },
    {
      cmd: `ava ${argv.join(' ')}`,
    },
    {
      cmd: 'npm',
      arg: ['run', 'db:test:down'],
      opt: {

        always: true,
      }
    }
  ];

(async () => {

  let isErr = false;

  for (let i = 0; i < commands.length; i ++) {

    try {

      const {cmd, arg, opt = {}} = commands[i];

      opt.stdio = opt.hasOwnProperty('stdio') ? opt.stdio : 'inherit';
      opt.shell = opt.hasOwnProperty('shell') ? opt.shell : true;

      if ( ! isErr || opt.always ) {

        await execute(cmd, arg, opt);
      }
    }
    catch (e) {

      isErr = true;
      process.stdout.write(`${e}`);
    };
  };
})();

function onExit(childProcess) {

  return new Promise((resolve, reject) => {
  });
}

/**
 * Execute command
 * @param {string} command
 * @param {array} arg
 * @param {object} opt
 * @return {object} Return child process
 **/
function execute (task, arg, opt, wait) {

  return new Promise((res, rej) => {

    const child = spawn(task, arg, opt);

    child.on('exit', code => {

      if (code) {

        rej(new Error('Exit with error code: ' + code));
      }
      res();
    });

    child.on('error', err => {

      rej(err);
    });
  });
};
