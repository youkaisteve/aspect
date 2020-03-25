const beforeMethod = require('./beforeMethod');
const afterMethod = require('./afterMethod');
const afterMethodOnClass = require('./afterMethodOnClass');
const beforeMethodOnClass = require('./beforeMethodOnClass');
const { decorate } = require('./util');

module.export = {
    decorate,
    beforeMethod,
    afterMethod,
    afterMethodOnClass,
    beforeMethodOnClass
};
