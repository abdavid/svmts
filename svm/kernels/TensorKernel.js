var SVM;
(function (SVM) {
    (function (Kernels) {
        var TensorKernel = (function () {
            function TensorKernel(kernels) {
                this.kernels = kernels;
            }
            TensorKernel.prototype.run = function (x, y) {
                var product = 1.0;
                for (var i = 0; i < this.kernels.length; i++) {
                    product *= this.kernels[i].run(x, y);
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
