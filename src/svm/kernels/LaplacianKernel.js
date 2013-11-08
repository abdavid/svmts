var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var LaplacianKernel = (function (_super) {
            __extends(LaplacianKernel, _super);
            function LaplacianKernel(gamma, sigma) {
                if (typeof gamma === "undefined") { gamma = 1; }
                if (typeof sigma === "undefined") { sigma = 1; }
                _super.call(this);
                this.properties = {
                    gamma: {
                        type: 'number',
                        value: 0
                    },
                    sigma: {
                        type: 'number',
                        value: 0
                    }
                };

                this.setProperty('sigma', sigma);
                this.setProperty('gamma', gamma);
            }
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

                return Math.exp(-this.properties.gamma.value * norm);
            };

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

                return (1.0 / -this.properties.gamma.value) * Math.log(1.0 - 0.5 * norm);
            };
            return LaplacianKernel;
        })(Kernels.BaseKernel);
        Kernels.LaplacianKernel = LaplacianKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=LaplacianKernel.js.map
