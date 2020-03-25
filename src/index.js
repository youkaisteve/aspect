exports.beforeMethod = require('./beforeMethod');
exports.afterMethod = require('./afterMethod');
exports.afterMethodOnClass = require('./afterMethodOnClass');
exports.beforeMethodOnClass = require('./beforeMethodOnClass');
const { decorate } = require('./util');
exports.decorate = decorate;
module.export = exports;
