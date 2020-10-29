'use strict';

function getClass(x) {

   return {}.toString.call(x).slice(8, -1).toLowerCase();
};

module.exports = getClass;
