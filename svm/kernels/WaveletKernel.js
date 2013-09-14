var WaveletKernel = (function () {
    function WaveletKernel(dilation, translation, invariant, mother) {
        if (typeof dilation === "undefined") { dilation = 1.0; }
        if (typeof translation === "undefined") { translation = 1.0; }
        if (typeof invariant === "undefined") { invariant = true; }
        if (typeof mother === "undefined") { mother = null; }
        this.invariant = true;
        this.invariant = invariant;
        this.dilation = dilation;
        this.translation = translation;
        this._mother = mother || this.mother;
    }
    WaveletKernel.prototype.run = function (x, y) {
        var prod = 1.0;

        if (this.invariant) {
            for (var i = 0; i < x.length; i++) {
                prod *= (this._mother((x[i] - this.translation) / this.dilation)) * (this._mother((y[i] - this.translation) / this.dilation));
            }
        } else {
            for (var i = 0; i < x.length; i++) {
                prod *= this._mother((x[i] - y[i] / this.dilation));
            }
        }

        return prod;
    };

    WaveletKernel.prototype.mother = function (x) {
        return Math.cos(1.75 * x) * Math.exp(-(x * x) / 2.0);
    };
    return WaveletKernel;
})();
//# sourceMappingURL=WaveletKernel.js.map
