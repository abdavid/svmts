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
        * @class CauchyKernel
        *
        * @summary
        * The Cauchy kernel comes from the Cauchy distribution (Basak, 2008). It is a
        * long-tailed kernel and can be used to give long-range influence and sensitivity
        * over the high dimension space.
        */
        var CauchyKernel = (function (_super) {
            __extends(CauchyKernel, _super);
            function CauchyKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    sigma: {
                        type: PropertyType.NUMBER,
                        value: 1,
                        writable: true
                    }
                });
            }
            CauchyKernel.prototype.run = function (x, y) {
                if (x == y) {
                    return 1.0;
                }

                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                return (1.0 / (1.0 + norm / this.sigma));
            };
            return CauchyKernel;
        })(Kernels.BaseKernel);
        Kernels.CauchyKernel = CauchyKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=CauchyKernel.js.map
