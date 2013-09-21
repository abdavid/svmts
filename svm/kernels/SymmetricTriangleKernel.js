var SVM;
(function (SVM) {
    (function (Kernels) {
        var SymmetricTriangleKernel = (function () {
            function SymmetricTriangleKernel(gamma) {
                if (typeof gamma === "undefined") { gamma = 1.0; }
                this.gamma = gamma;
            }
            SymmetricTriangleKernel.prototype.run = function (x, y) {
                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                var z = 1.0 - this.gamma * Math.sqrt(norm);

                return (z > 0) ? z : 0;
            };
            return SymmetricTriangleKernel;
        })();
        Kernels.SymmetricTriangleKernel = SymmetricTriangleKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SymmetricTriangleKernel.js.map
