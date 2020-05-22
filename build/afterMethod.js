'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _require = require('./util'),
    decorate = _require.decorate;

function doHandler(handle, metadata) {
    var doHandlerResult = handle(metadata);
    if (doHandlerResult && doHandlerResult.constructor.name === 'Promise') {
        return doHandlerResult.then(function () {
            return metadata.result;
        });
    } else {
        return metadata.result;
    }
}

function handleDescriptor(target, key, descriptor, _ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        _ref2$ = _ref2[0],
        handle = _ref2$ === undefined ? null : _ref2$;

    var fn = descriptor.value;

    return _extends({}, descriptor, {
        value: function value() {
            var metadata = {
                className: target.constructor.name,
                methodName: key,
                args: arguments
            };
            var methodCallResult = fn.apply(this, arguments);
            if (methodCallResult && methodCallResult.constructor.name === 'Promise') {
                return methodCallResult.then(function (result) {
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
module.exports = function afterMethod() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return decorate(handleDescriptor, args);
};