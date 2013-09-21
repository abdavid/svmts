var SVM;
(function (SVM) {
    (function (Kernels) {
        var HistogramIntersectionKernel = (function () {
            function HistogramIntersectionKernel(alpha, beta) {
                if (typeof alpha === "undefined") { alpha = 1; }
                if (typeof beta === "undefined") { beta = 1; }
                this.alpha = alpha;
                this.beta = beta;
            }
            HistogramIntersectionKernel.prototype.run = function (x, y) {
                var sum = 0.0;
                for (var i = 0; i < x.length; i++) {
                    sum += Math.min(Math.pow(Math.abs(x[i]), this.alpha), Math.pow(Math.abs(y[i]), this.beta));
                }

                return sum;
            };
            return HistogramIntersectionKernel;
        })();
        Kernels.HistogramIntersectionKernel = HistogramIntersectionKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=HistogramIntersectionKernel.js.map
