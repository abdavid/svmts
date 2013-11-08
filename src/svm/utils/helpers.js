var SVM;
(function (SVM) {
    (function (Util) {
        function arrayPopulate(delta, value) {
            var result;
            if (_.isString(value) || _.isNumber(value)) {
                result = value;
            } else if (_.isFunction(value)) {
                result = value.call(this, arguments);
            } else {
                throw new Error('Passed value is not supported.');
            }

            return Array.apply(null, new Array(delta)).map(function () {
                return result;
            }, value);
        }
        Util.arrayPopulate = arrayPopulate;
    })(SVM.Util || (SVM.Util = {}));
    var Util = SVM.Util;
})(SVM || (SVM = {}));
//# sourceMappingURL=helpers.js.map
