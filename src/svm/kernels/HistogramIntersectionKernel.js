var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var HistogramIntersectionKernel = (function (_super) {
            __extends(HistogramIntersectionKernel, _super);
            function HistogramIntersectionKernel(alpha, beta) {
                if (typeof alpha === "undefined") { alpha = 1; }
                if (typeof beta === "undefined") { beta = 1; }
                _super.call(this);
                this.properties = {
                    alpha: {
                        type: 'number',
                        value: 0
                    },
                    beta: {
                        type: 'number',
                        value: 0
                    }
                };

                this.setProperty('alpha', alpha);
                this.setProperty('beta', beta);
            }
            HistogramIntersectionKernel.prototype.run = function (x, y) {
                var sum = 0.0;
                for (var i = 0; i < x.length; i++) {
                    sum += Math.min(Math.pow(Math.abs(x[i]), this.properties.alpha.value), Math.pow(Math.abs(y[i]), this.properties.beta.value));
                }

                return sum;
            };
            return HistogramIntersectionKernel;
        })(Kernels.BaseKernel);
        Kernels.HistogramIntersectionKernel = HistogramIntersectionKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=HistogramIntersectionKernel.js.map
