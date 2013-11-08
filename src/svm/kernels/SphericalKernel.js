var SVM;
(function (SVM) {
    (function (Kernels) {
        var SphericalKernel = (function () {
            function SphericalKernel(sigma) {
                if (typeof sigma === "undefined") { sigma = 1.0; }
                this._sigma = sigma;
            }
            SphericalKernel.prototype.run = function (x, y) {
                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                norm = Math.sqrt(norm);

                if (norm >= this._sigma) {
                    return 0;
                } else {
                    norm = norm / this._sigma;
                    return 1.0 - 1.5 * norm + 0.5 * norm * norm * norm;
                }
            };
            return SphericalKernel;
        })();
        Kernels.SphericalKernel = SphericalKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SphericalKernel.js.map
