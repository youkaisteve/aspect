var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const { decorate } = require('./util');

function doHandler(handle, metadata) {
    let doHandlerResult = handle(metadata);
    if (doHandlerResult && doHandlerResult.constructor.name === 'Promise') {
        return doHandlerResult.then(() => {
            return metadata.result;
        });
    } else {
        return metadata.result;
    }
}

function handleDescriptor(target, key, descriptor, [handle = null]) {
    const fn = descriptor.value;

    return _extends({}, descriptor, {
        value() {
            const metadata = {
                className: target.constructor.name,
                methodName: key,
                args: arguments
            };
            let methodCallResult = fn.apply(this, arguments);
            if (methodCallResult && methodCallResult.constructor.name === 'Promise') {
                return methodCallResult.then(result => {
                    metadata.result = result;
                    return doHandler(handle, metadata);
                });
            } else {
                metadata.result = methodCallResult;
                return doHandler(handle, metadata);
            }
        }
    });
}

/**
 * 允许在方法执行后自定义逻辑并且修改metadata的返回结果
 * @param args
 * @param [handle] {Function} - 自定义方法,接收一个metadata参数，有以下属性className，methodName和args
 * @returns {*}
 */
module.exports = function afterMethod(...args) {
    return decorate(handleDescriptor, args);
};