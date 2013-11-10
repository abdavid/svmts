var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var WaveKernel = (function (_super) {
            __extends(WaveKernel, _super);
            function WaveKernel(sigma) {
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
            WaveKernel.prototype.run = function (x, y) {
                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                if (this.properties.sigma.value == 0 || norm == 0) {
                    return 0;
                } else {
                    return (this.properties.sigma.value / norm) * Math.sin(norm / this.properties.sigma.value);
                }
            };
            return WaveKernel;
        })(Kernels.BaseKernel);
        Kernels.WaveKernel = WaveKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=WaveKernel.js.map
