'use strict';

/**
 * Try execute callback
 * @param {function} callback
 * @param {function} done
 * @return {object} Return done
 */
module.exports = async function tryExecute (callback, done) {

  try {

    await callback();
  }
  catch (err) {

    return done(err);
  }

  return done();
};
