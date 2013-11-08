var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var CauchyKernel = (function (_super) {
            __extends(CauchyKernel, _super);
            function CauchyKernel(sigma) {
                if (typeof sigma === "undefined") { sigma = 1; }
                _super.call(this);
                this.properties = {
                    sigma: {
                        type: 'number',
                        value: 0
                    }
                };

                this.properties.sigma.value = sigma;
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

                return (1.0 / (1.0 + norm / this.properties.sigma.value));
            };
            return CauchyKernel;
        })(Kernels.BaseKernel);
        Kernels.CauchyKernel = CauchyKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=CauchyKernel.js.map
