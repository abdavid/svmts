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
        var LinearKernel = (function (_super) {
            __extends(LinearKernel, _super);
            /**
            * @param constant
            */
            function LinearKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    constant: {
                        type: PropertyType.NUMBER,
                        value: 1,
                        writable: true
                    }
                });
            }
            /**
            * Linear kernel function.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Dot product in feature (kernel) space
            */
            LinearKernel.prototype.run = function (x, y) {
                var sum = this.constant;

                for (var i = 0; i < x.length; i++) {
                    sum += x[i] * y[i];
                }

                return sum;
            };

            /**
            * Computes the distance in input space
            * between two points given in feature space.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Distance between x and y in input space.
            */
            LinearKernel.prototype.distance = function (x, y) {
                return this.run(x, x) + this.run(y, y) - 2.0 * this.run(x, y);
            };
            return LinearKernel;
        })(Kernels.BaseKernel);
        Kernels.LinearKernel = LinearKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=LinearKernel.js.map
