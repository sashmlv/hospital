'use strict';

const {Router} = require('express'),
  router = Router(),
  {tryExecute} = require('../../modules'),
  rc = require('./role.controller');

router.get(`/roles`, async (req, res, next) => {

  return await tryExecute(
    async _=> res.locals.result = {
      data: await rc.getRoles(req.query),
    },
    next,
  );
});

router.post(`/roles`, async (req, res, next) => {

  return await tryExecute(
    async _=> res.locals.result = {
      data: await rc.create(req.body),
    },
    next,
  );
});

router.get(`/role/:roleId`, async (req, res, next) => {

  return await tryExecute(
    async _=> res.locals.result = {
      data: await rc.getRole(req.params),
    },
    next,
  );
});

router.put(`/role/:roleId`, async (req, res, next) => {

  return await tryExecute(
    async _=> res.locals.result = {
      data: await rc.update({...req.params, ...req.body}),
    },
    next,
  );
});

router.delete(`/role/:roleId`, async (req, res, next) => {

  return await tryExecute(
    async _=> res.locals.result = {
      data: await rc.delete(req.params),
    },
    next,
  );
});

module.exports = router;
