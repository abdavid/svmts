var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        var PolynominalKernel = (function (_super) {
            __extends(PolynominalKernel, _super);
            function PolynominalKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    degree: {
                        type: PropertyType.NUMBER,
                        value: 1.0,
                        writable: true
                    },
                    constant: {
                        type: PropertyType.NUMBER,
                        value: 1.0,
                        writable: true
                    }
                });
            }
            /**
            * Polynomial kernel function.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Dot product in feature (kernel) space
            */
            PolynominalKernel.prototype.run = function (x, y) {
                var sum = this.constant;
                for (var i = 0; i < x.length; i++) {
                    sum += x[i] * y[i];
                }
                return Math.pow(sum, this.degree);
            };

            /**
            * Computes the distance in input space
            * between two points given in feature space.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Distance between x and y in input space.
            */
            PolynominalKernel.prototype.distance = function (x, y) {
                var q = 1.0 / this.degree;

                return Math.pow(this.run(x, x), q) + Math.pow(this.run(y, y), q) - 2.0 * Math.pow(this.run(x, y), q);
            };
            return PolynominalKernel;
        })(Kernels.BaseKernel);
        Kernels.PolynominalKernel = PolynominalKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=PolynominalKernel.js.map
