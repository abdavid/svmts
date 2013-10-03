var SVM;
(function (SVM) {
    (function (Kernels) {
        var PolynominalKernel = (function () {
            function PolynominalKernel(degree, constant) {
                if (typeof degree === "undefined") { degree = 1.0; }
                if (typeof constant === "undefined") { constant = 1.0; }
                this._degree = degree;
                this._constant = constant;
            }
            PolynominalKernel.prototype.run = function (x, y) {
                var sum = this._constant;
                for (var i = 0; i < x.length; i++) {
                    sum += x[i] * y[i];
                }
                return Math.pow(sum, this._degree);
            };

            PolynominalKernel.prototype.distance = function (x, y) {
                var q = 1.0 / this._degree;

                return Math.pow(this.run(x, x), q) + Math.pow(this.run(y, y), q) - 2.0 * Math.pow(this.run(x, y), q);
            };
            return PolynominalKernel;
        })();
        Kernels.PolynominalKernel = PolynominalKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=PolynominalKernel.js.map
