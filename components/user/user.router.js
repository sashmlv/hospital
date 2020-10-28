'use strict';

const {Router} = require('express'),
  router = Router(),
  tryExecute = require('../../modules/try.execute'),
  rc = require('./user.controller');

router.get(`/users`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.getUsers(req.query)}, next);
});

router.post(`/users`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.create(req.body)}, next);
});

router.get(`/user/:userId`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.getUser(req.params)}, next);
});

router.put(`/user/:userId`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.update({...req.params, ...req.body})}, next);
});

router.delete(`/user/:userId`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.delete(req.params)}, next);
});

module.exports = router;
