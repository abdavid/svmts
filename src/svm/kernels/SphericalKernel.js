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
        * The spherical kernel comes from a statistics perspective. It is an example
        * of an isotropic stationary kernel and is positive definite in R^3.
        */
        var SphericalKernel = (function (_super) {
            __extends(SphericalKernel, _super);
            function SphericalKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    sigma: {
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
            SphericalKernel.prototype.run = function (x, y) {
                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                norm = Math.sqrt(norm);

                if (norm >= this.sigma) {
                    return 0;
                } else {
                    norm = norm / this.sigma;
                    return 1.0 - 1.5 * norm + 0.5 * norm * norm * norm;
                }
            };
            return SphericalKernel;
        })(Kernels.BaseKernel);
        Kernels.SphericalKernel = SphericalKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SphericalKernel.js.map
