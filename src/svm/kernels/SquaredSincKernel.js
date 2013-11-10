var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var SquaredSincKernel = (function (_super) {
            __extends(SquaredSincKernel, _super);
            function SquaredSincKernel(gamma) {
                if (typeof gamma === "undefined") { gamma = 1.0; }
                _super.call(this);
                this.properties = {
                    gamma: {
                        type: 'number',
                        value: 0
                    }
                };

                this.properties.gamma.value = gamma;
            }
            SquaredSincKernel.prototype.run = function (x, y) {
                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                var num = this.properties.gamma.value * Math.sqrt(norm);
                var den = this.properties.gamma.value * this.properties.gamma.value * norm;

                return Math.sin(num) / den;
            };
            return SquaredSincKernel;
        })(Kernels.BaseKernel);
        Kernels.SquaredSincKernel = SquaredSincKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SquaredSincKernel.js.map
