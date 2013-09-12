var WaveletKernel = (function () {
    function WaveletKernel(invariant) {
        if (typeof invariant === "undefined") { invariant = true; }
        this.dilation = 1.0;
        this.translation = 0.0;
        this.invariant = true;
        this.invariant = invariant;
    }
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

    WaveletKernel.prototype.mother = function (x) {
        return Math.cos(1.75 * x) * Math.exp(-(x * x) / 2.0);
    };
    return WaveletKernel;
})();
//# sourceMappingURL=WaveletKernel.js.map
