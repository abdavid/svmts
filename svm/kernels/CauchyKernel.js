var SVM;
(function (SVM) {
    (function (Kernels) {
        var CauchyKernel = (function () {
            function CauchyKernel(sigma) {
                if (typeof sigma === "undefined") { sigma = 1; }
                this.sigma = sigma;
            }
            CauchyKernel.prototype.run = function (x, y) {
                if (x == y) {
                    return 1.0;
                }

                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                return (1.0 / (1.0 + norm / this.sigma));
            };
            return CauchyKernel;
        })();
        Kernels.CauchyKernel = CauchyKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=CauchyKernel.js.map
