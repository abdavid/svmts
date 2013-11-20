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
        /**
        * Squared Sinc Kernel.
        */
        var SquaredSincKernel = (function (_super) {
            __extends(SquaredSincKernel, _super);
            function SquaredSincKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    gamma: {
                        type: PropertyType.NUMBER,
                        value: 1.0,
                        writable: true
                    }
                });
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            SquaredSincKernel.prototype.run = function (x, y) {
                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                var num = this.gamma * Math.sqrt(norm);
                var den = this.gamma * this.gamma * norm;

                return Math.sin(num) / den;
            };
            return SquaredSincKernel;
        })(Kernels.BaseKernel);
        Kernels.SquaredSincKernel = SquaredSincKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SquaredSincKernel.js.map
