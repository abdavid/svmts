var SVM;
(function (SVM) {
    (function (Kernels) {
        var BaseKernel = (function () {
            function BaseKernel() {
                this.properties = {};
            }
            BaseKernel.prototype.getProperties = function () {
                return _.keys(this.properties);
            };

            BaseKernel.prototype.getProperty = function (name) {
                if (name in this.properties) {
                    return this.properties[name];
                }

                return undefined;
            };

            BaseKernel.prototype.setProperty = function (name, value) {
                if (name in this) {
                    this[name](value);
                } else if (name in this.properties && 'value' in this.properties[name]) {
                    this.properties[name].value = value;
                } else {
                    throw new Error('Undefined property');
                }

                return this;
            };
            return BaseKernel;
        })();
        Kernels.BaseKernel = BaseKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=BaseKernel.js.map
