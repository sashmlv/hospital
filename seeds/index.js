'use strict';

const db = require('../lib/db-sql'),
  log = require('../lib/logger'),
  {readdirSync} = require('fs'),
  path = require('path');

(async _=> {

  try {

    const dirs = readdirSync(__dirname, {withFileTypes: true})
      .filter(v => v.isDirectory())
      .map(v => path.resolve(`${__dirname}/${v.name}`));

    await db.seed.run({

      sortDirsSeparately: true,
      directory: dirs,
    });
    log.info(`Seed done`);
    process.exit();
  }
  catch(err) {

    log.error(err);
    process.exit(1);
  }
})();
