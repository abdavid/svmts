var SVM;
(function (SVM) {
    (function (Kernels) {
        var BaseKernel = (function () {
            function BaseKernel(properties) {
                this._properties = {};
                this.initProperties(properties);
            }
            BaseKernel.prototype.initProperties = function (properties) {
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    this._properties[property.name] = property.value;
                }
            };

            BaseKernel.prototype.getKernelProperties = function () {
                return _.keys(this._properties);
            };

            BaseKernel.prototype.getKernelProperty = function (name) {
                if (name in this._properties) {
                    return this._properties[name];
                }

                return undefined;
            };

            BaseKernel.prototype.setKernelProperty = function (name, value) {
                if (name in this._properties) {
                    this._properties[name] = value;
                } else {
                    throw new Error('Undefined property');
                }
            };
            return BaseKernel;
        })();
        Kernels.BaseKernel = BaseKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=BaseKernel.js.map
