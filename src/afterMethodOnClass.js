import {getLogger} from '../utils/logger'

const logger = getLogger('badger');

/**
 * 在class的method执行后注入处理逻辑
 * @param options
 * @param {String} options.methodPattern - 过滤方法的正则表达式
 * @param {Function} options.handle - handle方法接收一个metadata参数，有以下属性className、methodName、args和result
 * @returns {Function}
 */
export default function afterMethodOnClass(options) {
    options = Object.assign({}, {
        methodPattern: /\.*/,
        handle: function (metadata) {
            logger.info(JSON.stringify(metadata))
        }
    }, options);

    return function (target) {
        Reflect.ownKeys(target.prototype).forEach((key => {
            if (key !== 'constructor' && target.prototype[key] && typeof target.prototype[key] === 'function') {
                if (!options.methodPattern || !options.methodPattern.test(key)) {
                    return;
                }
                logger.debug(`afterMethodOnClass decorator at ${target.name}.${key}`);
                let oldOne = target.prototype[key];
                let newOne = function () {
                    const metaData = {
                        className: target.name,
                        methodName: key,
                        args: arguments
                    };
                    let result = oldOne.apply(this, arguments);

                    if (result.constructor.name === 'Promise') {
                        result.then(result => {
                            metaData.result = result || null;
                            options.handle(metaData);
                            return metaData.result;
                        })
                    } else {
                        metaData.result = result || null;
                        options.handle(metaData);
                        return metaData.result;
                    }
                };
                Reflect.defineProperty(target.prototype, key, {
                    value: newOne
                })
            }
        }));
    }
}