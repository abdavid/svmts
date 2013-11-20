/**
* Created by davidatborresen on 29.09.13.
*/
///<reference path='../../definitions/underscore.d.ts' />
///<reference path='../interfaces/IKernel.ts' />
var PropertyType = (function () {
    function PropertyType() {
    }
    PropertyType.NUMBER = 'number';
    PropertyType.BOOLEAN = 'boolean';
    PropertyType.UNDEFINED = 'undefined';
    return PropertyType;
})();

var SVM;
(function (SVM) {
    (function (Kernels) {
        var BaseKernel = (function () {
            function BaseKernel() {
                this.properties = {};
            }
            BaseKernel.prototype.initialize = function (map) {
                this.properties = map;
                Object.defineProperties(this, this.properties);
                console.log('defining getters / setters for %O', this.properties);
            };

            /**
            * @returns {string[]}
            */
            BaseKernel.prototype.getProperties = function () {
                return Object.keys(this.properties);
            };

            /**
            * @param name
            * @returns {*}
            */
            BaseKernel.prototype.getProperty = function (name) {
                if (name in this.properties) {
                    return this.properties[name];
                }

                return null;
            };

            /**
            * @param name
            * @returns {any}
            */
            BaseKernel.prototype.getPropertyType = function (name) {
                return this.properties[name].type || void (name);
            };
            return BaseKernel;
        })();
        Kernels.BaseKernel = BaseKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=BaseKernel.js.map
