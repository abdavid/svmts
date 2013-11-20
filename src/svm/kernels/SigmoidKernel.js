var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 9/3/13.
    */
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * @class SigmoidKernel
        * Sigmoid kernel of the form k(x,z) = tanh(a * x'z + c).
        * Sigmoid _kernels are only conditionally positive definite for some values of a and c,
        * and therefore may not induce a reproducing kernel Hilbert space. However, they have been successfully
        * used in practice (Scholkopf and Smola, 2002).
        *
        * @TODO add estimation function for initialization of kernel correctly.
        */
        var SigmoidKernel = (function (_super) {
            __extends(SigmoidKernel, _super);
            function SigmoidKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    alpha: {
                        type: PropertyType.NUMBER,
                        value: 0.01,
                        writable: true
                    },
                    constant: {
                        type: PropertyType.NUMBER,
                        value: -Math.E,
                        writable: true
                    }
                });
            }
            /**
            * Sigmoid kernel function.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Dot product in feature (kernel) space
            */
            SigmoidKernel.prototype.run = function (x, y) {
                var sum = 0.0;

                for (var i = 0; i < x.length; i++) {
                    sum += x[i] * y[i];
                }

                return this.tanh(this.alpha * sum + this.constant);
            };

            /**
            * TanH function.
            *
            * @todo review this. FF14 apparently handles this poorly,
            * while chrome handles it just fine.
            *
            * @param arg
            * @returns {number}
            */
            SigmoidKernel.prototype.tanh = function (arg) {
                var pos = Math.exp(arg), neg = Math.exp(-arg);

                return (pos - neg) / (pos + neg);
            };
            return SigmoidKernel;
        })(Kernels.BaseKernel);
        Kernels.SigmoidKernel = SigmoidKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SigmoidKernel.js.map
