var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var SigmoidKernel = (function (_super) {
            __extends(SigmoidKernel, _super);
            function SigmoidKernel(alpha, constant) {
                if (typeof alpha === "undefined") { alpha = 0.01; }
                if (typeof constant === "undefined") { constant = -Math.E; }
                _super.call(this);
                this.properties = {
                    alpha: {
                        type: 'number',
                        value: 0
                    },
                    constant: {
                        type: 'number',
                        value: 0
                    }
                };

                this.properties.alpha.value = alpha;
                this.properties.constant.value = constant;
            }
            SigmoidKernel.prototype.run = function (x, y) {
                var sum = 0.0;

                for (var i = 0; i < x.length; i++) {
                    sum += x[i] * y[i];
                }

                return this.tanh(this.properties.alpha.value * sum + this.properties.constant.value);
            };

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
