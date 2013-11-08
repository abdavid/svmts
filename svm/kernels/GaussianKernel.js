var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var GaussianKernel = (function (_super) {
            __extends(GaussianKernel, _super);
            function GaussianKernel(sigma) {
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

                this.sigma(sigma);
            }
            GaussianKernel.prototype.run = function (x, y) {
                if (x === y) {
                    return 1.0;
                }

                var norm = 0.0, d;

                if (typeof x == 'undefined') {
                    var foo = true;
                }

                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                return Math.exp(-this.gamma() * norm);
            };

            GaussianKernel.prototype.distance = function (x, y) {
                if (typeof x === 'number') {
                    return (1.0 / -this.gamma()) * Math.log(1.0 - 0.5 * x);
                } else if (x === y) {
                    return 0.0;
                }

                var norm = 0.0, d;
                for (var i = 0; i < x.length; i++) {
                    d = x[i] - y[i];
                    norm += d * d;
                }

                return (1.0 / -this.gamma()) * Math.log(1.0 - 0.5 * norm);
            };

            GaussianKernel.prototype.sigma = function (sigma) {
                if (typeof sigma === "undefined") { sigma = null; }
                if (!sigma) {
                    return this.properties.sigma.value;
                }

                this.properties.sigma.value = Math.sqrt(sigma);
                this.properties.gamma.value = 1.0 / (2.0 * sigma * sigma);
            };

            GaussianKernel.prototype.sigmaSquared = function (sigma) {
                if (typeof sigma === "undefined") { sigma = null; }
                if (!sigma) {
                    return this.properties.sigma.value * this.properties.sigma.value;
                }

                this.properties.sigma.value = Math.sqrt(sigma);
                this.properties.gamma.value = 1.0 / (2.0 * sigma);
            };

            GaussianKernel.prototype.gamma = function (gamma) {
                if (typeof gamma === "undefined") { gamma = null; }
                if (!gamma) {
                    return this.properties.gamma.value;
                }

                this.properties.gamma.value = gamma;
                this.properties.sigma.value = Math.sqrt(1.0 / (gamma * 2.0));
            };
            return GaussianKernel;
        })(Kernels.BaseKernel);
        Kernels.GaussianKernel = GaussianKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=GaussianKernel.js.map
