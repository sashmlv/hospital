'use strict';

const {Router} = require('express'),
  router = Router(),
  tryExecute = require('../../modules/try.execute'),
  rc = require('./reception.controller');

router.get(`/receptions`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.getReceptions(req.query)}, next);
});

router.post(`/receptions`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.create(req.body)}, next);
});

router.get(`/reception/:receptionId`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.getReception(req.params)}, next);
});

router.put(`/reception/:receptionId`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.update({...req.params, ...req.body})}, next);
});

router.delete(`/reception/:receptionId`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.delete(req.params)}, next);
});

/* Add/Update reception intervals */
router.post(`/receptions/interval`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {
    data: await rc.createOrUpdateReceptionsInterval({...req.body, method: req.method})
  }, next);
});

/* Take reception by patient */
router.put(`/reception/take/:receptionId`, async (req, res, next) => {

  return tryExecute(async _=> res.locals.result = {data: await rc.receptionTake({...req.params, ...req.body})}, next);
});

module.exports = router;
