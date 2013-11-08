var SVM;
(function (SVM) {
    (function (Kernels) {
        var SquaredSincKernel = (function () {
            function SquaredSincKernel(gamma) {
                if (typeof gamma === "undefined") { gamma = 1.0; }
                this._gamma = gamma;
            }
            SquaredSincKernel.prototype.run = function (x, y) {
                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                var num = this._gamma * Math.sqrt(norm);
                var den = this._gamma * this._gamma * norm;

                return Math.sin(num) / den;
            };
            return SquaredSincKernel;
        })();
        Kernels.SquaredSincKernel = SquaredSincKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SquaredSincKernel.js.map
