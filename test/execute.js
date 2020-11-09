'use strict';

const {spawn} = require('child_process');

/**
 * Execute command
 * @param {string} command
 * @param {array} arg
 * @param {object} opt - options
 * @param {boolean} opt.always - execute command always
 * @param {boolean} opt.spawn - spawn the command
 * @return {object} Return child process
 **/
function execute (task, arg, opt, wait) {

  return new Promise((res, rej) => {

    const child = spawn(task, arg, opt);

    child.on('close', (code, signal) => {

      if (code) {

        rej(new Error(`Exit with error code: ${code} ${signal || ''}`));
      }
      res();
    });

    child.on('error', err => {

      rej(err);
    });
  });
}

module.exports = execute;
