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
        * Symmetric Triangle Kernel.
        */
        var SymmetricTriangleKernel = (function (_super) {
            __extends(SymmetricTriangleKernel, _super);
            function SymmetricTriangleKernel() {
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
        })(Kernels.BaseKernel);
        Kernels.SymmetricTriangleKernel = SymmetricTriangleKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SymmetricTriangleKernel.js.map
