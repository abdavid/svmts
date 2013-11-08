var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var PolynominalKernel = (function (_super) {
            __extends(PolynominalKernel, _super);
            function PolynominalKernel(degree, constant) {
                if (typeof degree === "undefined") { degree = 1.0; }
                if (typeof constant === "undefined") { constant = 1.0; }
                _super.call(this);
                this.properties = {
                    degree: {
                        type: 'number',
                        value: 0
                    },
                    constant: {
                        type: 'number',
                        value: 0
                    }
                };

                this.setProperty('degree', degree);
                this.setProperty('constant', constant);
            }
            PolynominalKernel.prototype.run = function (x, y) {
                var sum = this.properties.constant.value;
                for (var i = 0; i < x.length; i++) {
                    sum += x[i] * y[i];
                }
                return Math.pow(sum, this.properties.degree.value);
            };

            PolynominalKernel.prototype.distance = function (x, y) {
                var q = 1.0 / this.properties.degree.value;

                return Math.pow(this.run(x, x), q) + Math.pow(this.run(y, y), q) - 2.0 * Math.pow(this.run(x, y), q);
            };
            return PolynominalKernel;
        })(Kernels.BaseKernel);
        Kernels.PolynominalKernel = PolynominalKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=PolynominalKernel.js.map
