var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var SphericalKernel = (function (_super) {
            __extends(SphericalKernel, _super);
            function SphericalKernel(sigma) {
                if (typeof sigma === "undefined") { sigma = 1.0; }
                _super.call(this);
                this.properties = {
                    sigma: {
                        type: 'number',
                        value: 0
                    }
                };

                this.properties.sigma.value = sigma;
            }
            SphericalKernel.prototype.run = function (x, y) {
                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                norm = Math.sqrt(norm);

                if (norm >= this.properties.sigma.value) {
                    return 0;
                } else {
                    norm = norm / this.properties.sigma.value;
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
