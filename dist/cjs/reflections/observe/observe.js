/*can-reflect@1.4.5#reflections/observe/observe*/
var canSymbol = require('can-symbol');
var slice = [].slice;
function makeFallback(symbolName, fallbackName) {
    return function (obj, event, handler, queueName) {
        var method = obj[canSymbol.for(symbolName)];
        if (method !== undefined) {
            return method.call(obj, event, handler, queueName);
        }
        return this[fallbackName].apply(this, arguments);
    };
}
function makeErrorIfMissing(symbolName, errorMessage) {
    return function (obj) {
        var method = obj[canSymbol.for(symbolName)];
        if (method !== undefined) {
            var args = slice.call(arguments, 1);
            return method.apply(obj, args);
        }
        throw new Error(errorMessage);
    };
}
module.exports = {
    onKeyValue: makeFallback('can.onKeyValue', 'onEvent'),
    offKeyValue: makeFallback('can.offKeyValue', 'offEvent'),
    onKeys: makeErrorIfMissing('can.onKeys', 'can-reflect: can not observe an onKeys event'),
    onKeysAdded: makeErrorIfMissing('can.onKeysAdded', 'can-reflect: can not observe an onKeysAdded event'),
    onKeysRemoved: makeErrorIfMissing('can.onKeysRemoved', 'can-reflect: can not unobserve an onKeysRemoved event'),
    getKeyDependencies: makeErrorIfMissing('can.getKeyDependencies', 'can-reflect: can not determine dependencies'),
    keyHasDependencies: makeErrorIfMissing('can.keyHasDependencies', 'can-reflect: can not determine if this has key dependencies'),
    onValue: makeErrorIfMissing('can.onValue', 'can-reflect: can not observe value change'),
    offValue: makeErrorIfMissing('can.offValue', 'can-reflect: can not unobserve value change'),
    getValueDependencies: makeErrorIfMissing('can.getValueDependencies', 'can-reflect: can not determine dependencies'),
    valueHasDependencies: makeErrorIfMissing('can.valueHasDependencies', 'can-reflect: can not determine if value has dependencies'),
    onEvent: function (obj, eventName, callback, queue) {
        if (obj) {
            var onEvent = obj[canSymbol.for('can.onEvent')];
            if (onEvent !== undefined) {
                return onEvent.call(obj, eventName, callback, queue);
            } else if (obj.addEventListener) {
                obj.addEventListener(eventName, callback, queue);
            }
        }
    },
    offEvent: function (obj, eventName, callback, queue) {
        if (obj) {
            var offEvent = obj[canSymbol.for('can.offEvent')];
            if (offEvent !== undefined) {
                return offEvent.call(obj, eventName, callback, queue);
            } else if (obj.removeEventListener) {
                obj.removeEventListener(eventName, callback, queue);
            }
        }
    }
};