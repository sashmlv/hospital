'use strict';

const {Router} = require('express'),
  router = Router(),
  log = require('../lib/logger'),
  {ROOT} = require('../lib/config'),
  sui = require('swagger-ui-express'),
  yaml = require('yamljs'),
  file = `${ROOT}/api.yml`;

router.use(`/api`, (req, res, next) => {

    try {

      req.swaggerDoc = yaml.load(file);
    }
    catch (err) {

      log.error(err);
      return next(err);
    }
    return next();
  },

  sui.serve, sui.setup()
);

module.exports = router;
