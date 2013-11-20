var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        var WaveletKernel = (function (_super) {
            __extends(WaveletKernel, _super);
            function WaveletKernel() {
                _super.call(this);

                _super.prototype.initialize.call(this, {
                    dilation: {
                        type: 'number',
                        value: 1.0,
                        writable: true
                    },
                    translation: {
                        type: 'number',
                        value: 1.0,
                        writable: true
                    },
                    invariant: {
                        type: 'boolean',
                        value: false,
                        writable: false
                    }
                });
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            WaveletKernel.prototype.run = function (x, y) {
                var prod = 1.0;

                if (this.invariant) {
                    for (var i = 0; i < x.length; i++) {
                        prod *= (this.mother((x[i] - this.translation) / this.dilation)) * (this.mother((y[i] - this.translation) / this.dilation));
                    }
                } else {
                    for (var i = 0; i < x.length; i++) {
                        prod *= this.mother((x[i] - y[i] / this.dilation));
                    }
                }

                return prod;
            };

            /**
            * @param x
            * @returns {number}
            */
            WaveletKernel.prototype.mother = function (x) {
                return Math.cos(1.75 * x) * Math.exp(-(x * x) / 2.0);
            };
            return WaveletKernel;
        })(Kernels.BaseKernel);
        Kernels.WaveletKernel = WaveletKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=WaveletKernel.js.map
