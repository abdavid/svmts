var SVM;
(function (SVM) {
    (function (Kernels) {
        var WaveletKernel = (function () {
            function WaveletKernel(dilation, translation, invariant, mother) {
                if (typeof dilation === "undefined") { dilation = 1.0; }
                if (typeof translation === "undefined") { translation = 1.0; }
                if (typeof invariant === "undefined") { invariant = true; }
                if (typeof mother === "undefined") { mother = null; }
                this._invariant = true;
                this._invariant = invariant;
                this._dilation = dilation;
                this._translation = translation;
                this._mother = mother || this.mother;
            }
            WaveletKernel.prototype.run = function (x, y) {
                var prod = 1.0;

                if (this._invariant) {
                    for (var i = 0; i < x.length; i++) {
                        prod *= (this._mother((x[i] - this._translation) / this._dilation)) * (this._mother((y[i] - this._translation) / this._dilation));
                    }
                } else {
                    for (var i = 0; i < x.length; i++) {
                        prod *= this._mother((x[i] - y[i] / this._dilation));
                    }
                }

                return prod;
            };

            WaveletKernel.prototype.mother = function (x) {
                return Math.cos(1.75 * x) * Math.exp(-(x * x) / 2.0);
            };
            return WaveletKernel;
        })();
        Kernels.WaveletKernel = WaveletKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=WaveletKernel.js.map
