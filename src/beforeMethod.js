const { decorate } = require('./util');

function handleDescriptor(target, key, descriptor, [handle = null]) {
    const fn = descriptor.value;

    return {
        ...descriptor,
        value() {
            let metadata = {
                className: target.constructor.name,
                methodName: key,
                args: arguments
            };
            if (handle) {
                handle(metadata);
            }
            return fn.apply(this, metadata.args);
        }
    };
}

/**
 * 允许在方法执行前自定义逻辑并且修改metadata中的输入参数
 * @param args
 * @param [handle] {Function} - 自定义方法,接收一个metadata参数，有以下属性className，methodName和args
 * @returns {*}
 */
module.exports = function beforeMethod(...args) {
    return decorate(handleDescriptor, args);
};
