'use strict';

const db = require('../lib/db-sql'),
  log = require('../lib/logger'),
  {readdirSync} = require('fs'),
  path = require('path');

(async _=> {

  const dirs = readdirSync(__dirname, {withFileTypes: true})
    .filter(v => v.isDirectory())
    .map(v => path.resolve(`${__dirname}/${v.name}`));

  await db.migrate.down({

    sortDirsSeparately: true,
    directory: dirs,
  });

  log.info(`Migration down done: ${ await db.migrate.currentVersion()}`);
})();
