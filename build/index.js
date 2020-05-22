'use strict';

exports.beforeMethod = require('./beforeMethod');
exports.afterMethod = require('./afterMethod');
exports.afterMethodOnClass = require('./afterMethodOnClass');
exports.beforeMethodOnClass = require('./beforeMethodOnClass');

var _require = require('./util'),
    decorate = _require.decorate;

exports.decorate = decorate;
module.export = exports;