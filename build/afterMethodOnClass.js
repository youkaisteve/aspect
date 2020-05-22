'use strict';

/**
 * 在class的method执行后注入处理逻辑
 * @param options
 * @param {String} options.methodPattern - 过滤方法的正则表达式
 * @param {Function} options.handle - handle方法接收一个metadata参数，有以下属性className、methodName、args和result
 * @returns {Function}
 */
module.exports = function afterMethodOnClass(options) {
    options = Object.assign({}, {
        methodPattern: /\.*/,
        handle: function handle(metadata) {}
    }, options);

    return function (target) {
        Reflect.ownKeys(target.prototype).forEach(function (key) {
            if (key !== 'constructor' && target.prototype[key] && typeof target.prototype[key] === 'function') {
                if (!options.methodPattern || !options.methodPattern.test(key)) {
                    return;
                }
                var oldOne = target.prototype[key];
                var newOne = function newOne() {
                    var metaData = {
                        className: target.name,
                        methodName: key,
                        args: arguments
                    };
                    var result = oldOne.apply(this, arguments);

                    if (result.constructor.name === 'Promise') {
                        result.then(function (result) {
                            metaData.result = result || null;
                            options.handle(metaData);
                            return metaData.result;
                        });
                    } else {
                        metaData.result = result || null;
                        options.handle(metaData);
                        return metaData.result;
                    }
                };
                Reflect.defineProperty(target.prototype, key, {
                    value: newOne
                });
            }
        });
    };
};