exports.isDescriptor = function(desc) {
    if (!desc || !desc.hasOwnProperty) {
        return false;
    }

    const keys = ['value', 'initializer', 'get', 'set'];

    for (let i = 0, l = keys.length; i < l; i++) {
        if (desc.hasOwnProperty(keys[i])) {
            return true;
        }
    }

    return false;
};

exports.decorate = function(handleDescriptor, entryArgs) {
    if (isDescriptor(entryArgs[entryArgs.length - 1])) {
        return handleDescriptor(...entryArgs, []);
    } else {
        return function() {
            return handleDescriptor(...Array.prototype.slice.call(arguments), entryArgs);
        };
    }
};

module.export = exports;
