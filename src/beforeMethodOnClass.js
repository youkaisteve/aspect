import {getLogger} from '../utils/logger'

const logger = getLogger('badger');

/**
 * 在class的method执行前注入处理逻辑
 * @param options
 * @param {String} options.methodPattern - 过滤方法的正则表达式
 * @param {Function} options.handle - handle方法接收一个metadata参数，有以下属性className、methodName、args
 * @returns {Function}
 */
export default function beforeMethodOnClass(options) {
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
                logger.debug(`beforeMethodOnClass decorator at ${target.name}.${key}`)
                let oldOne = target.prototype[key];
                let newOne = function () {
                    let metaData = {
                        target: this,
                        className: target.name,
                        methodName: key,
                        args: arguments
                    };
                    options.handle(metaData);
                    return oldOne.apply(this, metaData.args);
                };
                Reflect.defineProperty(target.prototype, key, {
                    value: newOne
                })
            }
        }));
    }
}