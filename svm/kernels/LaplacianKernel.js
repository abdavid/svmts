var SVM;
(function (SVM) {
    (function (Kernels) {
        var LaplacianKernel = (function () {
            function LaplacianKernel(gamma, sigma) {
                if (typeof gamma === "undefined") { gamma = 1; }
                if (typeof sigma === "undefined") { sigma = 1; }
                this.sigma = sigma;
                this.gamma = gamma;
            }
            LaplacianKernel.prototype.run = function (x, y) {
                if (x == y) {
                    return 1.0;
                }

                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                norm = Math.sqrt(norm);

                return Math.exp(-this.gamma * norm);
            };
            return LaplacianKernel;
        })();
        Kernels.LaplacianKernel = LaplacianKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=LaplacianKernel.js.map
