'use strict';

module.exports = s => s.replace(/_\w/g, k => k[1].toUpperCase());