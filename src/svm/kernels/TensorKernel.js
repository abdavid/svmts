var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    (function (Kernels) {
        /**
        * Tensor Product combination of Kernels.
        */
        var TensorKernel = (function () {
            /**
            * @param kernels
            */
            function TensorKernel(kernels) {
                this._kernels = kernels;
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            TensorKernel.prototype.run = function (x, y) {
                var product = 1.0;
                for (var i = 0; i < this._kernels.length; i++) {
                    product *= this._kernels[i].run(x, y);
                }

                return product;
            };
            return TensorKernel;
        })();
        Kernels.TensorKernel = TensorKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=TensorKernel.js.map
