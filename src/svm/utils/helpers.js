/**
* Created by davidatborresen on 21.09.13.
*/
define(["require", "exports"], function(require, exports) {
    ///<reference path='../../definitions/underscore.d.ts' />
    function arrayPopulate(delta, value) {
        var result;
        if (_.isString(value) || _.isNumber(value)) {
            result = value;
        } else if (_.isFunction(value)) {
            result = value.call(this, arguments);
        } else {
            throw 'Passed value is not supported.';
        }

        return Array.apply(null, new Array(delta)).map(function () {
            return result;
        }, value);
    }
    exports.arrayPopulate = arrayPopulate;
});
//# sourceMappingURL=helpers.js.map
