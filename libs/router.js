'use strict';

const {ROOT} = require('../libs/config'),
  util = require('util'),
  Glob = require('glob').Glob,
  glob = util.promisify(Glob),
  routers = [];

module.exports = (async _=> {

  const paths = await glob(`${ROOT}/components/**/*.router.js`);

  for (let i = 0; i < paths.length; i++) {

    routers.push(require(paths[i]));
  }

  return routers;
})();