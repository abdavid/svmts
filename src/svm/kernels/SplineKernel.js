var SVM;
(function (SVM) {
    (function (Kernels) {
        var SplineKernel = (function () {
            function SplineKernel() {
            }
            SplineKernel.prototype.run = function (x, y) {
                var k = 1;
                for (var i = 0; i < x.length; i++) {
                    var min = Math.min(x[i], y[i]);
                    var xy = x[i] * y[i];

                    k *= 1.0 + xy + xy * min - ((x[i] + y[i]) / 2.0) * min * min + (min * min * min) / 3.0;
                }

                return k;
            };
            return SplineKernel;
        })();
        Kernels.SplineKernel = SplineKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SplineKernel.js.map
