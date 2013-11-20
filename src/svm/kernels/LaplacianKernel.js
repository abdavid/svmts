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
        * Laplacian Kernel.
        */
        var LaplacianKernel = (function (_super) {
            __extends(LaplacianKernel, _super);
            function LaplacianKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    gamma: {
                        type: PropertyType.NUMBER,
                        value: 1,
                        writable: true
                    },
                    sigma: {
                        type: PropertyType.NUMBER,
                        value: 1,
                        writable: true
                    }
                });
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            LaplacianKernel.prototype.run = function (x, y) {
                if (x == y) {
                    return 1.0;
                }

                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                norm = Math.sqrt(norm);

                return Math.exp(-this.gamma * norm);
            };

            /**
            * Computes the distance in input space
            * between two points given in feature space.
            *
            * @param x Vector X in input space
            * @param y Vector Y in input space
            * @returns {number} Distance between x and y in input space.
            */
            LaplacianKernel.prototype.distance = function (x, y) {
                if (x == y) {
                    return 0.0;
                }

                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                norm = Math.sqrt(norm);

                return (1.0 / -this.gamma) * Math.log(1.0 - 0.5 * norm);
            };
            return LaplacianKernel;
        })(Kernels.BaseKernel);
        Kernels.LaplacianKernel = LaplacianKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=LaplacianKernel.js.map
