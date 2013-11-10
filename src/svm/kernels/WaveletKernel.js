var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var WaveletKernel = (function (_super) {
            __extends(WaveletKernel, _super);
            function WaveletKernel(dilation, translation, invariant, mother) {
                if (typeof dilation === "undefined") { dilation = 1.0; }
                if (typeof translation === "undefined") { translation = 1.0; }
                if (typeof invariant === "undefined") { invariant = true; }
                if (typeof mother === "undefined") { mother = null; }
                _super.call(this);
                this.properties = {
                    dilation: {
                        type: 'number',
                        value: 0
                    },
                    translation: {
                        type: 'number',
                        value: 0
                    },
                    invariant: {
                        type: 'boolean',
                        value: true
                    }
                };

                this.properties.invariant.value = invariant;
                this.properties.dilation.value = dilation;
                this.properties.translation.value = translation;
                this._mother = mother || this.mother;
            }
            WaveletKernel.prototype.run = function (x, y) {
                var prod = 1.0;

                if (this.properties.invariant) {
                    for (var i = 0; i < x.length; i++) {
                        prod *= (this._mother((x[i] - this.properties.translation.value) / this.properties.dilation.value)) * (this._mother((y[i] - this.properties.translation.value) / this.properties.dilation.value));
                    }
                } else {
                    for (var i = 0; i < x.length; i++) {
                        prod *= this._mother((x[i] - y[i] / this.properties.dilation.value));
                    }
                }

                return prod;
            };

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
