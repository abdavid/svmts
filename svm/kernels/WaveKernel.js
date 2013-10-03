var SVM;
(function (SVM) {
    (function (Kernels) {
        var WaveKernel = (function () {
            function WaveKernel(sigma) {
                if (typeof sigma === "undefined") { sigma = 1; }
                this._sigma = sigma;
            }
            WaveKernel.prototype.run = function (x, y) {
                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                if (this._sigma == 0 || norm == 0) {
                    return 0;
                } else {
                    return (this._sigma / norm) * Math.sin(norm / this._sigma);
                }
            };
            return WaveKernel;
        })();
        Kernels.WaveKernel = WaveKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=WaveKernel.js.map
