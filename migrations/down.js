'use strict';

const db = require('../libs/db-sql'),
  log = require('../libs/logger'),
  {readdirSync} = require('fs'),
  path = require('path');

(async _=> {

  try {

    const dirs = readdirSync(__dirname, {withFileTypes: true})
      .filter(v => v.isDirectory())
      .map(v => path.resolve(`${__dirname}/${v.name}`));

    await db.migrate.down({

      sortDirsSeparately: true,
      directory: dirs,
    });
    log.info(`Migration down done: ${ await db.migrate.currentVersion()}`);
    process.exit();
  }
  catch(err) {

    log.error(err);
    process.exit(1);
  }
})();
