var SphericalKernel = (function () {
    function SphericalKernel(sigma) {
        this.sigma = sigma;
    }
    SphericalKernel.prototype.run = function (x, y) {
        var norm = 0.0;
        for (var i = 0; i < x.length; i++) {
            var d = x[i] - y[i];
            norm += d * d;
        }

        norm = Math.sqrt(norm);

        if (norm >= this.sigma) {
            return 0;
        } else {
            norm = norm / this.sigma;
            return 1.0 - 1.5 * norm + 0.5 * norm * norm * norm;
        }
    };
    return SphericalKernel;
})();
//# sourceMappingURL=SphericalKernel.js.map
